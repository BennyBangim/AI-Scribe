import { useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = `ws://${window.location.hostname}:8000/ws/transcribe`;

interface WebSocketHook {
    sendMessage: (data: unknown) => void;
    sendBinary: (data: ArrayBuffer) => void;
    lastMessage: WebSocketEventMap['message'] | null;
    readyState: number;
    connectionStatus: string;
    isConnected: boolean;
    isConnecting: boolean;
    isClosed: boolean;
}

export function useWebSocket(): WebSocketHook {
    const {
        sendMessage: rawSendMessage,
        lastMessage,
        readyState,
        getWebSocket
    } = useWebSocket(WS_URL, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });
    
    // Keep track of connection status
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    
    // Send binary data
    const sendBinaryData = useCallback((data: ArrayBuffer) => {
        const ws = getWebSocket();
        if (ws && readyState === ReadyState.OPEN) {
            ws.send(data);
        }
    }, [getWebSocket, readyState]);
    
    // Send JSON data
    const sendJsonData = useCallback((data: unknown) => {
        if (readyState === ReadyState.OPEN) {
            rawSendMessage(JSON.stringify(data));
        }
    }, [rawSendMessage, readyState]);
    
    return {
        sendMessage: sendJsonData,
        sendBinary: sendBinaryData,
        lastMessage,
        readyState,
        connectionStatus,
        isConnected: readyState === ReadyState.OPEN,
        isConnecting: readyState === ReadyState.CONNECTING,
        isClosed: readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING,
    };
} 