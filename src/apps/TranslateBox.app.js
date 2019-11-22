import * as THREE from "three";
import React, { useState, useEffect, useRef } from "react";
import {
  Canvas,
  extend,
  useThree,
  useRender,
  useUpdate
} from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

extend({ OrbitControls, TransformControls });
const OrControls = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useRender(() => ref.current.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const initPoints = [
  new THREE.Vector3(-10, 10, 0),
  new THREE.Vector3(-2, 1, 0),
  new THREE.Vector3(2, 1, 0),
  new THREE.Vector3(10, 10, 0)
];

const TrBox = ({ setOrbitable, initPosition, setPoints, id }) => {
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

  const pointSet = () => {
    setPoints(prev => {
      const curr = [...prev];
      curr[id] = meshRef.current.position;
      return curr;
    });
  };

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerUp={pointSet}
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

const Line = ({ points }) => {
  var curve = new THREE.CatmullRomCurve3(points);
  const scatterdPoints = curve.getPoints(50);

  const ref = useUpdate(
    geom => {
      console.log(geom);
      geom.setFromPoints(scatterdPoints);
    },
    [points]
  );
  return (
    <line>
      <bufferGeometry attach="geometry" ref={ref} />
      <lineBasicMaterial attach="material" color="black" />
    </line>
  );
};

const TranslateBoxApp = () => {
  const [orbitable, setOrbitable] = useState(true);
  const [points, setPoints] = useState(initPoints);

  return (
    <Canvas
      camera={{ position: [0, 0, 15] }}
      shadowMap //
    >
      <ambientLight intensity={1} />
      {points.map((point, idx) => (
        <TrBox
          key={idx}
          id={idx}
          setOrbitable={setOrbitable}
          initPosition={[point.x, point.y, point.z]}
          setPoints={setPoints}
        />
      ))}
      <Line points={points} />
      <OrControls enableDamping dampingFactor={0.5} enabled={orbitable} />
      <GridHelper />
    </Canvas>
  );
};

export default TranslateBoxApp;
