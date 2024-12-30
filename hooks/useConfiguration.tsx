import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipagem para as configurações
type Configurations = {
  temperature: boolean
  humidity: boolean
  location: boolean
  luminosity: boolean
  weather: boolean
  deviceVibration: boolean
  deviceSound: boolean
}

// Tipagem para o contexto
type ConfigContextType = {
  configurations: Configurations;
  updateConfiguration: (key: keyof Configurations, value: any) => void;
  saveConfigurations: () => Promise<void>;
};

// Valores padrão
const defaultConfigurations: Configurations = {
  temperature: true,
  humidity: false,
  location: true,
  luminosity: true,
  weather: true,
  deviceVibration: true,
  deviceSound: true,
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: React.PropsWithChildren) {
  const [configurations, setConfigurations] = useState<Configurations>(defaultConfigurations);

  useEffect(() => {
    (async () => {
      const savedConfigurations = await AsyncStorage.getItem('configurations');
      if (savedConfigurations) {
        setConfigurations(JSON.parse(savedConfigurations));
      }
    })();
  }, []);

  const updateConfiguration = async (key: keyof Configurations, value: any) => {
    const updatedConfigurations = { ...configurations, [key]: value };
    setConfigurations(updatedConfigurations);
  };

  const saveConfigurations = async () => {
    await AsyncStorage.setItem('configurations', JSON.stringify(configurations));
  }

  return (
    <ConfigContext.Provider value={{ configurations, updateConfiguration, saveConfigurations }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigurations = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigurations deve ser usado dentro de um ConfigProvider');
  }
  return context;
};