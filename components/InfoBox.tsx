import { View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

type InfoBoxProps = {
  info: string
  className?: string
}

export function InfoBox({ info, className }: InfoBoxProps) {
  return (
    <View 
      className={`bg-gray-800 p-4 rounded-lg ${className ?? ""}`} 
      accessible
      accessibilityLabel={"Dica: " + info}
    >
      <Ionicons name="information-circle-outline" size={24} color="white" />
      <Text className="text-white text-justify">
        {info}
      </Text>
    </View>
  )
}