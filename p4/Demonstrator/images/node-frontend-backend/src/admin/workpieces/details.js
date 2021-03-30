import React from 'react'
import {NoBannerLayout} from 'layouts'
import StatusTimeline from 'status/statusTimeline/statusTimeline.js';

export default class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items:{}
        }

        this.backendURL = window.backendURL;
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
        const { id } = this.props.match.params
        try {
            let [workpieces] = await Promise.all([
                fetch(`${this.backendURL}/workpiece/${id}`).then(response => response.json())
            ]);
            
            if (this._isMounted) {
                this.setState({
                    items: workpieces
                });
            }

        }
        catch(err) {
            console.warn(err);
        };
    }

    render() {
        var main = ""

        if (this.state.items.hasOwnProperty('_id')){
            var place = ""
            if (this.state.items.state.place.faculty === null && this.state.items.state.place.floor === null && this.state.items.state.place.room === null){
                place = "Wird transportiert"
            }else{
                place = this.state.items.state.place.faculty + ", " + this.state.items.state.place.floor + ", " + this.state.items.state.place.room
            }
    
            var workpieceTable = (
                <div>
                <p className="mb-2 font-weight-bold">Informationen zum Werkstück</p>
                    <table className="table text-left">
                        <thead>
                            <tr>
                                <th scope="col">Feld</th>
                                <th scope="col">Wert</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Werkstück ID</td>
                                <td>{this.state.items.workpieceId}</td>
                            </tr>
                            <tr>
                                <td>Ort</td>
                                <td>{place}</td>
                            </tr>
                            <tr>
                                <td>Nachricht</td>
                                <td>{this.state.items.state.message}</td>
                            </tr>
                            <tr className="invisible">
                                <td>Damit beide Reihen</td>
                                <td>immer übereinstimmten test test tes tes tes tes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
            
            var orderTable = ""
            
            if(this.state.items.hasOwnProperty('order')){
                var kunde = this.state.items.order.customer.name + " " + this.state.items.order.customer.firstname
                var ort = this.state.items.order.customer.ort + ", " + this.state.items.order.customer.address
    
                orderTable = (
                    <div>
                        <p className="mb-2 font-weight-bold">Informationen zur Bestellung</p>
                        <div className="table-responsive">
                            <table className="table text-left">
                                <thead>
                                    <tr>
                                        <th scope="col">Feld</th>
                                        <th scope="col">Wert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Kunde</td>
                                        <td>{kunde}</td>
                                    </tr>
                                    <tr>
                                        <td>Ort</td>
                                        <td>{ort}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{this.state.items.order.customer.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Nummer</td>
                                        <td>{this.state.items.order.number}</td>
                                    </tr>
                                    <tr className="invisible">
                                        <td>Damit beide Reihen</td>
                                        <td>immer übereinstimmten test test tes tes tes tes</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )    
            }    
    
            main = (
                <NoBannerLayout title={"Details - " + this.state.items.workpieceId}>
                    <div className="col-12 mt-3 mb-5 text-center">
                        {workpieceTable}
                        {orderTable}
                        <StatusTimeline className="mt-5" items={this.state.items}/>
                    </div>
                </NoBannerLayout>
            )
    
        } else {
            main = (
                <NoBannerLayout title={"Werkstück nicht gefunden"}>
                    <div className="col-md-12">
                            <div className="row d-flex align-self-center justify-content-center">
                                <div className="alert alert-danger" role="alert">
                                    Es wurde kein Werkstück mit diesem Namen gefunden!
                                </div>
                            </div>
                    </div>
                </NoBannerLayout>
            )
        }
        
        return main;
    }
}