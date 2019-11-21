import React, { useState, useEffect } from "react";
import * as THREE from "three";
import flatten from "lodash-es/flatten";
import { SVGLoader as Loader } from "../utils/SVGLoader";
import { Canvas } from "react-three-fiber";
import { useTransition, useSpring, a } from "react-spring/three";

const colors = [
  "#21242d",
  "#ea5158",
  "#0d4663",
  "#ffbcb7",
  "#2d4a3e",
  "#8bd8d2"
];
const svgs = ["night", "city", "morning", "tubes", "woods", "beach"]
  .map(
    name =>
      `https://raw.githubusercontent.com/drcmda/react-three-fiber/master/examples/resources/images/svg/${name}.svg`
  )
  .map(
    url =>
      new Promise(resolve =>
        new Loader().load(url, shapes =>
          resolve(
            flatten(
              shapes.map((group, index) =>
                group
                  .toShapes(true)
                  .map(shape => ({ shape, color: group.color, index }))
              )
            )
          )
        )
      )
  );

const Shape = ({ shape, rotation, position, color, opacity, index }) => {
  return (
    <a.mesh
      rotation={rotation}
      position={position.interpolate((x, y, z) => [x, y, z + -index * 50])}
    >
      <a.meshPhongMaterial
        attach="material"
        color={color}
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        transparent
      />
      <shapeBufferGeometry attach="geometry" args={[shape]} />
    </a.mesh>
  );
};

const Scene = () => {
  const [page, setPage] = useState(0);
  const [shapes, setShapes] = useState([]);
  // Switches scenes every 3 seconds
  useEffect(
    () =>
      void setInterval(
        () =>
          setPage(i => {
            // console.log(i, svgs.length, (i + 1) % svgs.length);
            return (i + 1) % svgs.length;
          }),
        3000
      ),
    []
  );
  // Converts current SVG into mesh-shapes: https://threejs.org/docs/index.html#examples/loaders/SVGLoader
  useEffect(() => void svgs[page].then(setShapes), [page]);
  // This spring controls the background color animation
  const { color } = useSpring({ color: colors[page] });
  // This one is like a transition group, but instead of handling div's it mounts/unmounts meshes in a fancy way
  const transitions = useTransition(shapes, item => item.shape.uuid, {
    from: { rotation: [-0.2, 0.9, 0], position: [0, 50, -200], opacity: 0 },
    enter: { rotation: [0, 0, 0], position: [0, 0, 0], opacity: 1 },
    leave: { rotation: [0.2, -0.9, 0], position: [0, -400, 200], opacity: 0 },
    config: { mass: 30, tension: 800, friction: 190, precision: 0.0001 },
    ...{
      order: ["leave", "enter", "update"],
      trail: 15,
      lazy: true,
      unique: true,
      reset: true
    }
  });
  return (
    <>
      <mesh
        scale={[20000, 20000, 1]}
        rotation={[0, THREE.Math.degToRad(-20), 0]}
      >
        <planeGeometry attach="geometry" args={[1, 1]} />
        <a.meshPhongMaterial
          attach="material"
          color={color}
          depthTest={false}
        />
      </mesh>
      <group
        position={[1600, -700, page]}
        rotation={[0, THREE.Math.degToRad(180), 0]}
      >
        {transitions.map(({ item, key, props }) => (
          <Shape key={key} {...item} {...props} />
        ))}
      </group>
    </>
  );
};

const SliderApp = () => {
  return (
    <Canvas
      invalidateFrameloop
      camera={{
        fov: 90,
        position: [0, 0, 1800],
        rotation: [0, THREE.Math.degToRad(-20), THREE.Math.degToRad(180)],
        near: 0.1,
        far: 20000
      }}
    >
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.5} position={[300, 300, 4000]} />
      <Scene />
    </Canvas>
  );
};

export default SliderApp;
