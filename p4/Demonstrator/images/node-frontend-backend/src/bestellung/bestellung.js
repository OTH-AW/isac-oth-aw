import React from 'react';
import Banner from '../isac_banner/isac_banner.js'
import { withRouter } from 'react-router-dom';

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

class Bestellung extends React.Component {
    constructor(props) {
        super(props);

        this.preview = null;

        this.state = {
            firstName: 'vorname',
            lastName: 'name',
            email: 'vorname@name',
            address: 'here',
            address2: '14',
            plz: '123',
            ort: 'there',
            color: null,
            shape: null
        }

        this.updateColor = this.updateColor.bind(this);
        this.updateShape = this.updateShape.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.form = React.createRef();

        this.backendURL = window.backendURL;
    }

    handleChange = (e) => { 
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit(event) {
        console.log(`Color: ${this.state.color} - Shape: ${this.state.shape}`);
        console.log(`firstName: ${this.state.firstName} - lastName: ${this.state.lastName}`);
        fetch(`${this.backendURL}/workpiece/create-order?color=${encodeURIComponent(this.state.color)}&shape=${encodeURIComponent(this.state.shape)}&firstName=${encodeURIComponent(this.state.firstName)}&lastName=${encodeURIComponent(this.state.lastName)}&email=${encodeURIComponent(this.state.email)}&address=${encodeURIComponent(this.state.address)}&address2=${encodeURIComponent(this.state.address2)}&plz=${encodeURIComponent(this.state.plz)}&ort=${encodeURIComponent(this.state.ort)}`)

        .then(res => {
            if (!res.ok) {
                document.getElementById('submitbutton').disabled = false;
                document.getElementById('submitbutton').textContent = "Bestellung abschicken"
                return
            }

            return res.json()
        })
        .then((data) => {
            console.log(data)
            console.log(data._id)
            this.props.history.push('/bestellung/' + data._id);
        })
        .catch((e) => {
            console.log(e);
            document.getElementById('submitbutton').disabled = false;
            document.getElementById('submitbutton').textContent = "Bestellung abschicken"
        })

        document.getElementById('submitbutton').disabled = true;
        document.getElementById('submitbutton').textContent = "Bestellung wird übertragen ..."
        event.preventDefault();
    }

    updateColor(e) {
        console.log(e.target.value)
        this.setState({
            color: e.target.value,
            shape: this.state.shape
        })
    }

    updateShape(e) {
        console.log(e.target.id)
        switch(e.target.id) {
            case 'triangle':
                this.setState({
                    shape: e.target.id
                })
                break;
            case 'square':
                this.setState({
                    shape: e.target.id
                })
                break;
            case 'circle':
                this.setState({
                    shape: e.target.id
                })
                break;
            default:
                console.log('FEHLER: Form')
        }
    }

    render() {
        switch(this.state.shape) {
            case 'triangle': 
                this.preview = <img className="img-fluid shapePreview" src={triangles[this.state.color]} alt="Dreieck" />
                break;
            case 'square':                
                this.preview = <img className="img-fluid shapePreview" src={squares[this.state.color]} alt="Quadrat"/>
                break;
            case 'circle':
                this.preview = <img className="img-fluid shapePreview" src={circles[this.state.color]} alt="Kreis"/>
                break;
            default:
                console.log('FEHLER: Shape ändern');
        }

        //no preview image as long as no color got picked
        if (this.state.color === null || this.state.color === 'blank'){
            this.preview = "";
        }

        var main = (
            <div className="container">
                <Banner />
                <div className="row">
                    <div className="col-12 mt-3 mb-5 text-center">
                        <h1 className="p-3 border border-isac-secondary secondary-isac-bottom-shadow">
                            Bestellung aufgeben
                        </h1>
                    </div>
                </div>

                <div className="row mx-1">
                    <div className="col-md-8 order-md-1">
                        <h4 className="mb-3">Rechnungsadresse</h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="firstName">Vorname</label>
                                <input type="text" className="form-control" id="firstName" required value={this.state.firstName} onChange={this.handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="lastName">Name</label>
                                <input type="text" className="form-control" id="lastName" required value={this.state.lastName} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Email <span className="text-muted">(Optional)</span></label>
                            <input type="email" className="form-control" id="email" placeholder="you@example.com" value={this.state.email} onChange={this.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address">Addresse</label>
                            <input type="text" className="form-control" id="address" required value={this.state.address} onChange={this.handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address2">Addresse 2 <span className="text-muted">(Optional)</span></label>
                            <input type="text" className="form-control" id="address2" value={this.state.address2} onChange={this.handleChange} />
                        </div>
                        <div className="row">

                            <div className="col-md-3 mb-3">
                                <label htmlFor="plz">PLZ</label>
                                <input type="text" className="form-control" id="plz" required value={this.state.plz} onChange={this.handleChange} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="ort">Ort</label>
                                <input type="text" className="form-control" id="ort" required value={this.state.ort} onChange={this.handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <h4 className="col-md-8">Bestellung</h4>
                            <div className="col-md-5 mb-3">

                                <label htmlFor="shape">Form</label>
                                <div className="d-block">
                                    <div className="custom-control custom-radio">
                                        <input id="triangle" name="choosenShape" type="radio" className="custom-control-input" onChange={this.updateShape} required />
                                        <label className="custom-control-label" htmlFor="triangle">Dreieck</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input id="square" name="choosenShape" type="radio" className="custom-control-input" onChange={this.updateShape} required />
                                        <label className="custom-control-label" htmlFor="square">Quadrat</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input id="circle" name="choosenShape" type="radio" className="custom-control-input" onChange={this.updateShape} required />
                                        <label className="custom-control-label" htmlFor="circle">Kreis</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 mb-3">
                                <label htmlFor="color">Farbe</label>
                                <select className="custom-select d-block w-100" id="color" name="color" onChange={this.updateColor}>
                                    <option value="blank">Farbe festlegen</option>
                                    <option value="orange">Orange</option>
                                    <option value="blue">Blau</option>
                                </select>
                            </div>
                        </div>
                        <hr className="mb-4" />
                        <form ref={this.form} className="btn-block" onSubmit={this.handleSubmit}>
                            <button id="submitbutton" className="btn btn-isac-primary btn-lg btn-block" type="submit">
                                Bestellung abschicken
                            </button>
                        </form>

                    </div>
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3"> <span className="text-muted">Vorschau</span> </h4>
                        {this.preview}
                    </div>
                </div>
            </div>
        )
        return main;
    }
}
export default withRouter(Bestellung) 