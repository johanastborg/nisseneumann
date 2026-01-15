import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Rabbit({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (group.current) {
            // Happy bounce animation
            const t = state.clock.getElapsedTime();
            group.current.position.y = position[1] + Math.abs(Math.sin(t * 3)) * 0.5;
            group.current.rotation.y = Math.sin(t) * 0.2;
        }
    });

    const bodyColor = "white";
    const earColor = "pink";

    return (
        <group
            ref={group}
            position={new THREE.Vector3(...position)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={hovered ? 1.1 : 1}
        >
            {/* Body */}
            <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.6, 0.2]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>

            {/* Ears */}
            <group position={[0, 2.1, 0.2]}>
                {/* Left Ear */}
                <mesh position={[-0.2, 0.4, 0]} rotation={[0, 0, 0.2]}>
                    <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
                    <meshStandardMaterial color={bodyColor} />
                </mesh>
                <mesh position={[-0.2, 0.4, 0.08]} rotation={[0, 0, 0.2]}>
                    <capsuleGeometry args={[0.06, 0.6, 4, 8]} />
                    <meshStandardMaterial color={earColor} />
                </mesh>

                {/* Right Ear */}
                <mesh position={[0.2, 0.4, 0]} rotation={[0, 0, -0.2]}>
                    <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
                    <meshStandardMaterial color={bodyColor} />
                </mesh>
                <mesh position={[0.2, 0.4, 0.08]} rotation={[0, 0, -0.2]}>
                    <capsuleGeometry args={[0.06, 0.6, 4, 8]} />
                    <meshStandardMaterial color={earColor} />
                </mesh>
            </group>

            {/* Face Features */}
            <group position={[0, 1.6, 0.65]}>
                {/* Eyes */}
                <mesh position={[-0.15, 0.1, 0]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.15, 0.1, 0]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="black" />
                </mesh>

                {/* Nose */}
                <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial color="pink" />
                </mesh>

                {/* Happy Mouth */}
                <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI]}>
                    <torusGeometry args={[0.06, 0.02, 16, 100, Math.PI]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>

            {/* Tail */}
            <mesh position={[0, 0.4, -0.6]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={bodyColor} />
            </mesh>
        </group>
    );
}
