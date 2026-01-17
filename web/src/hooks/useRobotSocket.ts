import { useEffect, useRef, useState, useCallback } from 'react';

type RobotCommand = {
    move?: { v: number; w: number };
    look?: { pan: number; tilt: number };
};

export function useRobotSocket(url: string) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // External commands received (e.g. from CV)
    const [extMoveCmd, setExtMoveCmd] = useState({ v: 0, w: 0 });
    const [extLookCmd, setExtLookCmd] = useState({ pan: 0, tilt: 0 });

    useEffect(() => {
        let socket: WebSocket | null = null;
        const connectTimeout = setTimeout(() => {
            socket = new WebSocket(url);

            socket.onopen = () => {
                console.log('Connected to r4 Brain');
                setIsConnected(true);
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'control') {
                        if (data.move) setExtMoveCmd(data.move);
                        if (data.look) setExtLookCmd(data.look);
                    }
                } catch (e) {
                    // Ignore invalid json
                }
            };

            socket.onclose = () => {
                console.log('Disconnected from r4 Brain');
                setIsConnected(false);
            };

            socket.onerror = (err: Event) => {
                // Silence "error" during cleanup
                if (socket && socket.readyState !== WebSocket.CLOSED && socket.readyState !== WebSocket.CLOSING) {
                    console.error('WebSocket Error:', err);
                }
            };

            ws.current = socket;
        }, 100); // 100ms debounce to avoid StrictMode double-mount issues

        return () => {
            clearTimeout(connectTimeout);
            if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
                socket.close();
            }
        };
    }, [url]);

    const sendCommand = useCallback((cmd: RobotCommand) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'control',
                ...cmd
            }));
        }
    }, []);

    return {
        isConnected,
        moveCmd: extMoveCmd,
        lookCmd: extLookCmd,
        sendCommand
    };
}
