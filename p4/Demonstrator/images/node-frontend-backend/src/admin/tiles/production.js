import React from 'react';
import FA from 'react-fontawesome';
import Tile from 'components/tiles/tile.js'

export default class Production extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        var main = (
            <Tile className="bg-success col-xs-6 col-sm-4 col-md-3"
                    title="Produktion anstoßen" 
                    description="Neue Werkstücke in Auftrag geben">
                <a href="/admin/print/production" className="btn btn-success">
                    <FA name="plus-circle" className="px-1" size="3x"/>
                    <FA name="print" className="px-1" size="3x"/>
                </a>
            </Tile>
        )

        return main;
    }
}