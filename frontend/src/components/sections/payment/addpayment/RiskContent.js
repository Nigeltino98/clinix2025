import React from 'react';
import Addform from './AddformRisk';
import BreadcrumbRisk from './BreadcrumbRisk';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <BreadcrumbRisk />
                </div>
                <Addform />
            </div>
        </div>
    );
}

export default Content;