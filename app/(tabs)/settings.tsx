import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ScreenTitle } from "@/components/ScreenTitle";
import { Checkbox } from 'react-native-paper';
import { useEffect, useState } from "react";
import { useConfigurations } from "@/hooks/useConfiguration";
import { Divider } from "@/components/Divider";
import Feather from '@expo/vector-icons/Feather';

type OptionsState = {
  temperature: boolean
  humidity: boolean
  location: boolean
  luminosity: boolean
}

export default function Settings() {
  const { configurations, updateConfiguration, saveConfigurations } = useConfigurations();
  const [updated, setUpdated] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <View className="py-4 px-2">
        <ScreenTitle name="Configurações" />
      </View>
      <ScrollView className="flex-1 px-2">
        <View className="py-2">
          <Text className="text-white text-2xl mb-2">
            Tempo
          </Text>
          <View>
            <View className="flex flex-row items-center">
              <Checkbox
                status={configurations.temperature ? 'checked' : 'unchecked'}
                onPress={() => {
                  setUpdated(true)
                  updateConfiguration("temperature", !configurations.temperature)
                }}
                color="purple" // Cor do checkbox quando marcado
              />
              <Text className="text-white">
                Falar temperatura
              </Text>
            </View>
            <View className="flex flex-row items-center">
              <Checkbox
                status={configurations.humidity ? 'checked' : 'unchecked'}
                onPress={() => {
                  setUpdated(true)
                  updateConfiguration("humidity", !configurations.humidity)
                }}
                color="purple" // Cor do checkbox quando marcado
              />
              <Text className="text-white">
                Falar umidade
              </Text>
            </View>
            <View className="flex flex-row items-center">
              <Checkbox
                status={configurations.location ? 'checked' : 'unchecked'}
                onPress={() => {
                  setUpdated(true)
                  updateConfiguration("location", !configurations.location)
                }}
                color="purple" // Cor do checkbox quando marcado
              />
              <Text className="text-white">
                Falar localização
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        <View className="py-2">
          <Text  className="text-white text-2xl mb-2">
            Luminosidade
          </Text>
          <View>
            <View className="flex flex-row items-center">
              <Checkbox
                status={configurations.luminosity ? 'checked' : 'unchecked'}
                onPress={() => {
                  setUpdated(true)
                  updateConfiguration("luminosity", !configurations.luminosity)
                }}
                color="purple" // Cor do checkbox quando marcado
              />
              <Text className="text-white">
                Falar unidade de luminosidade
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        <View className="py-2">
          <Text  className="text-white text-2xl mb-2">
            Geral
          </Text>
          <View>
            <View>
              <Text className="text-white">
                Versão do Aplicativo: v1.0.0
              </Text>
            </View>
            <View>
              <Text className="text-white">
                Conectado com dispositivo: Não
              </Text>
            </View>
            <View>
              <Text className="text-white">
                Tempo conectado com o dispositivo: 7 horas
              </Text>
            </View>
            <View>
              <Text className="text-white">
                Localização do usuário: Jaboatão dos Guararapes
              </Text>
            </View>
          </View>
        </View>


        {updated && (
          <Pressable 
            className="bg-purple-400 rounded-md w-full p-5 flex items-center justify-center mt-auto mb-4"
            onPress={() => {
              saveConfigurations()
              setUpdated(false)
            }}
          >
            <Text className="text-white font-bold">
              Salvar preferências
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}