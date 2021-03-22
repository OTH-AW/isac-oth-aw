import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class Cam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {

        var main = (
            <Tile className="bg-warning col-xs-6 col-sm-4 col-md-3"
                    title="Prüfstation • Webcam" 
                    description="Direkter Einblick in das Labor von TP3">
                <a href="/admin/quality-control/cam" className="btn btn-warning">
                    <FA name="check-square" className="px-1" size="3x"/>
                    <FA name="video-camera" className="px-1" size="2x"/>
                </a>
            </Tile>
        )

        return main;
    }
}