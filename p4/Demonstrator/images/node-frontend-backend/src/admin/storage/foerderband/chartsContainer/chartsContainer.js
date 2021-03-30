import React from 'react';
import DataProvider from "./data_provider.js";
import sensors from "../map/source/sensor.js";
import ChartCard from "./chartcard/ChartCard.js";
import Legend from "./legende/legende.js"
import * as d3 from 'd3';

const width = 1000;
const height = 200;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };
var updateFlag = false;

export default class ChartContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wst: 0,
            charts: {
                notification: [],
                commands: [],
                power: [],
            },
            d3State: {
                zoom: { k: 1, x: 0, y: 0 },
                xDomain: [Infinity, -Infinity],
                yDomain: [Infinity, -Infinity]
            }
        }

        this.data_provider = new DataProvider();
        this.tempCharts = {};
        this.asyncCounter = null;
        this.handleDataLoading = null;

        // Initialisierung von D3 Komponenten
        this.xScale = d3.scaleTime()
            .range([margin.left, width -margin.right])
            .domain([/* ??? */])
        this.yScale = d3.scaleLinear()
            .range([margin.top, height - margin.bottom])
            .domain([1, 0])
        this.powerScale = d3.scaleLinear()
            .range([height - margin.bottom, margin.top])
            .domain([/* ??? */])
        // LinienGenerator für D3, gibt gesammt einen String aus, der als svg-path gelesen wird
        this.lineGen = d3.line()
            .x( (d) => {return this.xScale(d.Zeit)} )
            .y( (d) => {return this.yScale(d.Wert)} )
            .curve(d3.curveStepBefore)
        this.powerLineGen = d3.line()
            .x( (d) => {return this.xScale(d.Zeit)} )
            .y( (d) => {return this.powerScale(d.Wert)} )
        this.zoom = d3.zoom()
            .extent([[0, 0], [width, height]])
            .on("zoom", () => this.zoomEvent());  

        // Methoden mit this-Scope
        this.dataRecieved = this.dataRecieved.bind(this);
    }

    // Das Zoom Event ist als Anonyme Funktion deklariert, damit der scope bei Verwendung von "this" nicht auf das d3 Objekt gelegt wird
    zoomEvent = () => {
      let zoomTransform = d3.event.transform;
      console.log(d3.zoomIdentity)
      console.log(zoomTransform)
      let standardXScale = d3.scaleTime()
                  .range([margin.left, width - margin.right])
                  .domain(this.state.d3State.xDomain);
      // Aktualisiert die Domain der Zeitachse
      this.xScale.domain(zoomTransform.rescaleX(standardXScale).domain());
      // Sorgt für ein Re-Rendering
      this.forceUpdate();
    }
    // Callback Funktion für den Data_Provider
    dataRecieved(err, data, arg, wst) {
        if (err !==null) {
            console.log(err);
        } else {
            console.log("Callback_Daten:");
            console.log(data);
        }
  
        data.wst = wst;

        // Sortierung des neuen Datensatzes anhand des Datentyps
        if (arg.datatype.power === true) {
            this.tempCharts.power.push(data);
            data.strokeIndex = this.tempCharts.power.length;
        } else if (arg.datatype.notification === true) {
            this.tempCharts.notification.push(data);
            data.strokeIndex = this.tempCharts.notification.length;
        } else if (arg.datatype.commands === true) {
            this.tempCharts.commands.push(data);
            data.strokeIndex = this.tempCharts.commands.length;
        }

        // Berechnung von möglichen neuen Grenzwerten für die Zeitachse
        let maxTime = this.state.d3State.xDomain[1];
        let minTime = this.state.d3State.xDomain[0];
        let dataMinTime = d3.min(data.data, (d) => d.Zeit);
        let dataMaxTime = d3.max(data.data, (d) => d.Zeit);
        if(dataMinTime < minTime) {
            minTime = dataMinTime;
        }
        if(dataMaxTime > maxTime) {
            maxTime = dataMaxTime;
        }

        let maxValue = this.state.d3State.yDomain[1];
        let minValue = this.state.d3State.yDomain[0];
        let dataMinValue = d3.min(data.data, (d) => d.Wert);
        let dataMaxValue = d3.max(data.data, (d) => d.Wert);
        if(dataMinValue < minValue) {
          minValue = dataMinValue;
        }
        if(dataMaxValue > maxValue) {
            maxValue = dataMaxValue;
        }
        this.powerScale.domain([minValue, maxValue])
        this.xScale.domain([minTime, maxTime]);
        this.setState( { charts: this.tempCharts, wst: wst, d3State: {xDomain: [minTime, maxTime], yDomain: [minValue, maxValue]}} );
        this.asyncCounter = this.asyncCounter - 1;
        if(this.asyncCounter === 0) {
          if(updateFlag) {
            this.handleDataLoading();
          }
        }

    }

    // Aktualisiert die Datensätze wenn notwendig
    // der Code ist nicht wasserdicht, da wegen async laden fehler unterlaufen können, wenn man zu schnell mit der Map oder der Control interagiert
    UNSAFE_componentWillReceiveProps(nextProps) {
        let wst = nextProps.wst;    
        this.tempCharts = {
          notification: [],
          commands: [],
          power: [],
        };

        this.handleDataLoading = nextProps.handleDataLoading;
        updateFlag = nextProps.flag;
        this.asyncCounter = nextProps.sensors.length;
        if (wst.length !== 0) {
          this.asyncCounter = nextProps.sensors.length * wst.length;
        }
        // Iteriert über alle aktiven Sensoren und fordert im Backend Daten an
        nextProps.sensors.forEach((sensor) => {
          let arg = sensors.find((element) => element.sensorName === sensor);
          // Prüft, welceh Datensätze schon geladen wurden und welche neu geholt werden müssen und leitet dementsprechend die nötigen Schritte ein 
          // Dient zur Zeitoptimierung solange das Async-Problem noch nicht gelöst ist
          if(this.props.sensors.includes(sensor) && wst === this.props.wst) {
    
            if (arg.datatype.power === true) {
              this.tempCharts.power.push(this.state.charts.power.find(element => element.name.search(sensor) !==-1));
            } else if (arg.datatype.notification === true) {
              this.tempCharts.notification.push(this.state.charts.notification.find(element => element.name.search(sensor) !==-1));
            } else if (arg.datatype.commands === true) {
              this.tempCharts.commands.push(this.state.charts.commands.find(element => element.name.search(sensor) !==-1));
            }
            this.setState({charts: this.tempCharts})
            if(wst.length !== 0) {
              this.asyncCounter = this.asyncCounter - wst.length;
            }
            else {
              this.asyncCounter = this.asyncCounter - 1;
            }
            if(this.asyncCounter === 0) {
              if(updateFlag) {
                this.handleDataLoading();
              }
            }
          }
          else {
            if(wst.length === 0) {
              this.data_provider.get_sensor_data(arg.databaseName, null, this.dataRecieved, arg, null, null);
            }
            else {
              wst.forEach(wstElement => {
                this.data_provider.get_sensor_data(arg.databaseName, wstElement, this.dataRecieved, arg, null, null);
              });
              }
          }
        });
    
        // Löscht letzten eintrag manuell (weil sonst ein Rendnervorgang fehlt und immer 1 datensatz angezeigt wird)
        if (nextProps.sensors.length === 0) {
          this.setState({
            charts: {
              notification: [],
              commands: [],
              power: [],
            },
          });
          if(updateFlag) {
            this.handleDataLoading();
          }
        }
    }

    render() {

        var main = (
            <div>
              <Legend information={ this.state.charts }></Legend>
              <ChartCard cardName="notification" heading="Laufbandsensoren" graphs={ this.state.charts.notification.map((dataset) =>  [this.lineGen(dataset.data), dataset.wst, dataset.strokeIndex] ) } xScale={this.xScale} yScale={this.yScale} zoom={this.zoom} />
              <ChartCard cardName="commands" heading="Drucksensoren" graphs={ this.state.charts.commands.map((dataset) =>  [this.lineGen(dataset.data), dataset.wst, dataset.strokeIndex] ) } xScale={this.xScale} yScale={this.yScale} zoom={this.zoom} />
              <ChartCard cardName="power" heading="Leistungsmesser" graphs={ this.state.charts.power.map((dataset) =>  [this.powerLineGen(dataset.data), dataset.wst, dataset.strokeIndex] ) } xScale={this.xScale} yScale={this.powerScale} zoom={this.zoom} />
            </div>
        );

        return main;
    }
}