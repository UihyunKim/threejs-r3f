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
    ></Canvas>
  );
};

export default SplineEditorApp;
