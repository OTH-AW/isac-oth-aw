import React from 'react';
import FA from 'react-fontawesome';
import {NoBannerLayout} from 'layouts'
import pickupVideo from '../cams/videos/abholstation.mp4';

//const pickUpCamURL = "http://192.168.2.45:8000/stream.mjpg";

export default class Cam extends React.Component {
    constructor(props) {
        super(props);

        this.backendURL = window.backendURL;

        this.vid = React.createRef();

        this.playVideo = this.playVideo.bind(this);

        this.state = {
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
            let [workpieces] = await Promise.all([
                fetch(this.backendURL + "/workpiece").then(response => response.json())
            ]);
            
            let isPickupReady = false;
            workpieces.forEach((item) => {
                if(item.state.place.id === 4) {
                    isPickupReady = true;
                }
            })

            if (this._isMounted) {
                this.setState({
                    pickUpStation: isPickupReady
                });
            }

        }
        catch(err) {
            console.warn(err);
        };
    }

    playVideo() {
        this.vid.current.play();
    }

    render() {

        var main = (
            <NoBannerLayout title="Videostream der Abholstation">
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
                            <video ref={this.vid} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={pickupVideo} type="video/mp4"/>
                            </video> 
                        </div>
                    </div>
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}