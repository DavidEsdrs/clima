import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenTitle } from "@/components/ScreenTitle";
import img from "@/assets/images/logo.png"
import { Link } from "expo-router";
import { useConnection } from "@/hooks/useConnection";
import { Divider } from "@/components/Divider";
import { Checkbox, Surface, TextInput } from "react-native-paper";
import { useState } from "react";
import { useConfigurations } from "@/hooks/useConfiguration";
import Ionicons from '@expo/vector-icons/Ionicons';
import { InfoBox } from "@/components/InfoBox";
import { DeviceConfiguration } from "@/components/DeviceConfiguration";

export default function HomeScreen() {
  const { isConnected } = useConnection()

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 py-4 px-2">
        <View className="mb-4">
          <Image
            source={img}
            className="h-8 w-8"
            resizeMode="contain"
          />
        </View>

        <View className="py-4">
          <Text className="text-white text-3xl mb-2">
            Acesso Rápido
          </Text>
          <ScrollView>
            <Link className="mb-4" href={"/(tabs)/weather"} asChild>
              <Pressable className="bg-purple-400 py-2 px-4 rounded-md">
                <Text className="text-black font-bold text-xl">
                  Tempo
                </Text>
              </Pressable>
            </Link>
            <Link className="mb-4" href={"/(tabs)/luminosity"} asChild>
              <Pressable className="bg-purple-400 py-2 px-4 rounded-md">
                <Text className="text-black font-bold text-xl">
                  Luminosidade
                </Text>
              </Pressable>
            </Link>
            <Link className="mb-4" href={"/(tabs)/connection"} asChild>
              <Pressable className="bg-purple-400 py-2 px-4 rounded-md">
                <Text className="text-black font-bold text-xl">
                  Conexão: {isConnected ? "Ativa" : "Inativa"}
                </Text>
              </Pressable>
            </Link>
          </ScrollView>
        </View>

        <Divider />

        <DeviceConfiguration />
      </View>
    </SafeAreaView>
  );
}
