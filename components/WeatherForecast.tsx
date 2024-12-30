import { View, Text } from "react-native";
import { WeatherInformation } from "@/hooks/useWeather"
import { WEATHER_CONDITION } from "@/constants/WeatherCondition";

type WeatherForecastProps = {
  item: WeatherInformation
}

export function WeatherForecast({ item }: WeatherForecastProps) {
  const date = new Date(item.dt * 1000);
  const hour = date.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const weekDay = date.toLocaleString('pt-BR', { weekday: 'long' });
  const description = item.weather[0].description ?? ""

  return (
    <View 
      className="bg-gray-800 rounded-md mb-4"
      accessible
      accessibilityLabel={`A previsão para ${weekDay} às ${hour} é de ${Number(item.temp).toFixed(0)} graus Celsius, ${description}`}
    >
      <View className="flex flex-row justify-between py-2 px-4 bg-gray-600 w-full">
        <Text className="text-white font-normal flex-1">
          {weekDay}
        </Text>
        <Text className="text-white font-normal">
          {hour}
        </Text>
      </View>
      <View className="py-2 px-4 flex flex-row">
        <Text className="text-white font-bold flex-1">
          {Number(item.temp).toFixed(0)}°C
        </Text>
        <Text className="text-white">
          {description}
        </Text>
      </View>
    </View>
  )
}