import React, { Component } from 'react';
import Breadcrumb from './Breadcrumb';
import HouseOverview from './HouseOverview';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb/>
                    <HouseOverview/>
                </div>
            </div>
        );
    }
}

export default Content;