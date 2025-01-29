import { useLocation } from "@/components/useLocation"
import { useQuery } from "@tanstack/react-query"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import * as Speech from "expo-speech"
import { useConfigurations } from "./useConfiguration"
import { AppState } from "react-native"

interface WeatherDescription {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherInformation {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: WeatherDescription[]
}

interface WeatherAPIResponse {
  lat?: number
  lon?: number
  timezone?: string
  timezone_offset?: string
  current?: WeatherInformation
  hourly?: WeatherInformation[]
}

type WeatherDataAvailable = {
  data: WeatherAPIResponse
  available: true,
  speakWeather: () => void
}

type WeatherDataUnavailable = {
  data?: WeatherAPIResponse
  available: false,
  speakWeather: () => void
}

type WeatherContextProps = WeatherDataAvailable | WeatherDataUnavailable

const WeatherContext = createContext<WeatherContextProps>({ available: false, speakWeather: () => {} })

const API_KEY = "16f377b5b244f8b273600b72bccaaba4"
const WEATHER_API = (lat: number, lon: number) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&exclude=minutely,daily&lang=pt_br`

export function WeatherContextProvider({ children }: React.PropsWithChildren) {
  const { location } = useLocation()
  const [isDataAvailable, setIsDataAvailable] = useState(false)
  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      const response = await fetch(WEATHER_API(location!.coordinates.latitude, location!.coordinates.longitude))
      const json = await response.json()
      return json as WeatherAPIResponse
    },
    refetchInterval: 6e5,
    refetchIntervalInBackground: true
  })
  const { configurations } = useConfigurations()

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refetch();
      }
    });

    return () => subscription.remove();
  }, [refetch]);

  useEffect(() => {
    setIsDataAvailable(!!data);
  }, [data]);

  const speakWeather = useCallback(() => {
    let weatherSpeech = ""
    if (!location) {
      return
    }
    if (configurations.temperature) {
      weatherSpeech += `No momento, a temperatura é de ${Number(data!.current?.temp).toFixed(0)} graus Celsius`
    }
    if (configurations.humidity) {
      weatherSpeech += `A umidade é de ${data!.current?.humidity}%`
    }
    if (configurations.location) {
      weatherSpeech += `em ${location?.city}`
    }
    if (configurations.weather) {
      weatherSpeech += `. O clima é ${data!.current?.weather[0].description}`
    }
    const speech = weatherSpeech.length > 0 ? weatherSpeech : "No momento, não fomos capazes de detectar a temperatura."
    Speech.speak(speech, {
      language: "pt-BR",
    })
  }, [data])

  return (
    <WeatherContext.Provider value={{ data: data!, available: isDataAvailable, speakWeather }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error("useWeather deve ser usado dentro de um WeatherContextProvider")
  }
  return context
}