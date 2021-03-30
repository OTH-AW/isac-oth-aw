import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'
import Details from './details.js';

export default class WorkpiecesTile extends React.Component {
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
            <Tile className="bg-info col-xs-6 col-sm-4 col-md-3"
                    title="Werkstücke" 
                    description="Alle vorhandenen Werkstücke">
                <a href="/admin/workpieces" className="btn btn-info">
                    <FA name="microchip" size="3x"/>
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