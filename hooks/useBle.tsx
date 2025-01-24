import { CHARACTERISTICS_UUID } from "@/constants/Characteristics";
import * as Speech from "expo-speech"
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { BleManager, State, Device, Characteristic, UUID, BleError, LogLevel, Subscription, BleErrorCode } from 'react-native-ble-plx';
import { Buffer } from "buffer";
import { useWeather } from "./useWeather";

type BleContextProps = {
  devices: Device[]
  connectedDevice?: Device | null
  error: Error | null
  isScanning: boolean
  isNotifying: boolean
  isConnecting: boolean
  scanForDevices: () => void
  connectToDevice: (deviceId: string, enableNotifications: boolean) => Promise<void>
  disconnectFromDevice: () => Promise<void>
  enableNotifications: () => void
  unableNotifications: () => void
  readCharacteristic: (characteristicUuid: string) => Promise<string | null>
  writeCharacteristic: (characteristicUuid: string, value: string) => Promise<void>
}

const BleContext = createContext<BleContextProps | null>(null)

const manager = new BleManager()

export function BleContextProvider({ children }: React.PropsWithChildren) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [notificationSub, setNotificationSub] = useState<Subscription | null>(null)
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const { available, data, speakWeather } = useWeather();

  useEffect(() => {
    manager.setLogLevel(LogLevel.Verbose);

    return () => {
      manager.destroy();
    };
  }, [manager]);

  const speak = useCallback(
    (error: BleError | null, c: Characteristic | null) => {
      if (error) {
        const {
          androidErrorCode,
          attErrorCode,
          errorCode,
          iosErrorCode,
          message,
          name,
          reason,
          cause,
        } = error
        console.log({
          androidErrorCode,
          attErrorCode,
          errorCode,
          iosErrorCode,
          message,
          name,
          reason,
          cause,
        })
        switch (error?.errorCode) {
          case BleErrorCode.DeviceDisconnected:
          case BleErrorCode.OperationCancelled:
            return
          default:
            Speech.speak("Ocorreu um erro ao receber as notificações")
            return
        }
      }

      const value = c?.value ? Buffer.from(c.value, "base64").toString("ascii") : undefined
      console.log("Chamado: ", value)

      if (value === "bt_wea") {
        if (available) {
          speakWeather()
        } else {
          Speech.speak("Não há dados disponíveis no momento, tente novamente mais tarde.", {
            language: "pt-BR",
          })
        }
      } else if (value === "bt_lum") {
        Speech.speak("Luminosidade", {
          language: "pt-BR",
        })
      }
    },
    [connectedDevice]
  )

  const scanForDevices = useCallback(async () => {
    setDevices([]);

    const state = await manager.state()

    if (state !== State.PoweredOn) {
      Speech.speak("Cheque se o Bluetooth está ligado.")
      setError(new Error("Bluetooth não está ligado."))
      setIsScanning(false)
      return
    }

    setIsScanning(true);

    const servicesWanted: UUID[] = CHARACTERISTICS_UUID.DEFAULT_SERVICES

    manager.startDeviceScan(servicesWanted, null, (error, device) => {
      if (error) {
        Speech.speak("Cheque se o Bluetooth está ligado e se todas as permissões estão ativadas para o aplicativo.")
        setIsScanning(false);
        setError(error)
        return;
      }

      if (device) {
        setDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000); // Stop scan after 10 seconds
  }, [manager]);

  const connectToDevice = useCallback(
    async (deviceId: string, enableNotifications: boolean) => {
      try {
        setIsConnecting(true)
        await manager.stopDeviceScan()
        const device = await manager.connectToDevice(deviceId);
        const connected = await device.discoverAllServicesAndCharacteristics();
        setConnectedDevice(connected);

        const services = await connected.services();
        const allCharacteristics: Characteristic[] = [];

        for (const service of services) {
          const chars = await connected.characteristicsForService(service.uuid);
          allCharacteristics.push(...chars);
        }

        setIsConnecting(false)
        setCharacteristics(allCharacteristics)
      } catch (error) {
        console.error('Connection error:', error);
        setError(error as Error)
        setConnectedDevice(null);
        setIsConnecting(false)
      }
    },
    [manager]
  );

  const disconnectFromDevice = useCallback(async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setIsNotifying(false)
      setCharacteristics([])
      setDevices([])
      setIsScanning(false)
    }
  }, [manager, connectedDevice]);

  const readCharacteristic = useCallback(
    async (characteristicUuid: string) => {
      if (!connectedDevice) return null;

      try {
        const characteristic = await connectedDevice.readCharacteristicForService(
          characteristicUuid,
          characteristicUuid
        );
        return characteristic.value;
      } catch (error) {
        console.error('Read error:', error);
        setError(error as Error)
        return null;
      }
    },
    [connectedDevice]
  );

  const writeCharacteristic = useCallback(
    async (characteristicUuid: string, value: string) => {
      if (!connectedDevice) return;

      try {
        await connectedDevice.writeCharacteristicWithResponseForService(
          characteristicUuid,
          characteristicUuid,
          value
        );
      } catch (error) {
        console.error('Write error:', error);
        setError(error as Error)
      }
    },
    [connectedDevice]
  );

  const enableNotifications = useCallback(() => {
    if (!connectedDevice) return;
    const characteristic = characteristics.find((c) => c.uuid === CHARACTERISTICS_UUID.DEFAULT_NOTIFICATION_CHARACTERISTIC);
    if (characteristic) {
      const sub = characteristic.monitor(speak);
      console.log({ sub })
      setNotificationSub(sub)
      setIsNotifying(true);
    }
  }, [connectedDevice, characteristics]);

  const unableNotifications = useCallback(() => {
    notificationSub?.remove()
    setNotificationSub(null)
    setIsNotifying(false);
  }, [notificationSub]);

  return (
    <BleContext.Provider value={{
      devices,
      connectedDevice,
      isScanning,
      scanForDevices,
      connectToDevice,
      disconnectFromDevice,
      readCharacteristic,
      writeCharacteristic,
      enableNotifications,
      unableNotifications,
      isNotifying,
      isConnecting,
      error,
    }}>
      {children}
    </BleContext.Provider>
  )
}

export const useBle = () => {
  const context = useContext(BleContext)
  if (!context) {
    throw new Error("useWeather deve ser usado dentro de um BleContextProvider")
  }
  return context
}
