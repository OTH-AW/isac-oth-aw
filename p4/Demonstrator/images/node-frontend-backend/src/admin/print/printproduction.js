import React from 'react'
import {NoBannerLayout} from 'layouts' 

const triangles = {
    orange:   "img/shapes/triangle/orange-triangle.png", 
    blue:   "img/shapes/triangle/blue-triangle.png"
};
const circles = {
    orange:   "img/shapes/circle/orange-circle.png", 
    blue:   "img/shapes/circle/blue-circle.png"
};
const squares = {
    orange:   "img/shapes/square/orange-square.png", 
    blue:   "img/shapes/square/blue-square.png"
};

export default class Print extends React.Component {
    constructor(props) {
        super(props);

        this.preview = null;
        
        this.state = {
            color: undefined,
            shape: undefined
        }

        this.updateColor = this.updateColor.bind(this);
        this.updateShape = this.updateShape.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.form = React.createRef();

        this.backendURL = window.backendURL;
    }

    updateColor(e) {
        this.setState({color: e.target.value});
    }

    updateShape(e) {
        this.setState({shape: e.target.value});
    }

    handleSubmit(event) {
        console.log(`Color: ${this.state.color} - Shape: ${this.state.shape}`);

        let resStatus = 0
        fetch(`${this.backendURL}/workpiece/create-manual?color=${encodeURIComponent(this.state.color)}&shape=${encodeURIComponent(this.state.shape)}`)
        .then(res => {
            if (!res.ok) {
                document.getElementById('submitbutton').disabled = false;
                document.getElementById('submitbutton').textContent = "Druckauftrag erstellen/senden"
            }

            resStatus = res.status
            return res.json()
        })
        .then((data) => {
            if(resStatus === 400) {
                // Invalid request, stop here
                return
            }

            console.log(data)

            // Redirect to workpiece page
            window.location.href = `/admin/workpieces/${data}`
        })
        .catch(function(e) {
            console.log(e);
            document.getElementById('submitbutton').disabled = false;
            document.getElementById('submitbutton').textContent = "Druckauftrag erstellen/senden"
        })

        document.getElementById('submitbutton').disabled = true;
        document.getElementById('submitbutton').textContent = "Druckauftrag wird gesendet ..."
        event.preventDefault();
    }

    renderPreview() {
        switch(this.state.shape) {
            case 'triangle': 
                this.preview = <img className="img-fluid shapePreview" src={triangles[this.state.color]} alt="triangle"/>
                break;
            case 'square':                
                this.preview = <img className="img-fluid shapePreview" src={squares[this.state.color]} alt="square"/>
                break;
            case 'circle':
                this.preview = <img className="img-fluid shapePreview" src={circles[this.state.color]} alt="circle"/>
                break;
            default:
                console.log('FEHLER: Shape ändern');
        }
    }

    render() {
        this.renderPreview();

        //no preview image as long as no color got picked
        if (typeof this.state.color === 'undefined' || this.state.color === 'blank'){
            this.preview = "";
        }

        var main = (
            <NoBannerLayout title="Produktion anstoßen">  
                <div className="col-md-8 mx-1">
                    <div className="row">
                        <h4 className="col-md-12 d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Übersicht</span>
                        </h4>
                    </div>

                    <div className="row">
                        <div className="col-md-5 mb-3">
                            <label htmlFor="shape">Form</label>
                            <div className="d-block">
                                <div className="custom-control custom-radio">
                                    <input id="triangle" name="choosenShape" type="radio" className="custom-control-input" value="triangle" checked={this.state.shape==="triangle"} onChange={this.updateShape} required />
                                    <label className="custom-control-label" htmlFor="triangle">Dreieck</label>
                                </div>
                                <div className="custom-control custom-radio">
                                    <input id="square" name="choosenShape" type="radio" className="custom-control-input" value="square" checked={this.state.shape==="square"} onChange={this.updateShape} required />
                                    <label className="custom-control-label" htmlFor="square">Quadrat</label>
                                </div>
                                <div className="custom-control custom-radio">
                                    <input id="circle" name="choosenShape" type="radio" className="custom-control-input" value="circle" checked={this.state.shape==="circle"} onChange={this.updateShape} required />
                                    <label className="custom-control-label" htmlFor="circle">Kreis</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 mb-3">
                            <label htmlFor="color">Farbe</label>
                            <select className="custom-select d-block w-100" id="color" name="color" value={this.state.color} onChange={this.updateColor}>
                                <option value="blank">Farbe festlegen</option>
                                <option value="orange">Orange</option>
                                <option value="blue">Blau</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <form ref={this.form} className="btn-block" onSubmit={this.handleSubmit}>
                            <button id="submitbutton" className="btn btn-isac-primary btn-lg btn-block" type="submit">
                                Druckauftrag erstellen/senden
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-4 mx-1">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Vorschau</span>
                    </h4>
                    {this.preview}
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}