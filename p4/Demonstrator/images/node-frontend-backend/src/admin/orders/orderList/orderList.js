import React from 'react';
import OrderItem from './orderItem/orderItem.js';



export default class orderList extends React.Component {

    render() {
        var main = (
            <ul className="list-group">
                <li className="list-group-item d-flex align-items-center mb-2">
                    <div className="container">
                        <div className="row">
                            <div className="col-2 col-md-1 col-lg-1 my-auto">
                                <span className="font-weight-bold">Form</span>
                            </div>
                            <div className="col-5 col-md-3 col-lg-3 my-auto">
                                <span className="font-weight-bold">Status</span>
                            </div>
                            <div className="col-3 col-md-4 col-lg-3 my-auto d-none d-md-block">
                                <span className="font-weight-bold">Kunde</span>
                            </div>

                            <div className="col-3 col-lg-3 my-auto d-none d-lg-block">
                                <span className="ml-5 float-left font-weight-bold">Standort</span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 my-auto">
                            <span className="font-weight-bold">Karte</span>
                            </div>
                            <div className="col-3 col-md-2 col-lg-1 my-auto">
                                <span className="float-right font-weight-bold">Details</span>
                            </div>
                        </div>
                    </div>
                </li>
                {this.props.items.map(item => (
                    <OrderItem key={item.order.number} item={item} />
                ))}
            </ul>
        )

        return (main)
    }
} 