import React from 'react';


export default class SelectedDetail extends React.Component {

    render() {
        let product = this.props.product;
        console.log(product);
        let order = (
            <div className="mt-1">
                <div className="row">
                    <h5>Keine Bestellung vorhanden</h5>
                </div>
            </div>
        );
        if(product.order) {
            order = (
                <div className="mt-1">
                    <div className="row">
                        <h5>Bestellung</h5>
                    </div>
                    <div className="row">
                        { product.order.customer.firstname + " " + product.order.customer.name }
                    </div>
                    <div className="row">
                        { product.order.customer.address }
                    </div>
                    <div className="row">
                        { product.order.customer.email }
                    </div>
                    <div className="row">
                        { product.order.number }
                    </div>
                </div>
            )
        }
        var main = (
            <div>
                <div className="row">
                    <h3>{ product.workpieceId }</h3>
                </div>
                <div className="row">
                    <h5> Informationen zum Werkstück </h5>
                </div>
                <div className="row">
                    Farbe: { product.color.toValue }
                </div>
                <div className="row">
                    Form: { product.shape.toValue }
                </div>
                <div className="row">
                    Werkstück ID: { product.workpieceId }
                </div>
                <div className="row">
                    Ort: { product.state.place.faculty + ", " + product.state.place.floor + ", " + product.state.place.room }
                </div>
                <div className="row">
                    Info: { product.state.message }
                </div>

                {order}

                <div className="row mt-2">
                    <a href={"/admin/workpieces/" + product._id}  >
                        <i className="fa fa-search mr-1" aria-hidden="true"></i> 
                        Zur Wersktückdetailseite 
                    </a>
                </div>
            </div>
        )
        return main;
    }
}