import React from 'react';
import FA from 'react-fontawesome';
import {NoBannerLayout} from 'layouts'
import qaVideo from '../cams/videos/pruefstation.mp4';

//const qualityControlCamURL = "http://192.168.2.66:8000/stream.mjpg";

export default class Cam extends React.Component {
    constructor(props) {
        super(props);

        this.backendURL = window.backendURL;
        
        this.vid = React.createRef();

        this.playVideo = this.playVideo.bind(this);

        this.state = {
            QCactive: false
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
            let [qc] = await Promise.all([
                fetch(this.backendURL + "/qc").then(response => response.json())
            ]);
            
            let isQCActive = false;
            if(Object.keys(qc).length !== 0) {
                isQCActive = true;
            }
            if (this._isMounted) {
                this.setState({
                    QCactive: isQCActive
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
            <NoBannerLayout title="Videostream der Prüfstation">
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
                            <video ref={this.vid} onClick={this.playVideo} width="100%" loop autoPlay muted playsInline>
                                <source src={qaVideo} type="video/mp4"/>
                            </video> 
                        </div> 
                    </div>
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}