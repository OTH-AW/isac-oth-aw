import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'
import WebGL3D from './webGL3D.js';
import Cam from './cam.js';

export default class Print extends React.Component {
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
            <Tile className="bg-success col-xs-12 col-sm-4 col-md-6"
                    title="Druck • Übersicht" 
                    description="Vorgänge und aktuelle Situation beim Druck">
                <a href="/admin/print" className="btn btn-success">
                    <FA name="print" className="px-1" size="3x"/>
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