import React, {Component} from 'react';
import * as d3 from "d3";
import * as d3scale from "d3-scale";


class RadialBarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: (window.innerWidth > 500 ? 500 : window.innerWidth)
        }

        this.chartDiv = React.createRef();
    }
    componentDidMount() {
        this.drawChart();
    }
    
    componentDidUpdate(){
        this.drawChart();
    }

    drawChart() {
        var margin = {top: 150, right: 0, bottom: 100, left: 0},
        width = this.state.width - margin.left - margin.right,
        height = this.state.width - margin.top - margin.bottom,
        innerRadius = 80,
        outerRadius = Math.min(width, height) / 2;
        var data = this.props.data

        var svg = d3.select(this.chartDiv.current).html(null)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
        
                
        
        // Scales
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0)
            .domain(data.map(function(d) {return Object.keys(d)[0];}));
        var y = d3scale.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, 20]);
        
        // Bars
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr('fill', function(d){
                if (Object.keys(d)[0] === "Blaue WST"){
                    return "#0000ff"
                } else if (Object.keys(d)[0] === "Orange WST"){
                    return "#ffa500"
                } else if (Object.keys(d)[0] === "Kreis"){
                    return "#34AEEB"
                } else if (Object.keys(d)[0] === "Quadrat"){
                    return "#31a4de"
                } else if (Object.keys(d)[0] === "Dreieck"){
                    return "#2B91C4"
                } else if (Object.keys(d)[0] === "Geprüfte WST"){
                    return "#31a4de"
                } else if (Object.keys(d)[0] === "Fehlerhafte WST"){
                    return "#2680AD"
                }
                })
        .attr("d", d3.arc() 
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d[Object.keys(d)[0]]); })
            .startAngle(function(d) { return x(Object.keys(d)[0]); })
            .endAngle(function(d) { return x(Object.keys(d)[0]) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))
        
        // Labels - Names
        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
                .attr("text-anchor", function(d) { return (x(Object.keys(d)[0]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
                .attr("transform", function(d) { return "rotate(" + ((x(Object.keys(d)[0]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ") translate(" + (y(d[Object.keys(d)[0]])+20) + ",0)"; })
            .append("text")
                .text(function(d){return(Object.keys(d)[0])})
                .attr("transform", function(d) { return (x(Object.keys(d)[0]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
                .style("font-size", "13px")
                .attr("font-family", "Open Sans")
                .attr("alignment-baseline", "middle")
        
        // Labels - Numbers
        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
                .attr("text-anchor", function(d) { return (x(Object.keys(d)[0]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
                .attr("transform", function(d) { return "rotate(" + ((x(Object.keys(d)[0]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ") translate(62,0)"; })
            .append("text")
                .text(function(d){return(d[Object.keys(d)[0]])})
                .attr("transform", function(d) { return (x(Object.keys(d)[0]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
                .style("font-size", "13px")
                .attr("font-family", "Open Sans")
                .attr("alignment-baseline", "middle")
                
    }
    
    
    render(){
        return <div ref={this.chartDiv}></div>
    }
}
      
  export default RadialBarChart;