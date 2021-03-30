import React from 'react';

export default class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        console.log(this.props.wst);

        var main;

        if(this.props.wst.length > 0) {
            main = (
                <div>
                    <div className="row mt-3">
                        <h3>
                            Details
                        </h3>
                    </div>
                    <div className="row">
                        {
                            this.props.wst ? this.props.wst.map((wst) => {
                                let order = "Keine Bestellung";
                                let detailLink =  "/admin/workpieces/" + wst._id;
                                if(wst.order) {
                                    order = "Bestellung: " + wst.order.customer.firstname + ', ' + wst.order.customer.name;
                                }
                                return (
                                    <div className="col-12 mb-2">
                                        <div className="row">
                                            <a href={detailLink}>ID: {wst.workpieceId}</a>
                                        </div>
                                        <div className="row">
                                            {order}
                                        </div>
                                    </div>
                                )
                            }) : null
                        }
                    </div>
                </div>
            )
        } else {
            main = null;
        }
        
        return main;
    }
}