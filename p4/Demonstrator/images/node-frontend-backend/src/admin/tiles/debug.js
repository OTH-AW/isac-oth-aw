import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class Debug extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {
        var main = (
            <Tile className="bg-secondary col-xs-6 col-sm-4 col-md-3"
                    title="Steuerung der Stationen" 
                    description="Simuliert die Erfassung von Werkstücken an Raspberry Pis">
                <a href="/admin/debug" className="btn bg-secondary">
                    <FA name="desktop" size="3x"/>
                </a>
            </Tile>
        )

        return main;
    }
}