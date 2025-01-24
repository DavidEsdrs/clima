import { useWeather } from "./useWeather"

export function useSpeech() {
  const { available, data, speakWeather } = useWeather()

  const sp = (value: string) => {
    switch(value) {
      case "bt_wea":
        if(available) {
          speakWeather()
        }
        break
      case "bt_lum":
        break
      case "bt_can":
        break
    }
  }
}
