import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Graph, type GraphData } from './Graph';
import { Rabbit } from './Rabbit';

interface VizSceneProps {
    data: GraphData | null;
}

export function VizScene({ data }: VizSceneProps) {
    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000010' }}>
            <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {data && <Graph data={data} />}

                {/* Our Happy Rabbit Friend needs to see the graph too! */}
                <Rabbit position={[3, -2, 2]} />

                <OrbitControls makeDefault />
            </Canvas>
        </div>
    );
}
