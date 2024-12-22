import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image, StyleSheet, Platform, View, Text, Pressable } from 'react-native';
import * as  Speech from "expo-speech"
import * as Location from 'expo-location';
import { useEffect, useState } from "react";

const API_KEY = "16f377b5b244f8b273600b72bccaaba4"
const WEATHER_API = (lat: number, lon: number) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&exclude=minutely,hourly,daily`

export default function HomeScreen() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  const speakWeather = (temperature?: number) => {
    const speech = temperature ? `No momento está fazendo ${temperature} graus Celsius em Recife` : "No momento, não fomos capazes de detectar a temperatura."
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
    <View className="flex flex-1 items-center justify-center">
      {data.current ? (
        <Text className="text-white">
          Temp: {data.current.temp}°C
        </Text>
      ) : (
        <Text className="text-white">
          Sem informação de temperatura
        </Text>
      )}
      {isSpeaking ? (
        <Pressable 
          className="bg-gray-400 mx-4 rounded-md w-full p-5 flex items-center justify-center" 
          onPress={() => console.log("Falando...")}
        >
          <Text className="text-white font-bold">
            Falando...
          </Text>
        </Pressable>
      ) : (
        <Pressable 
          className="bg-purple-400 mx-4 rounded-md w-full p-5 flex items-center justify-center" 
          onPress={() => speakWeather(data?.current?.temp)}
        >
          <Text className="text-white font-bold">
            FALAR
          </Text>
        </Pressable>
      )}
    </View>
  );
}
