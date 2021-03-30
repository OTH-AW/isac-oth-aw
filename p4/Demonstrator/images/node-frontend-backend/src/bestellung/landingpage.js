import React from 'react';
import {DefaultLayout} from 'layouts'
import StatusTimeline from 'status/statusTimeline/statusTimeline.js';
import StatusQR from 'status/statusQR/statusQR.js';

export default class Landingpage extends React.Component {
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

        if (Object.keys(this.state.items).length !== 0){
            main = (
                <DefaultLayout title="Status">
                    <div className="col-12 mt-3 mb-5 text-center">
                        <StatusQR id={this.state.items._id}/>
                        <StatusTimeline items={this.state.items}/>
                    </div>
                </DefaultLayout>
            )
        }
        return main;
    }
}