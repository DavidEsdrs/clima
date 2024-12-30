import { useConfigurations } from "@/hooks/useConfiguration";
import { View, Text, Pressable } from "react-native";
import { Checkbox } from "react-native-paper";
import { InfoBox } from "./InfoBox";
import { useState } from "react";

export function DeviceConfiguration() {
  const [updated, setUpdated] = useState(false)
  const { configurations, updateConfiguration, saveConfigurations } = useConfigurations()

  return (
    <View className="flex-1 py-4">
      <Text className="text-white text-3xl mb-2">
        Configurações de dispositivo
      </Text>

      <View 
        className="flex flex-row items-center" 
        accessibilityLabel="Vibração ao Aproximar"
        accessibilityRole="checkbox"
        accessible
      >
        <Checkbox
          status={configurations.deviceVibration ? 'checked' : 'unchecked'}
          onPress={() => {
            setUpdated(true)
            updateConfiguration("deviceVibration", !configurations.deviceVibration)
          }}
          color="purple" // Cor do checkbox quando marcado
        />
        <Text className="text-white">
          Vibração ao aproximar
        </Text>
      </View>

      <View 
        className="flex flex-row items-center"
        accessibilityLabel="Vibração ao Aproximar"
        accessibilityRole="checkbox"
        accessible
      >
        <Checkbox
          status={configurations.deviceSound ? 'checked' : 'unchecked'}
          onPress={() => {
            setUpdated(true)
            updateConfiguration("deviceSound", !configurations.deviceSound)
          }}
          color="purple" // Cor do checkbox quando marcado
        />
        <Text className="text-white">
          Som ao aproximar
        </Text>
      </View>
      
      {updated && (
        <Pressable 
          className="bg-purple-400 rounded-md w-full p-5 flex items-center justify-center mt-8" 
          onPress={() => {
            setUpdated(false)
            saveConfigurations()
          }}
        >
          <Text className="text-white font-bold">
            Salvar alterações
          </Text>
        </Pressable>
      )}

      <InfoBox
        className="mt-auto"
        info="Aqui estão disponíveis algumas das configurações que você pode fazer
          no seu dispositivo SynesthesiaVision. As alterações feitas aqui precisam ser sincronizadas
          quando a conexão estiver ativa."
      />
    </View>
  )
}