import React, { Component } from 'react';
import BreadcrumbRisk from './BreadcrumbRisk';
import List from './RiskList';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <BreadcrumbRisk />
                        <List />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;