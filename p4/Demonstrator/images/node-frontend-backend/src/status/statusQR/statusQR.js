import React from 'react';
import QRCode from "react-qr-code";

export default class StatusQR extends React.Component {

  render() {

    var main = (
        <div className="text-center w-100 mb-3 align-content-center">
            <QRCode value={window.location.href} />
            <p className="font-weight-bold mt-2">ID: {this.props.id}</p>
            <p className="mt-3 mb-5">Scanne den QR-Code oder speicher die ID um weiterhin den Status des Werkstücks abzufragen.</p>
        </div>
    )      
    return(main)
  }
} 