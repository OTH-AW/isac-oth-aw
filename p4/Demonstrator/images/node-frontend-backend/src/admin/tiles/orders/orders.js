import React from 'react';
import FA from 'react-fontawesome';
import Details from './details.js';
import Tile from 'components/tiles/tile.js'

export default class OrdersTile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    static defaultProps = {
        showView: "overview"
    }

    render() {
        const showView = this.props.showView; 

        var main = (
            <Tile className="bg-warning col-xs-6 col-sm-8 col-md-6"
                    title="Bestellungen" 
                    description="Übersicht der Aufgegebenen Bestellungen">
                <a href="/admin/orders" className="btn btn-warning">
                    <FA name="shopping-cart" size="3x"/>
                </a>
            </Tile>
        )

        switch (showView) {
            case "overview":
                return main;
            case "details":
                return  <Details />;
            
            default: 
                console.log("FEHELER: Keine View Prop gesetzt. showView = " + showView);
                break;
        }
    }
}