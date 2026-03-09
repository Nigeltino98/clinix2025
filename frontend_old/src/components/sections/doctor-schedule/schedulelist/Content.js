import React from 'react';
import Breadcrumb from './Breadcrumb';
import Schedulelist from './Schedulelist';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
            <div className="col-md-12">
                <Breadcrumb />
                <Schedulelist />
                </div>
            </div>
        </div>
    );
}

export default Content; 