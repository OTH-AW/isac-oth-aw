import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"
import { NoBannerLayout } from 'layouts'


export default class WebGL extends React.Component {
    constructor(props) {
        super(props)

        // TODO: Pfade herrausfinden und einplegen
        let content = new UnityContent(
            "./" + this.props.directory + "/Build/" + this.props.project,
            "./" + this.props.directory + "/Build/UnityLoader.js",
            {
                modules: { 
                    onRuntimeInitialized: () => {
						// Fix dragging sometimes showing an empty document / "not allowed" icon
						// @Edge
						document.getElementsByTagName('canvas')[0].ondragstart = function() { return false; }
                    }
                }
            }
        )

        window.unityInstance = content
    }

    renderInteractiveHint() {
        if(this.props.showInteractiveHint === "true") {
            return (
                <div className="alert alert-warning" role="alert">
                    <p>Einschränkungen</p>
Aufgrund von Kapazitätslimitationen während des Projekts konnte nicht für jede 3D-Visualisierung eine Anbindung an einen OPC UA Server implementiert werden. Deshalb verweisen wir auf die Komponente <a href="/webgl_unity_tp1">Druck • 3D-Ansicht</a>, um die Vorteile bei der Verwendung eines Digitalen Zwillings erforschen zu können. In dieser wurde eine Anbindung an einen OPC UA Server implementiert. Dadurch kann der derzeitige Druckfortschritt überwacht und die Druckaktivität anhand eines sich bewegenden Druckerkopfes visualisiert werden.
                </div>
            )
        }
    }

    getCommonHintText() {
        if(this.props.tpId === "tp2") {
            return "Mit Hilfe eines Digitalen Zwillings können Informationen einer physikalischen Industrieanlage weltweit zur Verfügung gestellt und überwacht werden. Mit diesen Daten kann dann zu jeder Zeit der aktuelle Stand des Systems überwacht werden. In diesem Prototypen wird die verwendete Maschine in einer interaktiven 3D-Ansicht dargestellt. Als weitere Funktionalität wäre die Anzeige der derzeitig eingelagerten Werkstücke sowie die Visualisierung des Ein- und Auslagerprozesses vorstellbar."
        } else if (this.props.tpId === "tp3") {
            return "Mit Hilfe eines Digitalen Zwillings können Informationen einer physikalischen Industrieanlage weltweit zur Verfügung gestellt und überwacht werden. Mit diesen Daten kann dann zu jeder Zeit der aktuelle Stand des Systems überwacht werden. In diesem Prototypen wird die verwendete Maschine in einer interaktiven 3D-Ansicht dargestellt. Vorstellbar wäre außerdem die Darstellung des aktiven Prüfprozesses."
        } else {
            return "Mit Hilfe eines Digitalen Zwillings können Informationen einer physikalischen Industrieanlage weltweit zur Verfügung gestellt und überwacht werden. Mit diesen Daten kann dann zu jeder Zeit der aktuelle Stand des Systems überwacht werden. In diesem Prototypen wurde der Name der Maschine sowie der derzeitige Druckfortschritt visualisiert. Wenn sich ein Bauteil in Druck befindet, dann wird als zusätzlicher Indikator der Druckkopf bewegt. Denkbar wäre außerdem die Steuerung der Maschine anhand weiterer Interaktionsmöglichkeiten, wie zum Beispiel das Unterbrechen des derzeitigen Drucks innerhalb der Webanwendung."
        }
    }

    checkIOS () {
        let iosQuirkPresent = function () {
            let audio = new Audio();
    
            audio.volume = 0.5;
            return audio.volume === 1;   // volume cannot be changed from "1" on iOS 12 and below
        };
    
        let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        let isAppleDevice = navigator.userAgent.includes('Macintosh');
        let isTouchScreen = navigator.maxTouchPoints >= 1;   // true for iOS 13 (and hopefully beyond)
    
        return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
    };

    render() {
        let footer;
        if(!this.checkIOS()){
            footer = 
                <div className="footer ml-1">
                    <div className="fullscreen" onClick={() => window.unityInstance.setFullscreen(true)}>Vollbildmodus starten</div>
                </div>
        }

        var main = (
            <div className="container">
                <NoBannerLayout title={this.props.banner}/>
                <div className="alert alert-info" role="alert">
                <p>Digitaler Zwilling</p>
                {this.getCommonHintText()}
                </div>
                {this.renderInteractiveHint()}
                <div className="webgl-content">
                    <Unity unityContent={window.unityInstance} />
                    {footer}
                </div>
            </div>
        )

        return main
    }
}