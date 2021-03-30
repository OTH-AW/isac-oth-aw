import React from 'react';

export default class noBannerLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        var main = (
            <div className="container">
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