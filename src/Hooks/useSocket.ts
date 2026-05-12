import { useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

// Instância singleton — uma só ligação para toda a app
let socketInstance: Socket | null = null

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    })
  }
  return socketInstance
}

export const useSocket = () => {
  const socketRef = useRef<Socket>(getSocket())
  return socketRef.current
}