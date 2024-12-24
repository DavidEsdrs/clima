import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image, StyleSheet, Platform, View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import * as  Speech from "expo-speech"
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenTitle } from "@/components/ScreenTitle";
import { useConfigurations } from "@/hooks/useConfiguration";
import { InfoBox } from "@/components/InfoBox";

const API_KEY = "16f377b5b244f8b273600b72bccaaba4"
const WEATHER_API = (lat: number, lon: number) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&exclude=minutely,hourly,daily`

export default function Weather() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geocode, setGeocode] = useState<string>();
  const { configurations } = useConfigurations();

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const geoCodeLocations = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      const local = geoCodeLocations[0]

      setGeocode(local.city ?? local.subregion ?? "seu local")

      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  const speakWeather = (temperature?: number) => {
    let sp = ""
    if(configurations.temperature) {
      sp += `No momento, a temperatura é de ${Number(data.current.temp).toFixed(0)} graus Celsius`
    }
    if(configurations.humidity) {
      sp += `A umidade é de ${data.current.humidity}%`
    }
    if(configurations.location) {
      sp += `em ${geocode}`
    }
    const speech = temperature ? sp : "No momento, não fomos capazes de detectar a temperatura."
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

  const { isPending, error, data, isFetching } = useQuery({ 
    queryKey: ['weather'], 
    queryFn: async () => {
      if(location) {
        const response = await fetch(WEATHER_API(location?.coords.latitude!, location?.coords.longitude!))
        return await response.json()
      }
      return {}
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: false
  })

  if (isPending) return <Text> Loading... </Text>

  if (error) return <Text> {'An error has occurred: ' + error.message} </Text>

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 py-4 px-2">
        <ScreenTitle name="Tempo" />
        <View className="flex flex-row gap-4">
          <Entypo name="location-pin" size={24} color="purple" />
          <Text className="text-white">
            Local: {geocode}
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
        <View className="flex flex-row gap-4 mb-4">
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

        {isSpeaking ? (
          <Pressable 
            className="bg-gray-400 rounded-md w-full p-5 flex items-center justify-center" 
            onPress={() => console.log("Falando...")}
          >
            <Text className="text-white font-bold">
              Falando...
            </Text>
          </Pressable>
        ) : (
          <Pressable 
            className="bg-purple-400 rounded-md w-full p-5 flex items-center justify-center" 
            onPress={() => speakWeather(data?.current?.temp)}
          >
            <Text className="text-white font-bold">
              Falar o tempo
            </Text>
          </Pressable>
        )}

        <InfoBox
          className="mt-auto"
          info="O recurso de clima do aplicativo se baseia na localização atual do seu smartphone.
            Você pode configurar o que o botão irá falar na aba de configurações."
        />
      </View>
    </SafeAreaView>
  );
}
