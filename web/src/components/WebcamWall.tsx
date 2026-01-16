import { useEffect, useRef, useState } from 'react';
import { VideoTexture, LinearFilter, SRGBColorSpace } from 'three';

interface WebcamWallProps {
    width: number;
    height: number;
}

export function WebcamWall({ width, height }: WebcamWallProps) {
    const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));
    const [texture, setTexture] = useState<VideoTexture | null>(null);
    const [aspect, setAspect] = useState(1.77); // Default to 16:9

    useEffect(() => {
        const video = videoRef.current;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = () => {
            if (video.videoWidth && video.videoHeight) {
                setAspect(video.videoWidth / video.videoHeight);
            }
        };

        // Request Camera Access
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } })
                .then((stream) => {
                    video.srcObject = stream;
                    video.play();

                    const vidTex = new VideoTexture(video);
                    vidTex.minFilter = LinearFilter;
                    vidTex.magFilter = LinearFilter;
                    vidTex.generateMipmaps = false;
                    vidTex.colorSpace = SRGBColorSpace;
                    setTexture(vidTex);
                })
                .catch((err) => {
                    console.error("Webcam access denied or error:", err);
                });
        }

        return () => {
            if (video.srcObject) {
                const stream = video.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <group>
            {/* 1. The Black Base Wall (Fills the room height) */}
            <mesh rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color="#111" roughness={0.9} />
            </mesh>

            {/* 2. The Video Mesh (Sized to Aspect Ratio - Contain) */}
            {texture && (
                <mesh
                    rotation={[0, Math.PI, 0]}
                    position={[0, 0, -100]} /* Shift "Forward" into the room significantly */
                    scale={[-1, 1, 1]}
                >
                    <planeGeometry args={[
                        (aspect > width / height) ? width : height * aspect,
                        (aspect > width / height) ? width / aspect : height
                    ]} />
                    <meshBasicMaterial map={texture} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
}
