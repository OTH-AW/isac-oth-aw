import React from 'react'
import {NoBannerLayout} from 'layouts'
import OrderList from './orderList/orderList.js'

export default class Orders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items:[]
        };

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
        try {
            let [orders] = await Promise.all([
                fetch(this.backendURL + "/workpiece/orders").then(response => response.json())
            ]);

            if (this._isMounted) {
                this.setState({
                    items: orders
                });
            }

        }
        catch(err) {
            console.warn(err);
        };
    }

    render() {
       var main = (
            <NoBannerLayout title="Bestellungen">
                <div className="col-md-12 order-md-1 mx-1">
                    <div className="row">
                        <div className="col-md-4">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Übersicht</span>
                            </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <OrderList items={this.state.items}/>
                        </div>
                    </div>
                </div>
            </NoBannerLayout>
        )
        return main;
    }
}