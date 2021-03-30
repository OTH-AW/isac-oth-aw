import React from 'react'
import {DefaultLayout} from 'layouts'
import StatusTimeline from './statusTimeline/statusTimeline.js';
import StatusQR from './statusQR/statusQR.js';

export default class StatusWithID extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items:{"empty":""}
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
            let [workpiece] = await Promise.all([
                fetch(`${this.backendURL}/workpiece/${id}`).then(response => response.json())
            ]);
            if (this._isMounted) {
                this.setState({
                    items: workpiece
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
            main = (
                <DefaultLayout title={"Status - " + this.state.items.workpieceId}>
                    <div className="col-12 mt-3 mb-5 text-center">
                        <StatusQR id={this.state.items._id}/>
                        <StatusTimeline items={this.state.items}/>
                    </div>
                </DefaultLayout>
            )
        } else if (!this.state.items.hasOwnProperty('empty')) {
            main = (
                <DefaultLayout title={"Werkstück nicht gefunden"}>
                    <div className="col-md-12">
                            <div className="row d-flex align-self-center justify-content-center">
                                <div className="alert alert-danger" role="alert">
                                    Es wurde kein Werkstück mit diesem Namen gefunden!
                                </div>
                            </div>
                    </div>
                </DefaultLayout>
            ) 
        }
        return main;
    }
}