import { LightSensor } from "expo-sensors";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Speech from "expo-speech";

enum LuxLevel {
  Dark,
  LowLight,
  InternalLight,
  OutsideLight,
  FullLight
}

export default function Luminosity() {
  const [illuminance, setIlluminance] = useState<number | null>(null);

  const luminanceLevel = (luxLevel: number): LuxLevel => {
    if(luxLevel < 5) {
      return LuxLevel.Dark
    }
    if(luxLevel < 10) {
      return LuxLevel.LowLight
    }
    if(luxLevel < 50) {
      return LuxLevel.InternalLight
    }
    if(luxLevel < 150) {
      return LuxLevel.OutsideLight
    }
    return LuxLevel.FullLight
  }

  const speakLuminance = (illuminance: number) => {
    const level = luminanceLevel(illuminance)
    switch(level) {
      case LuxLevel.Dark:
        Speech.speak("Está completamente escuro")
        break
      case LuxLevel.LowLight:
        Speech.speak("Está um pouco iluminado")
        break
      case LuxLevel.InternalLight:
        Speech.speak("Está iluminado")
        break
      case LuxLevel.OutsideLight:
        Speech.speak("Está bastante iluminado")
        break
      case LuxLevel.FullLight:
        Speech.speak("Está com muita iluminação. Talvez o sensor do celular esteja apontando para alguma fonte de luz.")
        break
    }
  }

  useEffect(() => {
    const subscription = LightSensor.addListener((data) => {
      setIlluminance(data.illuminance)
    })

    LightSensor.isAvailableAsync().then((available) => {
      if(!available) {
        setIlluminance(null);
        console.log("Sensor de luz não está disponível ou não está ativado no dispositivo!");
      }
    });

    return () => {
      if(subscription) {
        subscription.remove();
      }
    }
  }, [])

  return (
    <View className="flex flex-1 items-center justify-center">
      <Text className="text-white">
        {illuminance !== null
            ? `Nível de luminosidade: ${illuminance.toFixed(2)} lux`
            : 'Lendo dados do sensor de luz...'}
      </Text>
      <Pressable 
        className="bg-purple-400 mx-4 rounded-md w-full p-5 flex items-center justify-center" 
        onPress={() => speakLuminance(illuminance ?? 0)}
      >
        <Text className="text-white font-bold">
          FALAR
        </Text>
      </Pressable>
    </View>
  )
}