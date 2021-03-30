import React from 'react';
import FA from 'react-fontawesome';
import {NoBannerLayout} from 'layouts'
import storageVideo from '../cams/videos/lager.mp4';

//const storageCamURL = "http://192.168.2.46:8000/stream.mjpg";

export default class Cam extends React.Component {
    constructor(props) {
        super(props);

        this.backendURL = window.backendURL;

        this.vid = React.createRef();
        
        this.playVideo = this.playVideo.bind(this);

        this.state = {
            items:[],
            triangleCount: 0, 
            circleCount: 0,
            squareCount: 0,
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
            let [storage] = await Promise.all([
                fetch(this.backendURL + "/workpiece/storage").then(response => response.json())
            ]);

            if (this._isMounted) {
                this.setState({
                    triangleCount: this.getShapeCount(storage, "Dreieck"),
                    circleCount: this.getShapeCount(storage, "Kreis"),
                    squareCount: this.getShapeCount(storage, "Viereck"),
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
        this.vid.current.play();
    }

    render() {

        var main = (
            <NoBannerLayout title="Videostream Lager">
                    <div className="col-12 mb-1">
                        <div className="alert alert-danger text-center" role="alert">
                            Da es sich um einen Demonstrator handelt, gibt es keine Live-Übertragungen sonder nur Videos.<br/>
                            Bitte klicken Sie auf das Video wenn es nicht automatisch abgespielt wird.
                        </div>
                    </div>

                <div className="row mx-1">
                    <div className="col-12 mb-5">
                    <div className="containerCam">
                            <div className="tag">
                                <div>
                                    <a href="/admin/print/cam" className="btn btn-light">
                                        <FA name="save" className="px-1" size="3x"/>
                                        <FA name="video-camera" className="px-1" size="2x"/>
                                    </a>
                                </div>
                                <div>
                                    Lager • Webcam | Dreiecke {this.state.triangleCount !== 0 ? this.state.triangleCount : 30.0} • Quadrate {this.state.squareCount !== 0 ? this.state.squareCount : 25.0} • Kreise {this.state.circleCount !== 0 ? this.state.circleCount : 14.0}
                                </div>
                            </div>
                            {/* <video width="100%" loop autoPlay muted>
                                <source src={storageCamURL} type="video/mp4"/>
                            </video>  */}
                            <video ref={this.vid} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={storageVideo} type="video/mp4"/>
                            </video> 
                        </div> 
                        </div>
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}