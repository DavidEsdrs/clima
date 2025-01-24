import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useBle } from '@/hooks/useBle';
import { SafeAreaView } from "react-native-safe-area-context";
import { InfoBox } from "@/components/InfoBox";
import { ScreenTitle } from "@/components/ScreenTitle";
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';

const BleScreen = () => {
  const {
    devices,
    connectedDevice,
    isScanning,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    enableNotifications,
    isNotifying,
    isConnecting,
    unableNotifications,
    error,
  } = useBle();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 py-4 px-2">
        <ScreenTitle name="Conexão com o SynesthesiaVision" />

        {!connectedDevice ? (
          <>
            <TouchableOpacity 
              className={`${isScanning ? "bg-gray-400" : "bg-purple-400"} rounded-md w-full p-5 flex items-center justify-center mb-4`}
              onPress={scanForDevices} 
              disabled={isScanning}
              accessibilityRole="button"
            >
              <Text className="text-white font-bold">
                {isScanning ? "Escaneando..." : "Procurar dispositivos próximos"}
              </Text>
            </TouchableOpacity>

            <FlatList
              data={devices}
              keyExtractor={(item) => item.localName + item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  className={`p-4 ${isConnecting ? "bg-gray-400": "bg-[#b231ad]"} rounded-lg mb-1 flex flex-row items-center gap-2`}
                  onPress={() => connectToDevice(item.id, true)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Se conectar ao dispositivo ${item.name || "sem nome"}`}
                  disabled={isConnecting}
                >
                  <Feather name="bluetooth" size={20} color="white" />
                  <Text className="text-white">{item.name || 'Dispositivo sem nome'}{isConnecting && " - Conectando..."}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <View className="px-2 py-4 bg-gray-800 rounded-lg">
            <View className="flex flex-row items-center gap-2 mb-2">
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Fontisto name="radio-btn-active" size={20} color="green" />
              </Animated.View>
              <Text className="text-white text-lg mb-2">
                Conectado a {connectedDevice.name}
              </Text>
            </View>
            {isNotifying ? (
              <TouchableOpacity 
                className="bg-red-400 rounded-md w-full p-5 flex items-center justify-center mb-4"
                onPress={unableNotifications} 
                accessibilityRole="button"
              >
                <Text className="text-white font-bold">
                  DESATIVAR NOTIFICAÇÕES
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="bg-blue-400 rounded-md w-full p-5 flex items-center justify-center mb-4"
                onPress={enableNotifications} 
                accessibilityRole="button"
              >
                <Text className="text-white font-bold">
                  ATIVAR NOTIFICAÇÕES
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              className="bg-red-400 rounded-md w-full p-5 flex items-center justify-center mb-4"
              onPress={disconnectFromDevice} 
              accessibilityRole="button"
            >
              <Text className="text-white font-bold">
                DESCONECTAR
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {error && (
          <Text className="text-white">
            {error.message}
          </Text>
        )}

        <InfoBox 
          className="mt-auto"
          info="Por aqui, você é capaz de se conectar com dispositivos SynesthesiaVision próximos. Se atente a dar todas as permissões necessárias para o aplicativo, como localização e bluetooth. Ligue o seu dispositivo SynesthesiaVision e clique em procurar dispositivos para começar."
        />
      </View>
    </SafeAreaView>
  );
};

export default BleScreen;
