import { ScreenTitle } from "@/components/ScreenTitle";
import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import { useConnection } from "@/hooks/useConnection";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { InfoBox } from "@/components/InfoBox";

export default function Connection() {
  const { isConnected, tryConnect, closeConnection } = useConnection()

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 py-4 px-2">
        <ScreenTitle name="Conexão com SynesthesiaVision" />

        <View className="flex-1 flex items-center justify-center">

          {isConnected ? (
            <View className="flex items-center justify-center p-4 rounded-lg bg-gray-800">
              <Feather name="bluetooth" size={68} color="white" />
              <Text className="text-white text-2xl mb-4">
                Conectado
              </Text>

              <Pressable className="p-4 bg-red-600 rounded-lg" onPress={() => closeConnection()}>
                <Text className="text-white text-xl font-bold">
                  Desconectar
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex items-center justify-center p-4 rounded-lg bg-gray-800">
              <MaterialIcons name="bluetooth-disabled" size={68} color="white" />
              <Text className="text-white text-2xl mb-4">
                Desconectado
              </Text>

              <Pressable className="p-4 bg-green-600 rounded-lg" onPress={() => tryConnect()}>
                <Text className="text-white text-xl font-bold">
                  Tentar conectar
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <InfoBox
          info="Por aqui, você será capaz de se conectar com o dispositivo SynesthesiaVision
          para poder acessar os recursos do aplicativo de maneira mais rápida através
          do botão de ação localizado no óculos.  "
        />
      </View>
    </SafeAreaView>
  )
}