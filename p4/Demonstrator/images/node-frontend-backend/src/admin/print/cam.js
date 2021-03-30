import React from 'react';
import FA from 'react-fontawesome';
import {NoBannerLayout} from 'layouts'
import printVideo from '../cams/videos/print.mp4';

//const printCamURL = "http://192.168.2.44:8000/stream.mjpg";

export default class Cam extends React.Component {
    constructor(props) {
        super(props);

        this.backendURL = window.backendURL;

        this.vid = React.createRef();
        
        this.playVideo = this.playVideo.bind(this);

        this.state = {
            printing: false
        }

    }

    componentDidMount() {
        fetch(this.backendURL + "/print/printers")
        .then(res => res.json())
        .then((data) => {
            data.forEach((item) => {
                if(item.state.printing === true) {
                    this.setState({
                        printing: true
                    });
                }
            });
        })
        .catch(console.log("error"));
    }

    playVideo() {
        this.vid.current.play();
    }

    render() {

        var main = (
            <NoBannerLayout title="Videostream der Druckstation">
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
                                        <FA name="print" className="px-1" size="3x"/>
                                        <FA name="video-camera" className="px-1" size="2x"/>
                                    </a>
                                </div>
                                <div>
                                    Druck • Webcam | {this.state.printing === true ? "Es wird gedruck" : "Es ist kein Drucker aktiv"}
                                </div>
                            </div>
                        {/* <video width="100%" loop autoPlay muted>
                            <source src={printCamURL}/>
                        </video>  */}
                        <video ref={this.vid} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                            <source src={printVideo} type="video/mp4"/>
                        </video>
                        </div>
                    </div>
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}