import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenTitleProps = {
  name: string
}

export function ScreenTitle({ name }: ScreenTitleProps) {
  return <Text className="text-white text-2xl mb-4">{name}</Text>
}