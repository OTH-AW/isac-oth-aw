import React from'react';

export default class Banner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }


    render() {
        var main = (
            <div className="row">
                <div className="col-12 mt-5">
                    <img className="img-fluid" src="img/isac-demonstrator-banner.jpg" alt="Das Bild zeigt eine menschliche Hand und eine computergenerierte Hand, die sich berühren. Dies ist eine grafische Veranschaulichung des Bereichs Mensch-Maschine Interaktion / Industrie 4.0." />
                </div>
            </div> 
        )

        return main;
    }
}