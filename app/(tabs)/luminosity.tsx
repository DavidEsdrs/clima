import { LightSensor } from "expo-sensors";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { SafeAreaView } from "react-native-safe-area-context";
import { Help } from "@/constants/Help";
import { ScreenTitle } from "@/components/ScreenTitle";
import { InfoBox } from "@/components/InfoBox";
import { AccessibilityFocusWrapper } from "@/components/AccessibilityFocusWrapper";
import { useWeather } from "@/hooks/useWeather";
import Feather from "@expo/vector-icons/Feather";

enum LuxLevel {
  Dark = "Está completamente escuro",
  LowLight = "Está um pouco iluminado",
  InternalLight = "Está iluminado",
  OutsideLight = "Está bastante iluminado",
  FullLight = "Está com iluminação equivalente a um dia ensolarado."
}

export default function Luminosity() {
  const [illuminance, setIlluminance] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { data, available } = useWeather();

  const getLuxLevel = (lux: number): LuxLevel => {
    if (lux < 5) return LuxLevel.Dark;
    if (lux < 10) return LuxLevel.LowLight;
    if (lux < 50) return LuxLevel.InternalLight;
    if (lux < 150) return LuxLevel.OutsideLight;
    return LuxLevel.FullLight;
  };

  const isDaytime = () => {
    if (!available) {
      const now = new Date();
      const hours = now.getHours();
      return hours >= 6 && hours < 18;
    }
    return data.current?.dt! >= data.current?.sunrise! && data.current?.dt! < data.current?.sunset!
  }

  const speakLuminance = (lux: number | null) => {
    const message = lux !== null ? getLuxLevel(lux) : "Sensor de luz não está disponível.";
    Speech.speak(message, {
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    let subscription: any;

    LightSensor.isAvailableAsync().then((available) => {
      if (available) {
        subscription = LightSensor.addListener((data) => setIlluminance(data.illuminance));
      } else {
        console.log("Sensor de luz não está disponível ou não está ativado no dispositivo!");
      }
    });

    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 py-4 px-2">
        <AccessibilityFocusWrapper shouldFocus accessibilityLabel="Luminosidade">
          <ScreenTitle name="Luminosidade" />
        </AccessibilityFocusWrapper>

        <View>
          <View
            className="flex flex-row gap-2 items-center"
            accessible
            accessibilityLabel={isDaytime() ? "É dia" : "É noite"}
          >
            {isDaytime() ? (
              <Feather name="sun" size={24} color="white" />
            ) : (
              <Feather name="moon" size={24} color="white" />
            )}
            <Text className="text-white">
              {isDaytime() ? "É dia" : "É noite"}
            </Text>
          </View>
          <Text 
            className="text-white mb-2"
            accessible
            accessibilityLiveRegion="none"
          >
            {illuminance !== null
              ? `Nível de luminosidade: ${illuminance.toFixed(2)} lux`
              : "Lendo dados do sensor de luz..."}
          </Text>
          {isSpeaking ? (
            <Pressable 
              className="bg-gray-400 rounded-md w-full p-5 flex items-center justify-center" 
              accessibilityRole="button"
              accessibilityState={{
                disabled: true
              }}
            >
              <Text className="text-white font-bold">
                Falando...
              </Text>
            </Pressable>
          ) : (
            <Pressable 
              className="bg-purple-400 rounded-md w-full p-5 flex items-center justify-center" 
              onPress={() => speakLuminance(illuminance)}
              accessibilityRole="button"
            >
              <Text className="text-white font-bold">
                Falar luminosidade
              </Text>
            </Pressable>
          )}
        </View>

        <InfoBox
          className="mt-auto"
          info={Help.luminosity.pt_BR}
        />
      </View>
    </SafeAreaView>
  );
}