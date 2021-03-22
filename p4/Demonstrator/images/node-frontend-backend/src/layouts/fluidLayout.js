import React from 'react';
import Banner from 'isac_banner/isac_banner.js'

export default class FluidLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        var main = (
            <div className="container-fluid">
                <Banner />
                <div className="row">
                    <div className="col-12 mt-3 mb-5 text-center">
                        <h1 className="p-3 border border-isac-secondary secondary-isac-bottom-shadow">
                            {this.props.title}
                        </h1>
                    </div>
                </div>

                <div id="content" className="row">
                    {this.props.children}
                </div>
            </div>
        )

        return main;
    }
}