import React from 'react'
import {NoBannerLayout} from 'layouts'

// Tiles 
import Production from './tiles/production.js';
import OrdersTile from './tiles/orders/orders.js';
import WorkpiecesTile from './tiles/workpieces/workpieces.js';
import OverallMap from './tiles/overallMap.js';
import AllCams from './tiles/allCams.js';
import Print from './tiles/print/print.js';
import Storage from './tiles/storage/storage.js';
import QualityControl from './tiles/quality_control/qualityControl.js';
import PickUpCam from './tiles/pickUpCam.js';
import WebNFC from './tiles/webNFC.js'
import Debug from './tiles/debug.js'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }
    render() {

        var main = (
            <NoBannerLayout title="Admin-Dashboard">
                <Production />
                
                <OrdersTile />
                
                <WorkpiecesTile />
                
                <OverallMap />

                <AllCams />

                <Print />
                <Print showView={"3d"} />
                <Print showView={"cam"} />

                <Storage />
                <Storage showView={"3d"} />
                <Storage showView={"cam"} />

                <QualityControl />
                <QualityControl showView={"3d"} />
                <QualityControl showView={"cam"} />
                
                <PickUpCam />

                <WebNFC />

                <Debug />
            </NoBannerLayout>
        )

        return main;
    }
}