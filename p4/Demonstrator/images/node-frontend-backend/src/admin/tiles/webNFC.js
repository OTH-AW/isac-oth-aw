import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class WebNFC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {
        var main = (
            <Tile className="bg-info col-xs-6 col-sm-4 col-md-3"
                    title="WebNFC" 
                    description="Tags auslesen und beschreiben">
                <a href="/admin/webnfc" className="btn bg-info">
                    <FA name="tag" size="3x"/>
                </a>
            </Tile>
        )

        return main;
    }
}