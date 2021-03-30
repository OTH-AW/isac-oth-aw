import React from 'react'
import ReactDOMServer from "react-dom/server";
import queryString from 'query-string';
import { FluidNoBannerLayout } from 'layouts'
import L from 'leaflet';
import FA from 'react-fontawesome';
import { Map, Marker, Tooltip, TileLayer, LayersControl } from 'react-leaflet';
import './map-style.css';

import CustomPopup from './popup.js'

const {BaseLayer} = LayersControl;


export default class OTHMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            icons: {
                qcToPickup : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                        <FA name="long-arrow-down" size="3x" />
                    ).toString(),
                    id: "qcToPickup",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                productionToqc : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                        <FA id="printQCArrow" name="long-arrow-up" size="3x" />
                    ).toString(),
                    id: "productionToqc",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                storageqc : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                        <FA name="exchange" size="3x" rotate={90} />
                    ).toString(),
                    id: "storageqc",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                production : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                        <FA name="print" className="px-1" size="3x"/>
                    ).toString(),
                    id: "production",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                qc : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                            <FA name="check-square" className="px-1" size="3x"/>
                        ).toString(),
                    id: "qc",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                storage : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                            <FA name="save" className="px-1" size="3x" style={{transform: [{rotateY: '180deg'}]}} />
                        ).toString(),
                    id: "storage",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                pickup : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                        <FA name="shopping-cart" size="3x"/>
                        ).toString(),
                    id: "pickup",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                }),
                queue : L.divIcon({
                    popupAnchor: [0, -20],
                    html: ReactDOMServer.renderToStaticMarkup(
                        <FA name="angle-double-left" size="3x"/>
                        ).toString(),
                    id: "queue",
                    iconSize: [40, 40],
                    className: "marker overAllMap",
                })
            },
                        
            products: {
                production: {},
                storage: {},
                qc: {},
                pickup: {},
                qcToPickup: {},
                productionToqc: {},
                storageqc: {},
                inQueue: {}
            },
            selectedStation: null,
            viewButton: "Standard Karte Anzeigen",
            viewState: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.changeMapView = this.changeMapView.bind(this);

        this.backendURL = window.backendURL;
    }
    // Bei mount Datensatz laden
    componentDidMount() {
        this.getCurrentWorkpieces()
    }
    // Handler für den aktualisierungsbutton, um manuell die Datensätze zu laden
    handleSubmit(event) {
        event.preventDefault();
        this.getCurrentWorkpieces();
    }
    
    // Forder asynchron Daten an
    getCurrentWorkpieces() {
        fetch(this.backendURL + '/workpiece/all')
        .then(res => res.json())
        .then((data) => {
            console.log(data);

            let tempState = { production: {}, storage: {}, qc: {}, pickup: {}, qcToPickup: {}, productionToqc: {}, storageqc: {}, inQueue: {} };
            // Erstellen eines Temporären Objekts, dass dann den State überschreibt
            for(let station in tempState) {
                tempState[station] = {
                    Dreieck:    { Orange: [], Blau: [] },
                    Viereck:    { Orange: [], Blau: [] },
                    Kreis:      { Orange: [], Blau: [] }
                }
            }

            // Iteriert über alle Datensätze und sortiert diese nach Standort (über Id)
            // Momentan nur feste Standorte und keine Übergänge von einem zum nächsten
            // Zählt Ausserde mit, wieviele Werkstücke schon Bestellungen haben
            let orderCount = 0;
            let selectedStation = null;
            let icons = this.state.icons;
            let viewState = false;
            let searchParams = queryString.parse(window.location.search);
            data.forEach((product) => {
                if(product['_id'] === searchParams.id) {
                    selectedStation = product;
                    data[data.indexOf(product)].selected = true;
                    viewState = true;
                    this.refs[this.findStation(selectedStation)].leafletElement.openPopup();
                    this.refs[this.findStation(selectedStation)].leafletElement.getElement().classList.add("markUp");
                    console.log(icons)
                }
                if(product.order) {
                    orderCount += 1;
                    tempState[this.findStation(product)][product.shape.toValue][product.order.color.toValue].push(product);
                }
                else {
                    tempState[this.findStation(product)][product.shape.toValue][product.color.toValue].push(product);
                }
            })

            this.setState({ products: tempState, wstCount: data.length, orderCount: orderCount, selectedStation: selectedStation, viewState: viewState, viewButton:"Standard Karte anzeigen", icons: icons });
        })
        .catch(console.log)

    }

    // Gibt anhand der id die Entsprechende Station als String zurück
    findStation(wst) {
        switch (wst.state.id) {
            case 0:
               return 'inQueue';
            case 1:
                // Im Druck
                    return 'production';
            case 2:
                // Auf dem Weg von Druck zu qc
                    return 'productionToqc'
            case 3:
            case 7:
                // Im qc
                    return 'qc';
            case 4:
            case 6:
                // Auf dem Weg zwischen Lager und qc (oder andersherum)
                    return 'storageqc';
            case 5:
                // Im Lager
                    return 'storage';
            case 8:
                // Auf dem Weg von qc zur Abholstation
                    return 'qcToPickup';
            case 9:
                // In der Abholstation
                    return 'pickup';
            default:
                // Queue als Bestellung, ohne Werkstückzuweisung
                    return 'inQueue';
        }   
    }

    // Debug Funktion um Koordinaten zu bekommen
    handleMapClick(e) {
        console.log(e);
    }

    changeMapView() {
        let newText = "";
        if(this.state.viewState) {
            console.log(this.state.selectedStation)
            newText = this.state.selectedStation.workpieceId +  " Standort anzeigen";
        }
        else {
            newText = "Standard Karte Anzeigen";
        }
        this.setState({ viewButton: newText, viewState: !this.state.viewState })

    }

    // Sollte theoretisch Das Icon mit dem übergebenen Sensor durch Klassenänderung orange färben
    shouldComponentUpdate() {
        if(this.state.viewState && this.state.selectedStation !== null) {
            this.refs[this.findStation(this.state.selectedStation)].leafletElement.closePopup();
            this.refs[this.findStation(this.state.selectedStation)].leafletElement.getElement().classList.remove("markUp");
        }
        else if(this.state.selectedStation !== null){
            this.refs[this.findStation(this.state.selectedStation)].leafletElement.openPopup();
            this.refs[this.findStation(this.state.selectedStation)].leafletElement.getElement().classList.add("markUp");

        }

        return true;
    }

    render() {
        const center =                  [49.44434342436312, 11.847403049468996];
        const qcPosition =              [49.4448414609048, 11.84703290462494];
        const storagePosition =         [49.44383811636, 11.846635937690737];
        const pickupPosition =          [49.44355140958468, 11.84725821018219];
        const productionPosition =      [49.44604547616536, 11.848239898681642];
        const qcToPickupPosition =      [49.44423878810318, 11.847306489944458];
        const productionToqcPosition =  [49.44546650615867, 11.847810745239260];
        const storageqcPosition =       [49.44423878810318, 11.846716403961183];
        const queuePosition =           [49.44604547616536, 11.848679780960085];

        var buttonWrapper = (
            <div id="buttonWrapper">
                <button className="btn btn-sm btn-primary" onClick={this.changeMapView}>{this.state.viewButton}</button>
            </div>
        )

        var main = (
            <FluidNoBannerLayout title="Gesamtkarte">
                <div className="col">
                    <div className="row" id="mapWrapper">
                        <Map center={center} zoom={17} onclick={this.handleMapClick} className="col">
                            <LayersControl>
                                <BaseLayer name="JAWG-Karte" checked="true">
                                    <TileLayer
                                        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url='https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=0xTB0MDvz0hhPcFHsLXyxyVdDkylGA1e4i9MhED4Nt3rXDYea10LSOH8TSNFBAd3'
                                    />       
                                </BaseLayer>
                                <BaseLayer name="OSM-Karte">
                                    <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
                                    url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
                                    // Spassige Alternative (finde aber sieht gut aus, wenn die Server da flüssig laufen würden)
                                    // watercolor kann durch "toner" oder durch "terrain" ersetzt werden
                                    // url='https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
                                    />                                
                                </BaseLayer>
                                <BaseLayer name="Satellitenkarte">
                                    <TileLayer
                                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                    />                                                        
                                </BaseLayer>

                            </LayersControl>
                            
                            {/* Stationen */}
                            <Marker
                                ref="storage"
                                position={storagePosition}
                                icon={this.state.icons.storage}
                            >
                                <Tooltip direction="left" offset={[-20, 0]}>
                                    Lager
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.storage} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'storage' : false}/>
                            </Marker>
                            <Marker
                                ref="qc"
                                position={qcPosition}
                                icon={this.state.icons.qc}
                            >
                                <Tooltip direction="right" offset={[20, 0]}>
                                    Prüfung
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.qc} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'qc' : false}/>
                            </Marker>
                            <Marker
                                ref="production"
                                position={productionPosition}
                                icon={this.state.icons.production}
                            >
                                <Tooltip direction="left" offset={[-20, 0]}>
                                    Produktion
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.production} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'production' : false}/>
                            </Marker>
                            <Marker
                                ref="pickup"
                                position={pickupPosition}
                                icon={this.state.icons.pickup}
                            >
                                <Tooltip direction="right" offset={[20, 0]}>
                                    Abholstation
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.pickup} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'pickup' : false}/>
                            </Marker>
                            {/* Zwischenstationen */}
                            <Marker
                                ref="qcToPickup"
                                icon={this.state.icons.qcToPickup}
                                position={qcToPickupPosition}
                            >
                                <Tooltip direction="right">
                                    Von Prüfung zur Abholstation
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.qcToPickup} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'qcToPickup' : false}/>
                            </Marker>
                            <Marker
                                ref="productionToqc"
                                icon={this.state.icons.productionToqc}
                                position={productionToqcPosition}
                            >
                                <Tooltip direction="right" >
                                    Von Produktion zur Prüfung
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.productionToqc} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'productionToqc' : false}/>
                            </Marker>
                            <Marker
                                ref="storageqc"
                                icon={this.state.icons.storageqc}
                                position={storageqcPosition}
                            >
                                <Tooltip direction="left" offset={[-20, 0]}>
                                    Zwischen Lager und Prüfung
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.storageqc} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'storageToqc' : false}/>
                            </Marker>
                            <Marker
                                ref="queue"
                                icon={this.state.icons.queue}
                                position={queuePosition}
                            >
                                <Tooltip direction="right" offset={[10, 0]}>
                                    Warteschlange für Druck
                                </Tooltip>
                                <CustomPopup orderCount={this.state.orderCount} wstCount={this.state.wstCount} products={this.state.products.inQueue} markup={this.state.viewState ? this.findStation(this.state.selectedStation) === 'queue' : false}/>
                            </Marker>
                        </Map>
                        {this.state.selectedStation !== null ? buttonWrapper : null}
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 order-md-1">
                                <button className="btn btn-isac-primary btn-lg btn-block" type="submit">
                                    Aktualisieren
                            </button>
                            </div>
                        </div>
                    </form>
                </div>
            </FluidNoBannerLayout>

        );

        return main;
    }
}
