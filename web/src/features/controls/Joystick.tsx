import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

interface JoystickProps {
    onMove?: (data: { x: number; y: number }) => void;
    onEnd?: () => void;
    side?: 'left' | 'right';
    color?: string;
}

export function Joystick({ onMove, onEnd, side = 'right', color = 'dodgerblue' }: JoystickProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<nipplejs.JoystickManager | null>(null);

    // Keep latest callbacks in refs to avoid re-creating nipplejs on render
    const onMoveRef = useRef(onMove);
    const onEndRef = useRef(onEnd);

    // Update refs whenever props change
    useEffect(() => {
        onMoveRef.current = onMove;
        onEndRef.current = onEnd;
    }, [onMove, onEnd]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create Joystick Manager
        const manager = nipplejs.create({
            zone: containerRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: color,
            size: 100,
            threshold: 0.1,
            restOpacity: 0.8, // Always visible
        });

        managerRef.current = manager;

        // Bind Events
        manager.on('move', (_, data) => {
            if (onMoveRef.current && data.vector) {
                onMoveRef.current(data.vector);
            }
        });

        manager.on('end', () => {
            if (onEndRef.current) {
                onEndRef.current();
            }
        });

        // Cleanup
        return () => {
            manager.destroy();
            managerRef.current = null;
        };
    }, [color]); // Only re-create if visual color changes. NOT on callback change.

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                bottom: '5%',
                [side === 'left' ? 'left' : 'right']: '5%',
                width: '150px',
                height: '150px',
                zIndex: 10,
                touchAction: 'none', // Critical for preventing scroll on mobile
            }}
        />
    );
}
