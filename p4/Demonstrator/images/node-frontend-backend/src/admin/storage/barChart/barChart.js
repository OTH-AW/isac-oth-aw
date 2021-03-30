import React, {Component} from 'react';
import * as d3 from "d3";



class BarChart extends Component {
    constructor(props) {
        super(props);
        this.chartDiv = React.createRef();
    }

    componentDidMount() {
        this.drawChart();
    }
    
    componentDidUpdate(){
        const widthBar = 20
        const gap = 20
        var svg
        var data = this.props.data
        d3.select(this.chartDiv.current).html(null);
        svg = d3.select(this.chartDiv.current).append("svg")
            .attr("width", "100%")
            .attr("height", this.props.height)
            .style("border", "1px solid black");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i * (widthBar+gap))+gap+"%")
            .attr("y", (d, i) => this.props.height - 10 * d)
            .attr("width", "20%")
            .attr("height", (d, i) => d * 10)
            .attr("fill", (d, i) => {if(i===0){return "orange"}else if(i===1){return "blue"}else{return "black"}})

        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .style("text-anchor","middle")
            .attr("x", (d, i) => (i * (widthBar+gap))+gap+widthBar/2+"%")
            .attr("y", (d, i) => this.props.height - (10 * d) - 3)
    }

    drawChart() {
        var data = this.props.data;
        const widthBar = 20
        const gap = 20
        var svg

        svg = d3.select(this.chartDiv.current).append("svg")
            .attr("width", "100%")
            .attr("height", this.props.height)
            .style("border", "1px solid black");

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i * (widthBar+gap))+gap+"%")
            .attr("y", (d, i) => this.props.height - 10 * d)
            .attr("width", "20%")
            .attr("height", (d, i) => d * 10)
            .attr("fill", (d, i) => {if(i===0){return "orange"}else if(i===1){return "blue"}else{return "black"}})

        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .style("text-anchor","middle")
            .attr("x", (d, i) => (i * (widthBar+gap))+gap+widthBar/2+"%")
            .attr("y", (d, i) => this.props.height - (10 * d) - 3)
    }
          
    render(){
        return <div ref={this.chartDiv}></div>
    }
  }
      
  export default BarChart;
  
  
  
  