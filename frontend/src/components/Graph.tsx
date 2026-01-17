import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export interface GraphData {
    question: string;
    answer: string;
    context: {
        kg: any; // Knowledge Graph data
        papers: any; // Spanner/Papers data
    };
}

interface NodeProps {
    position: [number, number, number];
    color: string;
    label: string;
    scale?: number;
    onClick?: () => void;
}

function Node({ position, color, label, scale = 1, onClick }: NodeProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle floating animation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                scale={hovered ? scale * 1.2 : scale}
                onClick={onClick}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.1} />
            </mesh>
            <Billboard position={[0, 0.8 * scale, 0]}>
                <Text
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="black"
                    maxWidth={4} // Wrap long text
                    textAlign="center"
                >
                    {label}
                </Text>
            </Billboard>
        </group>
    );
}

export function Graph({ data }: { data: GraphData }) {
    // Layout logic: central node = question, orbiting nodes = context
    const nodes = useMemo(() => {
        console.log("Graph received data:", data);
        const items = [];

        // Central Node (Answer)
        items.push({
            id: 'root',
            position: [0, 0, 0] as [number, number, number],
            color: '#ff0055',
            label: data.answer || 'Waiting for question...', // Show the answer text
            scale: 1.5
        });

        const radius = 6;
        let angle = 0;

        // Parse real KG Data
        // The Google KG API returns { itemListElement: [...] }
        const kgItems = data.context.kg?.itemListElement || [];

        const contextItems = kgItems.map((item: any) => ({
            type: 'KG',
            label: item.result.name,
            color: '#00ccff',
            description: item.result.description
        }));

        // Add "Papers" (CreativeWorks from KG)
        const paperItems = data.context.papers?.itemListElement || [];
        paperItems.forEach((item: any) => {
            contextItems.push({
                type: 'Paper',
                label: item.result.name,
                color: '#ffcc00', // Gold for papers
                description: item.result.description
            });
        });

        const step = (Math.PI * 2) / Math.max(1, contextItems.length);

        contextItems.forEach((item: any, i: number) => {
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            items.push({
                id: `node-${i}`,
                position: [x, 0, z] as [number, number, number],
                color: item.color,
                label: item.label,
                scale: 1
            });
            angle += step;
        });

        return items;
    }, [data]);

    return (
        <group>
            {nodes.map((node) => (
                <group key={node.id}>
                    <Node
                        position={node.position}
                        color={node.color}
                        label={node.label}
                        scale={node.scale}
                    />
                    {/* Connection to center */}
                    {node.id !== 'root' && (
                        <Line
                            points={[[0, 0, 0], node.position]}
                            color="white"
                            transparent
                            opacity={0.2}
                            lineWidth={1}
                        />
                    )}
                </group>
            ))}
        </group>
    );
}
