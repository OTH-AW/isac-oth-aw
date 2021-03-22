import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'
import WebGL3D from './webGL3D.js';
import Cam from './cam.js';

export default class Storage extends React.Component {
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
            <Tile className="bg-white col-xs-12 col-sm-4 col-md-6"
                    title="Lager • Übersicht" 
                    description="Status zum aktuellen Lagerstand">
                <a href="/admin/storage" className="btn btn-white">
                    <FA name="save" className="px-1" size="3x"/>
                    <FA name="list-alt" className="px-1" size="2x"/>
                </a>
            </Tile>
        )
        switch (showView) {
            case "overview":
                return main;
            case "3d":
                return  <WebGL3D />;
            case "cam":
                return  <Cam />;
            
                default: 
                console.log("FEHELER: Keine View Prop gesetzt. showView = " + showView);
                break;
        }
    }
}