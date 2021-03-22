import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class OverallMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {

        var main = (
            <Tile className="bg-primary col-xs-6 col-sm-8 col-md-6"
                    title="Gesamtkarte" 
                    description="Verfolgen Sie den Ablauf der Werkstücke">
                <a href="/admin/map" className="btn btn-primary">
                    <FA name="map" size="3x"/>
                </a>
            </Tile>
        )

        return main;
    }
}