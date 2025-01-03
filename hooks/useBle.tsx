import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { BleManager, Device, Characteristic, UUID, NativeCharacteristic, BleError, LogLevel } from 'react-native-ble-plx';

type BleContextProps = {
  devices: Device[]
  connectedDevice?: Device | null
  characteristics: Characteristic[]
  error: Error | null
  isScanning: boolean
  scanForDevices: () => void
  connectToDevice: (deviceId: string) => Promise<void>
  disconnectFromDevice: () => Promise<void>
  readCharacteristic: (characteristicUuid: string) => Promise<string | null>
  writeCharacteristic: (characteristicUuid: string, value: string) => Promise<void>
}

const BleContext = createContext<BleContextProps | null>(null)

const manager = new BleManager()

export function BleContextProvider({ children }: React.PropsWithChildren) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    manager.setLogLevel(LogLevel.Verbose);
    manager.onStateChange(state => {
      console.log("BLE state changed: ", state)
    })

    return () => {
      console.log({ messagem: "destruído", from: "useBle.tsx - 31" })
      manager.destroy();
    };
  }, [manager]);

  const scanForDevices = useCallback(() => {
    setIsScanning(true);
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
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
    async (deviceId: string) => {
      try {
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

        setCharacteristics(allCharacteristics);
      } catch (error) {
        console.error('Connection error:', error);
        setError(error as Error)
        setConnectedDevice(null);
      }
    },
    [manager]
  );

  const disconnectFromDevice = useCallback(async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setCharacteristics([]);
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

  return (
    <BleContext.Provider value={{
      devices,
      connectedDevice,
      characteristics,
      isScanning,
      scanForDevices,
      connectToDevice,
      disconnectFromDevice,
      readCharacteristic,
      writeCharacteristic,
      error
    }}>
      {children}
    </BleContext.Provider>
  )
}

export const useBle = () => {
  const context = useContext(BleContext)
  if(!context) {
    throw new Error("useWeather deve ser usado dentro de um BleContextProvider")
  }
  return context
}
