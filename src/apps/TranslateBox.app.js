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
  }, [hover, setOrbitable]);

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
        <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
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

const Line = ({ points, setCurveRef }) => {
  const geomRef = useRef();
  let catmullCurve;
  let scatteredPoints;

  useEffect(() => {
    catmullCurve = new THREE.CatmullRomCurve3(points);
    scatteredPoints = catmullCurve.getPoints(50);
    geomRef.current.setFromPoints(scatteredPoints);
    setCurveRef(catmullCurve);
  }, [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" ref={geomRef} />
      <lineBasicMaterial attach="material" color="black" />
    </line>
  );
};

const Camera = ({ enabled, curveRef }) => {
  const [cameraRef, setCameraRef] = useState(null);
  const eyeballRef = useRef();

  const ref = useUpdate(
    c => {
      setCameraRef(c);
    },
    [enabled]
  );

  useRender(() => {
    const time = Date.now();
    const loopTime = 10 * 1000;
    const t = (time % loopTime) / loopTime;
    const pos = curveRef.getPointAt(t);
    cameraRef.position.copy(pos);
    eyeballRef.current.position.copy(pos);
    cameraRef.lookAt(curveRef.getPointAt(1));
  });

  return (
    <>
      <perspectiveCamera
        ref={ref}
        args={[10, window.innerWidth / window.innerHeight, 0.01, 100]}
        position={[0, 0, 0]}
      />
      <mesh position={[0, 0, 0]} ref={eyeballRef}>
        <sphereBufferGeometry attach="geometry" args={[0.2]} />
        <meshBasicMaterial attach="material" color="gray" />
      </mesh>
      {cameraRef && <cameraHelper args={[cameraRef]} />}
    </>
  );
};

const TranslateBoxApp = () => {
  const [orbitable, setOrbitable] = useState(true);
  const [points, setPoints] = useState(initPoints);
  const [cameraView, setCameraView] = useState(true);
  const [curveRef, setCurveRef] = useState(null);

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
      <Line points={points} setCurveRef={setCurveRef} />
      <Camera enabled={cameraView} curveRef={curveRef} />
      <OrControls enableDamping dampingFactor={0.5} enabled={orbitable} />
      <GridHelper />
    </Canvas>
  );
};

export default TranslateBoxApp;
