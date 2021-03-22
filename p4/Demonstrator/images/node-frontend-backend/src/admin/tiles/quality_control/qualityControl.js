import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'
import WebGL3D from './webGL3D.js';
import Cam from './cam.js';

export default class QualityControl extends React.Component {
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
                    title="Prüfstation • Übersicht" 
                    description="Prüfablaufe in der Qualitätskontrolle">
                <a href="/admin/quality-control/overview" className="btn btn-warning">
                    <FA name="check-square" className="px-1" size="3x"/>
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