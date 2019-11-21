import React from "react";
import { createGlobalStyle } from "styled-components";
// import SplineEditorApp from "./apps/SplineEditor.app";
import SliderApp from "./apps/Slider.app";
const App = () => {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <SliderApp />
        {/* <SplineEditorApp /> */}
      </div>
    </>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    user-select: none;
    overflow: hidden;
  }
  
  .App {
    width: 100%;
    height: 100%;
  }
`;
