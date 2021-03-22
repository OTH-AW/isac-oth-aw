import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import {
  Map,
  Marker,
  CircleMarker,
  Popup,
  TileLayer,
  ImageOverlay,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";

import "font-awesome/css/font-awesome.css";
import FA from "react-fontawesome";

import background from "./source/img/background.jpg";
import draufsicht from "./source/img/realsight.png";
import gummiband from "./source/img/gummiband.svg";
import laufband from "./source/img/laufbaender.svg";

import sensors from "./source/sensor.js";

const { BaseLayer, Overlay } = LayersControl;

export default class MapLeaflet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // activeSensorsName
      activeSensors: [],
      lat: 500,
      lng: 500,
      zoom: -60,
      markers: {},
    };

    // Collection über alle Benötigten Icons für die Map
    this.icon = {
      bolt: L.divIcon({
        html: ReactDOMServer.renderToStaticMarkup(
          <FA className="faIcon" name="bolt" style={{ color: "grey" }} />
        ).toString(),
        iconSize: [20, 20],
        className: "marker",
      }),
      rightLeftArrow: L.divIcon({
        html: ReactDOMServer.renderToStaticMarkup(
          <FA className="faIcon" name="arrows-h" style={{ color: "grey" }} />
        ).toString(),
        iconSize: [20, 20],
        className: "marker",
      }),
      upDownArrow: L.divIcon({
        html: ReactDOMServer.renderToStaticMarkup(
          <FA className="faIcon" name="arrows-v" style={{ color: "grey" }} />
        ).toString(),
        iconSize: [20, 20],
        className: "marker",
      }),
    };

    this.drawMarkers = this.drawMarkers.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Kümmert sich um alle INterkationen mit Markern
  handleClick(e) {
    /* TODO: Markierung für Power Icons
     *  Style des Icon lässt sich nicht direkt ansprechen, da html als string hinterlegt ist
     *  Habe noch keinen Intelligenten Lösungsansatz, der es verhindert, react aussen vor zu lassen und das hardzucoden
     */

    if ( this.state.activeSensors.find( (sensor) => sensor === e.target.options.sensorname ) === undefined ) {
      this.setState({
        activeSensors: this.state.activeSensors.concat(
          e.target.options.sensorname
        ),
        markers: { [e.target.options.sensorname]: "red" },
      });
    } 
    else {
      this.setState({
        activeSensors: this.state.activeSensors.filter(
          (sensor) => sensor !== e.target.options.sensorname
        ),
        markers: { [e.target.options.sensorname]: e.target.options.color },
      });
    }
    this.props.update(this.state.activeSensors);
  }

  // Erstellt JSX-Componenten als Marker für übergebenen Sensor
  drawMarkers(sensor) {
    let popup = (
      <Popup position={sensor.coordinates}> {sensor.sensorName} </Popup>
    );

    if (sensor.icon === "circle") {
      return (
        <CircleMarker
          center={sensor.coordinates}
          color={sensor.color}
          fillColor={this.state.markers[sensor.sensorName]}
          fillOpacity="0.5"
          weight="2"
          sensorname={sensor.sensorName}
          key={sensor.sensorName}
          onMouseOver={(e) => {
            e.target.openPopup();
          }}
          onMouseOut={(e) => {
            e.target.closePopup();
          }}
          onClick={this.handleClick}
        >
          {popup}
        </CircleMarker>
      );
    }
    return (
      <Marker
        position={sensor.coordinates}
        icon={this.icon[sensor.icon]}
        sensorname={sensor.sensorName}
        key={sensor.sensorName}
        onMouseOver={(e) => {
          e.target.openPopup();
        }}
        onMouseOut={(e) => {
          e.target.closePopup();
        }}
        onClick={this.handleClick}
      >
        {popup}
      </Marker>
    );
  }

  render() {
    const position = [this.state.lat, this.state.lng];
       
    /* Div mit Loading Spinner, wird sichtbar wenn Map auf height:0 gesetzt wird. 
    Workarround, weil mit conditional rendering die map jedes mal neu initialisert wird und so immer nur den aktuellesten angelickten Sensor anzeigen würde */
    var loadingDiv = (
          <div className="bg-light text-center" id="loadingDiv" style={this.props.loadingFlag ? { height: "500px" } : {height: "0px" }}>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
    )
      var main = (
        <div id="map">
          <Map
            style={this.props.loadingFlag ? { height: "0px" } : {height: "500px" }}
            center={position}
            minZoom={-1}
            maxZoom={1}
            crs={L.CRS.Simple}
            bounds={[
              [0, 0],
              [700, 1000],
            ]}
          >
          {/* Layercontrol ist das Fenster rechts oben auf der Map, indem man die verschiedenen Ebenen umschalten kann 
          *   Jeder Layer, der wegschaltbar sien soll muss innerhalb der LayerControl liegen, den Rest erledigt Leaflet automatisch
          */}
            <LayersControl positon="topright">
              <TileLayer url={background} />
              {/* Baselayer sind eine von 2 Layergruppen die in der Control gestauert werden können. 
              *   Bei Baselayern kann immer nur eine Ebene gleichzeitig angezeigt werden
               */}
              <BaseLayer name="3D-Draufsicht" checked="true">
                <ImageOverlay
                  url={draufsicht}
                  bounds={[
                    [146, 30],
                    [688, 980],
                  ]}
                />
              </BaseLayer>
              <BaseLayer name="Gummibänder">
                <ImageOverlay
                  url={gummiband}
                  bounds={[
                    [0, -65],
                    [712, 1000],
                  ]}
                />
              </BaseLayer>
              <BaseLayer name="Laufband">
                <ImageOverlay
                  url={laufband}
                />
              </BaseLayer>
              {/* Overlays sind die 2te Gruppe von Layern, hier können eliebig viele gleichzeitig angezeigt werden 
               */}
              <Overlay name="Lasersensoren" checked="true">
              {/* Eine  Layergroup kann verschiedene Leaflet Elmente zu einem Layer vereinigen, in diesme Fall eine Auswahl an Sensoren */}
                <LayerGroup>
                  {sensors
                    .filter((sensor) => sensor.layer === "laserSensor")
                    .map(this.drawMarkers)}
                </LayerGroup>
              </Overlay>
              <Overlay name="Pneumatikzylinder" checked="true">
                <LayerGroup>
                  {sensors
                    .filter((sensor) => sensor.layer === "pneumaticSensor")
                    .map(this.drawMarkers)}
                </LayerGroup>
              </Overlay>
              <Overlay name="Näherungssensoren" checked="true">
                <LayerGroup>
                  {sensors
                    .filter((sensor) => sensor.layer === "touchSensor")
                    .map(this.drawMarkers)}
                </LayerGroup>
              </Overlay>
              <Overlay name="Leistungsmesser" checked="true">
                <LayerGroup>
                  {sensors
                    .filter((sensor) => sensor.layer === "powerMeters")
                    .map(this.drawMarkers)}
                </LayerGroup>
              </Overlay>
            </LayersControl>
          </Map>
          {this.props.loadingFlag ? loadingDiv : null}
        </div>
      );    

    return main;
  }
}
