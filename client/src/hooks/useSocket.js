import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../lib/api';

let sharedSocket = null;

export function useSocket() {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!sharedSocket) {
            sharedSocket = io(BASE_URL.replace(/\/api$/, '') || '/', {
                transports: ['websocket', 'polling'], // added polling for better fallbacks
                autoConnect: true
            });
        }
        socketRef.current = sharedSocket;
        setConnected(sharedSocket.connected);

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        sharedSocket.on('connect', onConnect);
        sharedSocket.on('disconnect', onDisconnect);

        return () => {
            sharedSocket.off('connect', onConnect);
            sharedSocket.off('disconnect', onDisconnect);
        };
    }, []);

    return { socket: socketRef.current, connected };
}
