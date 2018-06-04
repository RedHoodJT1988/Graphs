import React, { Component } from 'react';
import { Graph } from './graph';
import './App.css';

// !!! IMPLEMENT ME
const canvasWidth = 1000;
const canvasHeight = 800;
const vertexRadius = 25;

/**
 * GraphView
 */
class GraphView extends Component {
  constructor() {
    super();
    this.drag = null;
    this.startX = null;
    this.startY = null;
    this.boundingBox = null;
    this.offsetX = null;
    this.offsetY = null;

    this.selected = [];
    this.path = [];

    this.canvas = null;
    this.ctx = null;
  }
  /**
   * On mount
   */
  componentDidMount() {
    this.createCanvas();
    this.setListeners();
    this.setBoundingBox();
    this.clearCanvas();
    this.updateCanvas();
  }

  /**
   * On state update
   */
  componentDidUpdate() {
    this.clearCanvas();
    this.updateCanvas();
  }

  createCanvas = () => {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');
  };

  setListeners = () => {
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmouseup = this.mouseUp;
    this.canvas.onmousemove = this.mouseMove;
  };

  setBoundingBox = () => {
    this.boundingBox = this.canvas.getBoundingClientRect();
    this.offsetX = this.boundingBox.left;
    this.offsetY = this.boundingBox.top;
  };

  mouseDown = e => {
    e.preventDefault();
    let vertSelected = false;

    const mouseX = +(e.clientX - this.offsetX); // Offsets are needed for events to provide the x and y position of the click for the window.
    const mouseY = +(e.clientY - this.offsetY);

    this.drag = null;
    for (let vert of this.props.graph.vertexes) {
      const dx = vert.pos.x - mouseX;
      const dy = vert.pos.y - mouseY;
      if (dx * dx + dy * dy < vertexRadius * vertexRadius) {
        this.drag = vert.value;
        if (this.seleceted[0]) {
          if (this.selected[0].group === vert.group) {
            this.selected(vert);
            this.updateCanvas();
            vertSelected = true;
          }
        } else {
          this.selected(vert);
          this.updateCanvas();
          vertSelected = true;
        }
      }
    }

    if (!vertSelected) {
      console.log('not a vertex');
      this.clearSelected();
    }
    this.startX = mouseX;
    this.startY = mouseY;
  };

  select = vert => {
    if (this.isSelected(vert)) {
      this.selected = this.selected.filter(elem => elem.value !== vert.value);
      if (this.selected.length === 0) {
        this.path = [];
      }
      this.updateCanvas();
    } else if (this.selected.length >= 2) {
      this.selected.pop();
      this.selected.push({ value: vert.value, group: vert.group });
      this.updateCanvas();
    } else {
      this.selected.push({ value: vert.value, group: vert.group });
    }
  };

  clearSelected = () => {
    this.selected = [];
    this.path = [];
    this.updateCanvas();
  };

  mouseUP = e => {
    e.preventDefault();
    this.drag = null;
  };

  mouseMove = e => {
    if (this.drag) {
      e.preventDefault();

      const mouseX = +(e.clientX - this.offsetX);
      const mouseY = +(e.clientY - this.offsetY);
      const dx = mouseX - this.startX;
      const dy = mouseY - this.startY;

      for (let vert of this.props.graph.vertexes) {
        if (this.drag === vert.value) {
          vert.pos.x += dx;
          vert.pos.y += dy;
          if (dx > 10 || dy > 10) {
            this.selected = this.selected.filter(
              elem => elem.value !== vert.value
            );
          }
        }
      }

      this.updateCanvas();
      this.startX = mouseX;
      this.startY = mouseY;
    }
  };

  clearCanvas = () => {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  isSelected = vert => {
    for (let selected of this.selected) {
      if (selected.value === vert.value) {
        return true;
      }
    }
    return false;
  };

  /**
   * Render the canvas
   */
  updateCanvas() {
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext('2d');

    // Clear it
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // !!! IMPLEMENT ME
    // compute connected components
    // draw edges
    // draw verts
    // draw vert values (labels)
  }

  /**
   * Render
   */
  render() {
    return <canvas ref="canvas" width={canvasWidth} height={canvasHeight} />;
  }
}

/**
 * App
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: new Graph(),
    };

    // !!! IMPLEMENT ME
    // use the graph randomize() method
  }

  render() {
    return (
      <div className="App">
        <GraphView graph={this.state.graph} />
      </div>
    );
  }
}

export default App;
