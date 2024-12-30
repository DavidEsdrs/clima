// import { createContext, useContext, useEffect, useState } from "react";
// import { PermissionsAndroid, Platform } from "react-native";
// import { BleManager, Device } from "react-native-ble-plx";

// type BluetoothConnection = {
//   data?: any;
// }

// const BluetoothConnection = createContext<BluetoothConnection>({})

// export function BluetoothConnectionProvider({ children }: React.PropsWithChildren) {
//   const [data, setData] = useState()

//   return (
//     <BluetoothConnection.Provider value={{ data }}>
//       {children}
//     </BluetoothConnection.Provider>
//   )
// }

// const bleManager = new BleManager()

// export function useBle() {
//   const context = useContext(BluetoothConnection)
//   const [devices, setAllDevices] = useState<Device[]>([]);

//   useEffect(() => {
//     scanForPeripherals()
//   }, [])

//   const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
//     devices.findIndex((device) => nextDevice.id === device.id) > -1;

//   const scanForPeripherals = () =>
//     bleManager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.log(error);
//       }

//       if (
//         device &&
//         (device.localName === "Arduino" || device.name === "Arduino")
//       ) {
//         setAllDevices((prevState: Device[]) => {
//           if (!isDuplicteDevice(prevState, device)) {
//             return [...prevState, device];
//           }
//           return prevState;
//         });
//       }
//     });

//   const requestAndroid31Permissions = async () => {
//     const bluetoothScanPermission = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//       {
//         title: "Location Permission",
//         message: "Bluetooth Low Energy requires Location",
//         buttonPositive: "OK",
//       }
//     );
//     const bluetoothConnectPermission = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       {
//         title: "Location Permission",
//         message: "Bluetooth Low Energy requires Location",
//         buttonPositive: "OK",
//       }
//     );
//     const fineLocationPermission = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: "Location Permission",
//         message: "Bluetooth Low Energy requires Location",
//         buttonPositive: "OK",
//       }
//     );

//     return (
//       bluetoothScanPermission === "granted" &&
//       bluetoothConnectPermission === "granted" &&
//       fineLocationPermission === "granted"
//     );
//   };

//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       // if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
//       //   const granted = await PermissionsAndroid.request(
//       //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       //     {
//       //       title: "Location Permission",
//       //       message: "Bluetooth Low Energy requires Location",
//       //       buttonPositive: "OK",
//       //     }
//       //   );
//       //   return granted === PermissionsAndroid.RESULTS.GRANTED;
//       // }

//       const isAndroid31PermissionsGranted =
//         await requestAndroid31Permissions();

//       return isAndroid31PermissionsGranted;
//     } else {
//       return true;
//     }
//   };

//   if(!context) {
//     throw new Error("useBle deve ser usado dentro de um BluetoothConnectionProvider")
//   }

//   return {context, requestPermissions, devices}
// }
import { useState, useEffect, useCallback } from 'react';
import { BleManager, Device, Characteristic, UUID, NativeCharacteristic, BleError } from 'react-native-ble-plx';

export const useBle = () => {
  const [manager] = useState(() => new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    return () => {
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

  const listenNotification = useCallback(
    (characteristic: Characteristic, listener: (error: BleError | null, characteristic: Characteristic | null) => void) => {
      if (!connectedDevice) {
        throw new Error("No device connected");
      }

      characteristic.monitor(listener)
      
    },
    [connectedDevice, manager]
  );
  

  return {
    manager,
    devices,
    connectedDevice,
    characteristics,
    isScanning,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    readCharacteristic,
    writeCharacteristic,
    listenNotification,
    error
  };
};
