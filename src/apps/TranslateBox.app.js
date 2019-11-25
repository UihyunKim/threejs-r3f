import * as THREE from "three";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Canvas,
  extend,
  useThree,
  useFrame,
  useUpdate
} from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Stats from "three/examples/jsm/libs/stats.module";
import Gui from "../components/Gui";
// import { GUI } from "three/examples/jsm/libs/dat.gui.module";

/**
 * IMPORT IMAGES
 */
import imgSpirit from "../assets/images/spirit-picture.png";

extend({ OrbitControls, TransformControls });

const OrControls = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useFrame(() => ref.current.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

/**
 * STATS
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const initPoints = [
  new THREE.Vector3(-10, 10, 0),
  new THREE.Vector3(-2, 1, 0),
  new THREE.Vector3(2, 1, 0),
  new THREE.Vector3(10, 10, 0)
];

const TrBox = ({ setOrbitable, initPosition, setPoints, id, gui }) => {
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
        visible={!gui.movingCamera}
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
  useFrame(() => {
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

const MovingCamera = ({ enabled, curveRef, lookAtRef, setMovingCameraRef }) => {
  const [cameraRef, setCameraRef] = useState(null);
  const eyeballRef = useRef();

  const ref = useUpdate(
    c => {
      setCameraRef(c);
      setMovingCameraRef(c);
    },
    [enabled]
  );

  useFrame(() => {
    const time = Date.now();
    const loopTime = 10 * 1000;
    const t = (time % loopTime) / loopTime;
    const pos = curveRef.getPointAt(t);
    cameraRef.position.copy(pos);
    eyeballRef.current.position.copy(pos);
    // cameraRef.lookAt(curveRef.getPointAt(1));
    cameraRef.lookAt(lookAtRef.position);
    stats.update();
  });

  return (
    <>
      <perspectiveCamera
        // <orthographicCamera
        ref={ref}
        args={[10, window.innerWidth / window.innerHeight, 0.01, 1000]}
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

const CameraSelector = ({ movingCameraRef, gui }) => {
  useFrame(({ gl, scene, camera }) => {
    // console.log(gui);
    gl.render(scene, gui.movingCamera ? movingCameraRef : camera);
  }, 1);
  return null;
};

const Spirit = ({ setSpiritRef, gui }) => {
  const ref = useRef();

  useEffect(() => {
    setSpiritRef(ref.current);
  }, []);

  return (
    <mesh visible={!gui.movingCamera} ref={ref} position={[20, 0, 0]}>
      <sphereBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshBasicMaterial attach="material" color="yellow" />
    </mesh>
  );
};

const SpiritImage = () => {
  const image = useMemo(() => new THREE.TextureLoader().load(imgSpirit), [
    imgSpirit
  ]);
  // const image = new THREE.TextureLoader().load(url);
  return image ? (
    <mesh position={[20, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <meshLambertMaterial attach="material">
        <primitive attach="map" object={image} />
      </meshLambertMaterial>
    </mesh>
  ) : null;
};

const TranslateBoxApp = () => {
  const [orbitable, setOrbitable] = useState(true);
  const [points, setPoints] = useState(initPoints);
  const [cameraView, setCameraView] = useState(true);
  const [curveRef, setCurveRef] = useState(null);
  const [movingCameraRef, setMovingCameraRef] = useState(null);
  const [gui, setGui] = useState();
  const [spiritRef, setSpiritRef] = useState(null);
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 15] }}
        shadowMap
        //
        // invalidateFrameloop
      >
        <ambientLight intensity={1} />
        {points.map((point, idx) => (
          <TrBox
            gui={gui}
            key={idx}
            id={idx}
            setOrbitable={setOrbitable}
            initPosition={[point.x, point.y, point.z]}
            setPoints={setPoints}
          />
        ))}
        {/* SPIRIT PAGE */}
        <Spirit setSpiritRef={setSpiritRef} gui={gui} />
        <Line points={points} setCurveRef={setCurveRef} />
        <MovingCamera
          enabled={cameraView}
          curveRef={curveRef}
          lookAtRef={spiritRef}
          setMovingCameraRef={setMovingCameraRef}
        />
        <CameraSelector movingCameraRef={movingCameraRef} gui={gui} />
        <OrControls enableDamping dampingFactor={0.5} enabled={orbitable} />
        <GridHelper />
        <SpiritImage />
      </Canvas>
      <Gui setGui={setGui} />
    </>
  );
};

export default TranslateBoxApp;
