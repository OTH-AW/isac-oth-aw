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
            <Tile className="bg-white col-xs-6 col-sm-4 col-md-3"
                    title="Lager • Webcam" 
                    description="Direkter Einblick in das Labor von TP2">
                <a href="/admin/storage/cam" className="btn btn-white">
                    <FA name="save" className="px-1" size="3x"/>
                    <FA name="video-camera" className="px-1" size="2x"/>
                </a>
            </Tile>
        )

        return main;
    }
}