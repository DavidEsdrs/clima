import { useQuery } from "@tanstack/react-query";
import { View, Text, Pressable, FlatList, AccessibilityInfo, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import * as  Speech from "expo-speech"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenTitle } from "@/components/ScreenTitle";
import { useConfigurations } from "@/hooks/useConfiguration";
import { InfoBox } from "@/components/InfoBox";
import { useLocation } from "@/components/useLocation";
import { useWeather } from "@/hooks/useWeather";
import { Divider } from "@/components/Divider";
import { WeatherForecast } from "@/components/WeatherForecast";
import { useFocusEffect, useRouter } from "expo-router";
import { AccessibilityFocusWrapper } from "@/components/AccessibilityFocusWrapper";
import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";

export default function Weather() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { configurations } = useConfigurations();
  const { location } = useLocation()
  const { data, available: weatherAvailable } = useWeather()
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
  let weatherSpeech = ""

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const speakWeather = () => {
    if(!weatherAvailable) {
      return
    }
    if(configurations.temperature) {
      weatherSpeech += `No momento, a temperatura é de ${Number(data.current?.temp).toFixed(0)} graus Celsius`
    }
    if(configurations.humidity) {
      weatherSpeech += `A umidade é de ${data.current?.humidity}%`
    }
    if(configurations.location) {
      weatherSpeech += `em ${location?.city}`
    }
    if(configurations.weather) {
      weatherSpeech += `. O clima é ${data.current?.weather[0].description}`
    }
    const speech = weatherSpeech.length > 0 ? weatherSpeech : "No momento, não fomos capazes de detectar a temperatura."
    Speech.speak(speech, {
      language: "pt-BR",
      onStart: () => {
        setIsSpeaking(true)
      },
      onDone: () => {
        setIsSpeaking(false)
      },
    })
  }

  if (!weatherAvailable) 
    return (
      <SafeAreaView className="flex-1" accessible aria-busy>
        <View className="flex flex-1 py-4 px-2 flex items-center justify-center">
          <Text className="text-white"> Carregando... </Text>
        </View>
      </SafeAreaView>
    )

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 py-4 px-2">
        <AccessibilityFocusWrapper shouldFocus accessibilityLabel="Tempo">
          <ScreenTitle name="Tempo" />
        </AccessibilityFocusWrapper>
        <View 
          className="py-2"
          accessible
          accessibilityLanguage="pt_BR"
        >
          <View className="flex flex-row gap-4">
            <Feather name="clock" size={24} color="white" />
            <Text className="text-white" accessibilityLiveRegion="none">
              Hora: {currentTime}
            </Text>
          </View>
          <View className="flex flex-row gap-4">
            <Entypo name="location-pin" size={24} color="purple" />
            <Text className="text-white">
              Local: {location?.city}
            </Text>
          </View>
          <View className="flex flex-row gap-4">
            <Feather name="sun" size={24} color="yellow" />
            {data.current ? (
              <Text className="text-white">
                Temperatura: {Number(data.current.temp).toFixed(0)}°C
              </Text>
            ) : (
              <Text className="text-white">
                Sem informação de temperatura
              </Text>
            )}
          </View>
          <View className="flex flex-row gap-4">
            <Entypo name="air" size={24} color="blue" />
            {data.current ? (
              <Text className="text-white">
                Umidade: {data.current?.humidity}%
              </Text>
            ) : (
              <Text className="text-white">
                Sem informação de umidade
              </Text>
            )}
          </View>
          <View className="flex flex-row gap-4 mb-4">
            <MaterialCommunityIcons name="weather-cloudy" size={24} color="white" />
            {data.current ? (
              <Text className="text-white">
                Tempo: {data.current.weather[0].description}
              </Text>
            ) : (
              <Text className="text-white">
                Sem informação em relação ao tempo
              </Text>
            )}
          </View>
        </View>

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
            onPress={() => speakWeather()}
            accessibilityRole="button"
          >
            <Text className="text-white font-bold">
              Falar o tempo
            </Text>
          </Pressable>
        )}

        <Divider />

        <View className="py-2 flex-1">
          <Text className="text-white text-xl" accessibilityRole="header">
            Previsão do tempo
          </Text>
          <Text className="text-white text-lg mb-4" accessibilityRole="header">
            Próximas 12 horas
          </Text>

          <Pressable 
            className="text-xl p-4 rounded-lg flex flex-row w-full items-center bg-purple-400"
            onPress={() => setExpanded(!expanded)}
            accessibilityState={{ expanded }}
          >
            <Text className="text-white font-bold flex-1">
              Expandir previsão do tempo
            </Text>
            {expanded ? 
              <AntDesign name="arrowup" size={20} color="white" /> : 
              <AntDesign name="arrowdown" size={20} color="white" />
            }
          </Pressable>

          {expanded && (
            <FlatList
              className="mt-4 pb-20"
              renderItem={({ item }) => <WeatherForecast item={item} />}
              keyExtractor={(d) => d.dt.toString()}
              data={data.hourly?.slice(0, 12)}
              nestedScrollEnabled
            />
          )}

        </View>

        <InfoBox
          className="mt-auto"
          info="O recurso de clima do aplicativo se baseia na localização atual do seu smartphone.
            Você pode configurar o que o botão irá falar na aba de configurações."
        />
      </View>
    </SafeAreaView>
  );
}
