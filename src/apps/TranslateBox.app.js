import * as THREE from "three";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, extend, useThree, useRender } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

extend({ OrbitControls, TransformControls });
const OrControls = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useRender(() => ref.current.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const TrBox = ({ setOrbitable, initPosition }) => {
  const [hover, setHover] = useState(false);
  const { gl, camera } = useThree();
  const meshRef = useRef();
  const controlRef = useRef();
  let { position } = meshRef.current || initPosition;

  useEffect(() => {
    if (hover) {
      controlRef.current.attach(meshRef.current);
      setOrbitable(false);
    } else {
      controlRef.current.detach(meshRef.current);
      setOrbitable(true);
    }
  }, [hover]);

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        position={position || initPosition}
      >
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshNormalMaterial attach="material" />
      </mesh>
      <transformControls ref={controlRef} args={[camera, gl.domElement]} />
    </>
  );
};

const GridHelper = () => {
  const ref = useRef();
  useRender(() => {
    ref.current.position.y = -5;
    ref.current.material.opacity = 0.25;
    ref.current.material.transparent = true;
  });
  return <gridHelper ref={ref} args={[100, 100]} receiveShadow />;
};

const TranslateBoxApp = () => {
  const [orbitable, setOrbitable] = useState(true);

  return (
    <Canvas
      camera={{ position: [0, 0, 15] }}
      shadowMap //
    >
      <ambientLight intensity={1} />
      <TrBox setOrbitable={setOrbitable} initPosition={[-5, 0, 0]} />
      <TrBox setOrbitable={setOrbitable} initPosition={[5, 0, 0]} />
      <OrControls enableDamping dampingFactor={0.5} enabled={orbitable} />
      <GridHelper />
    </Canvas>
  );
};

export default TranslateBoxApp;
