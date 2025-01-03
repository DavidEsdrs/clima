import React, { useCallback, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useBle } from '@/hooks/useBle';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech"
import { BleError, Characteristic } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { CHARACTERISTICS_UUID } from "@/constants/Characteristics";

const BleScreen = () => {
  const {
    devices,
    connectedDevice,
    isScanning,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    characteristics,
    error
  } = useBle();

  const speak = useCallback(
    (error: BleError | null, c: Characteristic | null) => {
      console.log({ messagem: "chamado", from: "connection.tsx - 96" })
      if(!connectedDevice) {
        Speech.speak("Nenhum dispositivo conectado")
        return
      }
      if(error) {
        Speech.speak("Ocorreu um erro ao receber as notificações")
        console.log({
          name: error.name,
          cause: error.cause,
          reason: error.reason,
          message: error.message,
          code: error.errorCode,
        })
        return
      }

      let speech: string

      const value = c?.value ? Buffer.from(c.value, "base64").toString("ascii") : "DESCONHECIDO"

      if(value === "bt_wea") {
        speech = "Tempo"
      } else if(value === "bt_lum") {
        speech = "Luminosidade"
      } else {
        speech = "Valor não reconhecido"
      }

      Speech.speak(speech, {
        language: "pt-BR",
      })
    },
    [connectedDevice, characteristics]
  )

  const connect = useCallback(() => {
    for (let index = 0; index < characteristics.length; index++) {
      if(characteristics[index].uuid === CHARACTERISTICS_UUID.DEFAULT_NOTIFICATION_CHARACTERISTIC) {
        characteristics[index].monitor(speak)
        break
      }
    }
  }, [characteristics])

  return (
    <SafeAreaView>
      <View>
        <Button
          title={isScanning ? 'Scanning...' : 'Scan for Devices'}
          onPress={scanForDevices}
          disabled={isScanning}
        />

        <FlatList
          data={devices}
          keyExtractor={(item) => item.localName + item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => connectToDevice(item.id)}>
              <Text className="text-white">{item.name || 'Unnamed Device'}</Text>
            </TouchableOpacity>
          )}
        />

        {connectedDevice && (
          <View>
            <Text>Connected to: {connectedDevice.name}</Text>
            <Button title="Disconnect" onPress={disconnectFromDevice} />
            <TouchableOpacity className="bg-blue-500 p-3 flex justiy-center items-center mt-2" onPress={connect}>
              <Text className="text-white font-bold">
                Ouvir notificações
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {error && (
          <Text className="text-white">
            {error.message}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default BleScreen;
