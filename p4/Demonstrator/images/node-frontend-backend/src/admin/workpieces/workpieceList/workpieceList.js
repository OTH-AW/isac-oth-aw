import React from 'react';
import WorkpieceItem from './workpieceItem/workpieceItem.js';



export default class workpieceList extends React.Component {

  render() {
    var main = (
        <ul className="list-group">
            <li className="list-group-item d-flex align-items-center mb-2">
                <div className="container">
                    <div className="row">
                        <div className="col-2 col-sm-1 my-auto">
                            <span className="font-weight-bold">Form</span>
                        </div>
                        <div className="col-5 col-sm-4 col-md-3 col-lg-2 my-auto">
                            <span className="font-weight-bold">Status</span>
                        </div>
                        <div className="col-sm-2 col-md-1 my-auto d-none d-sm-block">
                            <span className="font-weight-bold">Bestellung</span>
                        </div>
                        <div className="col-md-3 my-auto d-none d-md-block">
                            <span className="font-weight-bold">Werkstück ID</span>
                        </div>
                        <div className="col-2 my-auto d-none d-lg-block">
                            <span className="font-weight-bold">Produktionszeit</span>
                        </div>
                        <div className="col-sm-1 my-auto d-none d-sm-block">
                            <span className="font-weight-bold">Karte</span>
                        </div>
                        <div className="col-3 col-sm-3 col-md-2 col-lg-1 my-auto">
                            <span className="font-weight-bold">NFC Daten</span>
                        </div>
                        <div className="col-2 col-sm-1 my-auto">
                            <span className="float-right font-weight-bold">Details</span>
                        </div>
                    </div>
                </div>
            </li>
            {this.props.items.map(item => (
                <WorkpieceItem key={item.workpieceId} item={item}/>
            ))}
        </ul>
    )
        
    return(main)
  }
} 