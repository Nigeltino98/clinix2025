import React, { Component } from 'react';
import Breadcrumb from './Breadcrumb';
import Rotalist from './RotaList';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <Breadcrumb />
                        <Rotalist/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;