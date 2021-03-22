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
            <Tile className="bg-white col-xs-6 col-sm-4 col-md-3"
                    title="Lager • 3D-Ansicht" 
                    description="Modell der Lager-Anlage als WebGL-Plugin">
                <a href="/webgl_unity_tp2" className="btn btn-white">
                    <FA name="save" className="px-1" size="3x"/>
                    <FA name="cubes" className="px-1" size="2x"/>
                </a>
            </Tile>
        )

        return main;
    }
}