import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString
} from "react-dat-gui";
import React, { Component } from "react";
import "../../node_modules/react-dat-gui/dist/index.css";

export default class Gui extends Component {
  state = {
    data: {
      package: "Camera",
      movingCamera: false
    }
  };

  componentDidMount() {
    this.props.setGui(this.state.data);
  }
  // Update current state with changes from controls
  handleUpdate = newData => {
    this.props.setGui(newData);
    return this.setState(prevState => ({
      data: { ...prevState.data, ...newData }
    }));
  };

  render() {
    const { data } = this.state;

    return (
      <DatGui data={data} onUpdate={this.handleUpdate}>
        <DatBoolean path="movingCamera" label="movingCamera" />
      </DatGui>
    );
  }
}
