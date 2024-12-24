import React, { useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useNotifications } from '../contexts/NotificationsContext';

interface WebSocketMessage {
    type: string;
    data?: string;
    message?: string;
}

export default function App() {
    const { lastMessage, addTranscription, sendMessage } = useWebSocket();
    const { notifications } = useNotifications();
    const [isRecording, setIsRecording] = React.useState(false);
    const [systemAudio, setSystemAudio] = React.useState(true);

    // Handle WebSocket messages
    useEffect(() => {
        if (lastMessage?.data) {
            try {
                const data = JSON.parse(lastMessage.data) as WebSocketMessage;
                if (data.type === 'transcription' && data.data) {
                    addTranscription(data.data);
                } else if (data.type === 'error' && data.message) {
                    notifications.show({
                        title: 'Error',
                        message: data.message,
                        color: 'red',
                    });
                }
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        }
    }, [lastMessage, addTranscription]);
    
    // Handle recording state
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            sendMessage({ type: 'stop' });
        } else {
            sendMessage({
                type: 'start',
                capture_system_audio: systemAudio
            });
        }
        setIsRecording(!isRecording);
    }, [isRecording, systemAudio, sendMessage]);

    return (
        // ... rest of the component code ...
    );
} 