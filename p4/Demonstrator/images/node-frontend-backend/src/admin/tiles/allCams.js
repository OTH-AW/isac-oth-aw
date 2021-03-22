import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class AllCams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {

        var main = (
            <Tile className="bg-secondary col-xs-6 col-sm-8 col-md-6"
                    title="Webcams Übersicht" 
                    description="Blick in alle Labore">
                <a href="/admin/cams" className="btn btn-secondary">
                    <FA name="video-camera" className="px-1" size="3x"/>
                    <FA name="video-camera" className="px-1" size="3x"/>
                    <FA name="video-camera" className="px-1" size="3x"/>
                    <FA name="video-camera" className="px-1" size="3x"/>
                </a>
            </Tile>
        )

        return main;
    }
}