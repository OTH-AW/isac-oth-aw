import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class WebGL3D extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {

        var main = (
            <Tile className="bg-success col-xs-6 col-sm-4 col-md-3"
                    title="Druck • 3D-Ansicht" 
                    description="Modell der Drucker als WebGL-Plugin">
                <a href="/webgl_unity_tp1" className="btn btn-success">
                    <FA name="print" className="px-1" size="3x"/>
                    <FA name="cubes" className="px-1" size="2x"/>
                </a>
            </Tile>
        )

        return main;
    }
}