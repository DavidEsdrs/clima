import { createContext, useContext, useState } from "react"

type ConnectionContextType = {
  isConnected: boolean
  isConnecting: boolean
  tryConnect: () => Promise<void>
  closeConnection: () => Promise<void>
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export function ConnectionProvider({ children }: React.PropsWithChildren) {
  const [connected, setConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const tryConnect = (): Promise<void> => {
    return new Promise((resolve) => {
      setIsConnecting(true)
      setTimeout(() => {
        setConnected(true)
        setIsConnecting(false)
        resolve()
      }, 3000)
    })
  }

  const closeConnection = (): Promise<void> => {
    return new Promise((resolve) => {
      setIsConnecting(true)
      setTimeout(() => {
        setConnected(false)
        setIsConnecting(false)
        resolve()
      }, 3000)
    })
  }

  return (
    <ConnectionContext.Provider value={{ isConnected: connected, isConnecting, tryConnect: tryConnect, closeConnection }}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection deve ser usado dentro de um ConnectionProvider');
  }
  return context;
}