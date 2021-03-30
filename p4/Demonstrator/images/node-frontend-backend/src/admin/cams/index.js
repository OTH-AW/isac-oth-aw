import React from 'react'
import FA from 'react-fontawesome';

//Webcam Videos
import printVideo from './videos/print.mp4'
import storageVideo from './videos/lager.mp4';
import qaVideo from './videos/pruefstation.mp4';
import pickupVideo from './videos/abholstation.mp4';

// Webcam URLs
// const printCamURL = "http://192.168.2.44:8000/stream.mjpg";
// const storageCamURL = "http://192.168.2.46:8000/stream.mjpg";
// const qualityControlCamURL = "http://192.168.2.66:8000/stream.mjpg";
// const pickUpCamURL = "http://192.168.2.45:8000/stream.mjpg";

export default class CamOverview extends React.Component {
    constructor(props) {
        super(props);

        this.backendURL = window.backendURL;

        this.vidOne = React.createRef();
        this.vidTwo = React.createRef();
        this.vidThree = React.createRef();
        this.vidFour = React.createRef();

        this.playVideo = this.playVideo.bind(this);

        this.state = {
            items:[],
            triangleCount: 0, 
            circleCount: 0,
            squareCount: 0,
            printing: false,
            QCactive: false,
            pickUpStation: false
        }

        this.interval = null;
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
        this.interval = setInterval(() => this.getData() , 5000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.interval);
    }

    async getData() {
        try {
            let [storage, printers, qc, workpieces] = await Promise.all([
                fetch(this.backendURL + "/workpiece/storage").then(response => response.json()),
                fetch(this.backendURL + "/print/printers").then(response => response.json()),
                fetch(this.backendURL + "/qc").then(response => response.json()),
                fetch(this.backendURL + "/workpiece").then(response => response.json())
            ]);

            let isPrinting = false;
            printers.forEach((item) => {
                if(item.state.printing === true) {
                    isPrinting = true;
                }
            });

            let isQCActive = false;
            if(Object.keys(qc).length !== 0) {
                isQCActive = true;
            }

            let isPickupReady = false;
            workpieces.forEach((item) => {
                if(item.state.place.id === 4) {
                    isPickupReady = true;
                }
            })
            if (this._isMounted) {
                this.setState({
                    triangleCount: this.getShapeCount(storage, "Dreieck"),
                    circleCount: this.getShapeCount(storage, "Kreis"),
                    squareCount: this.getShapeCount(storage, "Viereck"),
                    pickUpStation: isPickupReady,
                    printing: isPrinting,
                    QCactive: isQCActive
                });
            }

        }
        catch(err) {
            console.warn(err);
        };
    }

    getShapeCount(items, shapeToCount) {
        let currentShapeCount = 0;
        items.forEach(function(item) {
            if(item.shape.toValue === shapeToCount) {
                currentShapeCount++;
            }
        });
        return currentShapeCount;
    }

    playVideo() {
        this.vidOne.current.play();
        this.vidTwo.current.play();
        this.vidThree.current.play();
        this.vidFour.current.play();
    }

    render() {
        var main = (
            <>
                <div className="row mx-1 mt-1">
                    <div className="col-12 mb-1">
                        <div className="alert alert-danger text-center" role="alert">
                            Da es sich um einen Demonstrator handelt, gibt es keine Live-Übertragungen sonder nur Videos.<br/>
                            Bitte klicken Sie auf eines der Videos wenn diese nicht automatisch abgespielt werden.
                        </div>
                    </div>
                </div>
                <div className="row mx-1">
                    <div className="col-md-12 col-lg-6 mb-1">
                        <div className="containerCam">
                            <div className="tag">
                                <div>
                                    <a href="/admin/print/cam" className="btn btn-light">
                                        <FA name="print" className="px-1" size="3x"/>
                                        <FA name="video-camera" className="px-1" size="2x"/>
                                    </a>
                                </div>
                                <div>
                                    Druck • Webcam | {this.state.printing === true ? "Es wird gedruck" : "Es ist kein Drucker aktiv"}
                                </div>
                            </div>
                            {/* <video width="100%" loop autoPlay muted>
                                <source src={printCamURL} type="video/mp4"/>
                            </video>  */}
                            <video ref={this.vidOne} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={printVideo} type="video/mp4"/>
                            </video> 
                        </div> 
                    </div>
                    <div className="col-md-12 col-lg-6 mb-1">
                        <div className="containerCam">
                            <div className="tag">
                                <div>
                                    <a href="/admin/print/cam" className="btn btn-light">
                                        <FA name="save" className="px-1" size="3x"/>
                                        <FA name="video-camera" className="px-1" size="2x"/>
                                    </a>
                                </div>
                                <div>
                                    Lager • Webcam | Dreiecke {this.state.triangleCount !== 0 ? this.state.triangleCount : 31.0} • Quadrate {this.state.squareCount !== 0 ? this.state.squareCount : 25.0} • Kreise {this.state.circleCount !== 0 ? this.state.circleCount : 14.0}
                                </div>
                            </div>
                            {/* <video width="100%" loop autoPlay muted>
                                <source src={storageCamURL} type="video/mp4"/>
                            </video>  */}
                            <video ref={this.vidTwo} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={storageVideo} type="video/mp4"/>
                            </video> 
                        </div> 
                    </div>
                </div>
                <div className="row mx-1">
                    <div className="col-md-12 col-lg-6 mb-1">
                        <div className="containerCam">
                            <div className="tag">
                                <div>
                                    <a href="/admin/print/cam" className="btn btn-light">
                                        <FA name="check-square" className="px-1" size="3x"/>
                                        <FA name="video-camera" className="px-1" size="2x"/>
                                    </a>
                                </div>
                                <div>
                                    Prüfstation • Webcam | {this.state.QCactive === true ? "Es wird ein Werkstück überprüft" : "Es wird kein Werkstück überprüft"}
                                </div>
                            </div>
                            {/* <video width="100%" loop autoPlay muted>
                                <source src={qualityControlCamURL} type="video/mp4"/>
                            </video>  */}
                            <video ref={this.vidThree} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={qaVideo} type="video/mp4"/>
                            </video> 
                        </div> 
                    </div>
                    <div className="col-md-12 col-lg-6 mb-1">
                        <div className="containerCam">
                            <div className="tag">
                                <div>
                                    <a href="/admin/print/cam" className="btn btn-light">
                                        <FA name="dot-circle-o" className="px-1" size="3x"/>
                                        <FA name="video-camera" className="px-1" size="2x"/>
                                    </a>
                                </div>
                                <div>
                                    Abholstation • Webcam | {this.state.pickUpStation === true ? "Es sind Werkstücke zur Abholung bereit" : "Es sind keine Werkstücke zur Abholung bereit"}
                                </div>
                            </div>
                            {/* <video width="100%" loop autoPlay muted>
                                <source src={pickUpCamURL} type="video/mp4"/>
                            </video>  */}
                            <video ref={this.vidFour} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={pickupVideo} type="video/mp4"/>
                            </video> 
                        </div> 
                    </div>
                </div>
            </>
        )

        return main;
    }
}