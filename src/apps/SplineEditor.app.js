import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree, useRender, extend } from "react-three-fiber";
import { useDrag, useHover } from "react-use-gesture";
import { useSpring, a } from "react-spring/three";

/** GUI */
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

/** CONTROLS */
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { DragControls } from "three/examples/jsm/controls/DragControls";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls";

/** EXNTEND */
extend({ OrbitControls });

/** STATS */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/** GUI */
const guiParams = {
  uniform: true
};
const gui = new GUI();
gui.add(guiParams, "uniform");

const OrbitController = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useRender(() => {
    // required if controls.enableDamping or controls.autoRotate are set to true
    ref.current.update();
  });
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const Plane = () => {
  useRender(() => {
    stats.update();
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -200, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
      <meshPhysicalMaterial attach="material" />
    </mesh>
  );
};

const GridHelper = () => {
  const ref = useRef();
  useRender(() => {
    ref.current.position.y = -199;
    ref.current.material.opacity = 0.25;
    ref.current.material.transparent = true;
  });
  return <gridHelper ref={ref} args={[2000, 100]} receiveShadow />;
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

const DraggableMesh = ({ setOrbitable, setShowDragGuide, setMeshPosition }) => {
  const { size, viewport } = useThree();
  const ref = useRef();
  const aspect = size.width / viewport.width;

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 }
  }));

  const bindDrag = useDrag(
    ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) =>
      set({
        position: [x / aspect, -y / aspect, 0]
        // rotation: [y / aspect, x / aspect, 0]
      }),
    { pointerEvents: true }
  );

  const bindHover = useHover(
    ({ hovering }) => {
      // console.log(hovering);
      setOrbitable(!hovering);
      setShowDragGuide(hovering);
      set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] });
    },
    { pointerEvents: true }
  );

  useRender(() => {
    // console.log(ref.current.position);
    setMeshPosition({
      x: ref.current.position.x,
      y: ref.current.position.y,
      z: ref.current.position.z
    });
  });

  return (
    <a.mesh ref={ref} {...spring} {...bindDrag()} {...bindHover()} castShadow>
      <boxBufferGeometry attach="geometry" args={[100, 100, 100]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  );
};

const DragGuide = ({ showDragGuide }) => {
  // console.log(showDragGuide);

  return null;
};

const SplineEditorApp = () => {
  const [orbitable, setOrbitable] = useState(true);
  const [showDragGuide, setShowDragGuide] = useState(false);
  const [meshPosition, setMeshPosition] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // console.log(orbitable);
    console.log(meshPosition);
  }, [meshPosition.x, meshPosition.y, meshPosition.z]);

  return (
    <>
      <Canvas
        // invalidateFrameloop
        pixelRatio={window.devicePixelRatio}
        camera={{
          position: [0, 250, 1000],
          fov: 70,
          aspect: window.innerWidth / window.innerHeight,
          near: 1,
          far: 10000
        }}
        onCreated={({ gl, scene }) => {
          scene.background = new THREE.Color(0xf0f0f0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <OrbitController
          enableDamping
          dampingFactor={0.1}
          enabled={orbitable}
        />
        <ambientLight color={new THREE.Color(0xf0f0f0)} />
        <SpotLight />

        <DragGuide showDragGuide={showDragGuide} />
        <DraggableMesh
          setOrbitable={setOrbitable}
          setShowDragGuide={setShowDragGuide}
          setMeshPosition={setMeshPosition}
        />
        <GridHelper />
        <Plane />
      </Canvas>
    </>
  );
};

export default SplineEditorApp;
