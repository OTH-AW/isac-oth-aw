import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class PickUpCam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {
        var main = (
            <Tile className="text-light bg-dark col-xs-6 col-sm-8 col-md-6"
                    title="Webcam Abholstation" 
                    description="Ein Blick direkt zur Abholstation">
                <a href="/admin/pick-up/cam" className="btn btn-dark">
                    <FA name="dot-circle-o" className="px-1" size="3x"/>
                    <FA name="cubes" className="px-1" size="2x"/>
                </a>
            </Tile>
        )

        return main;
    }
}