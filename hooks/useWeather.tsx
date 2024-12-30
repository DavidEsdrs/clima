import { useLocation } from "@/components/useLocation"
import { WEATHER_CONDITION } from "@/constants/WeatherCondition"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useState } from "react"

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
  available: true
}

type WeatherDataUnavailable = {
  data?: WeatherAPIResponse
  available: false
}

type WeatherContextProps = WeatherDataAvailable | WeatherDataUnavailable

const WeatherContext = createContext<WeatherContextProps>({ available: false })

const API_KEY = "16f377b5b244f8b273600b72bccaaba4"
const WEATHER_API = (lat: number, lon: number) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&exclude=minutely,daily&lang=pt_br`

export function WeatherContextProvider({ children }: React.PropsWithChildren) {
  const { location, available } = useLocation()
  const { isPending, error, data, isFetching } = useQuery({ 
    queryKey: ['weather'],
    queryFn: async () => {
      if(available) {
        const response = await fetch(WEATHER_API(location.coordinates.latitude, location.coordinates.longitude))
        const json = await response.json()
        return json as WeatherAPIResponse
      }
      return {} as WeatherAPIResponse
    },
    refetchInterval: 6e5,
    refetchIntervalInBackground: false
  })

  return (
    <WeatherContext.Provider value={!isFetching && !error && data !== null ? { data: data!, available: true } : { data: undefined, available: false }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if(!context) {
    throw new Error("useWeather deve ser usado dentro de um WeatherContextProvider")
  }
  return context
}