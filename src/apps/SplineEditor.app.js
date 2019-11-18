import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree, useRender, extend } from "react-three-fiber";

/** GUI */
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

/** CONTROLS */
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

/** EXNTEND */
extend({ OrbitControls });

const Controls = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useRender(() => {
    ref.current.update();
  });
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -200, 0]}>
      <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
      <meshPhysicalMaterial attach="material" />
    </mesh>
  );
};

const Scene = () => {
  const { scene } = useThree();
  scene.background = new THREE.Color(0xf0f0f0);
  return null;
};

const GridHelper = () => {
  const ref = useRef();
  useRender(() => {
    ref.current.position.y = -199;
    ref.current.material.opacity = 0.25;
    ref.current.material.transparent = true;
  });
  return <gridHelper ref={ref} args={[2000, 100]} />;
};

const SpotLight = () => {
  const ref = useRef();
  useRender(() => {
    ref.current.shadow = new THREE.LightShadow(
      new THREE.PerspectiveCamera(70, 1, 200, 2000)
    );
    ref.current.shadow.bias = -0.000222;
    ref.current.shadow.mapSize.width = 1024;
    ref.current.shadow.mapSize.height = 1024;
  });
  return (
    <spotLight
      ref={ref}
      color="white"
      intencity={1.5}
      position={[0, 1500, 200]}
      castShadow
    />
  );
};

const SplineEditorApp = () => {
  return (
    <Canvas
      pixelRatio={window.devicePixelRatio}
      shadowMap
      camera={{
        position: [0, 250, 1000],
        fov: 70,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 10000
      }}
    >
      <Scene />
      <GridHelper />
      <Controls />
      <Plane />
      <ambientLight color={new THREE.Color(0xf0f0f0)} />
      <SpotLight />
    </Canvas>
  );
};

export default SplineEditorApp;
