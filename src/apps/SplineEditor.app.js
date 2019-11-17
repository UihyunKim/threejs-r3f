import React from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";

/** GUI */
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

/** CONTROLS */
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
      <meshPhysicalMaterial attach="material" />
    </mesh>
  );
};

const SplineEditorApp = () => {
  return (
    <Canvas
      camera={{
        position: [0, 250, 1000],
        fov: 70,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 10000
      }}
    >
      <Plane />
      <ambientLight color={new THREE.Color(0xf0f0f0)} />
      <spotLight
        color="white"
        intencity={1.5}
        position={[0, 1500, 200]}
        castShadow
      />
    </Canvas>
  );
};

export default SplineEditorApp;
