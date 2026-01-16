import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

interface JoystickProps {
    onMove?: (data: { x: number; y: number }) => void;
    onEnd?: () => void;
}

export function Joystick({ onMove, onEnd }: JoystickProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const manager = nipplejs.create({
            zone: containerRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'dodgerblue',
        });

        manager.on('move', (_, data) => {
            // Normalize vector (0-1)
            if (onMove && data.vector) {
                onMove(data.vector);
            }
        });

        manager.on('end', () => {
            if (onEnd) onEnd();
        });

        return () => {
            manager.destroy();
        };
    }, [onMove, onEnd]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                bottom: '5%',
                right: '5%',
                width: '150px',
                height: '150px',
                zIndex: 10,
                touchAction: 'none' // Important for touch events
            }}
        />
    );
}
