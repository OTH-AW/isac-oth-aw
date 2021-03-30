import React, { Component } from "react";
import * as d3 from "d3";

// TODO: Width responsive setzen
const width = 1000;
const height = 200;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

export default class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    // D3 Achsen
    this.xAxis = d3.axisBottom()
      .scale(this.props.xScale)
      .tickFormat(d3.timeFormat("%H:%M:%S"))
    this.yAxis = d3.axisLeft()
      .scale(this.props.yScale)
      .ticks(1)
  }

  // D3 Zoom initialisierung für das Chart
  componentDidMount() {
    if(this.props.cardName === "power") {
      this.yAxis.ticks(5);
    }
    d3.select(this.refs.zoomArea).call(this.props.zoom);
  }

    // D3 muss hier selbst updates ausführen, die aufs DOM zugreifen
  componentDidUpdate() {
    d3.select(this.refs.zoomArea).call(this.props.zoom);
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    let colors = ['#FF4500', '#FFAE42', '#9ACD32', '#0099CC', '#8A2BE2', '#D02090'];
    // Verschiebungen für einzelne Chart-Elemente
    let translateX = "translate(0, " + (height - margin.bottom) + ")";
    let translateY = "translate(" + margin.left + ", 0)";
    let translateRect = "translate(" + margin.left + "," + margin.top + ")";

    // Mapped für jeden Graphen den dazugehörigen Pfad
    var chart = this.props.graphs.map((element,i) => {
      let color = colors[element[1]];
      if(element[1] === null) {
        color = 'grey'
      }
      return (
        <path d={element[0]} fill="none" stroke={color} strokeDasharray={(element[2]-1) + "," + (element[2]-1)/2} key={i} transform={translateX} />
      )
    }
    );


    return (
      <svg width={width} height={height}>
        <clipPath id="clip">
          <rect width={width} height={height*2} transform={translateRect} ></rect>
        </clipPath>

        <g>
          <g ref="xAxis" transform={translateX}></g>
          <g ref="yAxis" transform={translateY}></g>
        </g>
        <g transform={"translate(0, -" + (height - margin.bottom) + ")"} clipPath="url(#clip)" >
          {chart}
        </g>
          <rect  ref="zoomArea" width={width} height={height} style={{fill: 'none', pointerEvents: 'all'}} transform={translateRect} ></rect>

      </svg>
    );
  }
}