// import { ScreenTitle } from "@/components/ScreenTitle";
// import { View, Text, Pressable } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Feather from '@expo/vector-icons/Feather';
// import { useConnection } from "@/hooks/useConnection";
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { InfoBox } from "@/components/InfoBox";
// import { AccessibilityFocusWrapper } from "@/components/AccessibilityFocusWrapper";
// import { useBle } from "@/hooks/useBle";

// export default function Connection() {
//   const { isConnected, tryConnect, closeConnection } = useConnection()
//   const {  } = useBle();

//   return (
//     <SafeAreaView className="flex-1">
//       <View className="flex flex-1 py-4 px-2">
//         <AccessibilityFocusWrapper shouldFocus accessibilityLabel="Conexão com SynesthesiaVision">
//           <ScreenTitle name="Conexão com SynesthesiaVision" />
//         </AccessibilityFocusWrapper>

//         <View className="flex-1 flex items-center justify-center">

//           {isConnected ? (
//             <View 
//               className="flex items-center justify-center p-4 rounded-lg bg-gray-800"
//             >
//               <Feather name="bluetooth" size={68} color="white" accessible={false} />
//               <Text className="text-white text-2xl mb-4">
//                 Conectado
//               </Text>

//               <Pressable className="p-4 bg-red-600 rounded-lg" onPress={() => closeConnection()}>
//                 <Text className="text-white text-xl font-bold">
//                   Desconectar
//                 </Text>
//               </Pressable>
//             </View>
//           ) : (
//             <View className="flex items-center justify-center p-4 rounded-lg bg-gray-800">
//               <MaterialIcons name="bluetooth-disabled" size={68} color="white" accessible={false} />
//               <Text className="text-white text-2xl mb-4">
//                 Desconectado
//               </Text>

//               <Pressable className="p-4 bg-green-600 rounded-lg" onPress={() => tryConnect()}>
//                 <Text className="text-white text-xl font-bold">
//                   Tentar conectar
//                 </Text>
//               </Pressable>
//             </View>
//           )}
//         </View>

//         <View>
//           <Text className="text-white">
//             {JSON.stringify(devices, "", " ")}
//           </Text>
//         </View>

//         <InfoBox
//           info="Por aqui, você será capaz de se conectar com o dispositivo SynesthesiaVision
//           para poder acessar os recursos do aplicativo de maneira mais rápida através
//           do botão de ação localizado no óculos."
//         />
//       </View>
//     </SafeAreaView>
//   )
// }

import React, { useCallback, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useBle } from '@/hooks/useBle';
import { SafeAreaView } from "react-native-safe-area-context";
import Speech from "expo-speech"
import { BleError, Characteristic } from "react-native-ble-plx";

const BleScreen = () => {
  const {
    devices,
    connectedDevice,
    isScanning,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    characteristics,
    readCharacteristic,
    writeCharacteristic,
    listenNotification,
    error
  } = useBle();

  const speak = useCallback(
    (error: BleError | null, c: Characteristic | null) => {
      if(!connectToDevice) {
        Speech.speak("Nenhum dispositivo conectado")
        return
      }
      if(error) {
        Speech.speak("Ocorreu um erro ao receber as notificações")
        return
      }

      let speech: string

      if(c?.value === "bt_wea") {
        speech = "Tempo"
      } else if(c?.value === "bt_lum") {
        speech = "Luminosidade"
      } else {
        speech = "Valor não reconhecido"
      }

      Speech.speak(speech, {
        language: "pt-BR",
      })
    },
    [connectToDevice, characteristics]
  )

  useEffect(() => {
    listenNotification(characteristics[0], speak)
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
          keyExtractor={(item) => item.id}
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
            <FlatList
              data={characteristics}
              keyExtractor={(item) => item.uuid}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={() => readCharacteristic(item.uuid)}>
                    <Text className="text-white">{item.uuid}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
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
