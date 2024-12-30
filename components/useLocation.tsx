import { LocationGeocodedAddress } from "expo-location"
import * as Location from 'expo-location';
import { createContext, useContext, useEffect, useState } from "react"

type Location = {
  city?: string
  street?: string
  state?: string
  country?: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

type AvailableLocation = {
  location: null
  available: false
}

type UnvailableLocation = {
  location: Location
  available: true
}

type LocationContextProps = AvailableLocation | UnvailableLocation

const LocationContext = createContext<LocationContextProps | undefined>(undefined)

export function LocationContextProvider({ children }: React.PropsWithChildren) {
  const [location, setLocation] = useState<Location | null>(null)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync();
  
        const geoCodeLocations = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })

        setLocation({
          city: geoCodeLocations[0].city ?? geoCodeLocations[0].subregion ?? "",
          state: geoCodeLocations[0].region ?? "",
          country: geoCodeLocations[0].country ?? "",
          street: geoCodeLocations[0].street ?? "",
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        })

        setAvailable(true)
      } catch {
        setAvailable(false)
      }
    }

    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider value={available && location ? { location, available } : { location: null, available: false }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if(!context) {
    throw new Error("useLocation deve ser usado dentro de um LocationContext.Provider")
  }
  return context
}