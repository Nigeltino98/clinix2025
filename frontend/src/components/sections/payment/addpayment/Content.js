import React from 'react';
import Addform from './Addform';
import Breadcrumb from './BreadcrumbPayment';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb />
                </div>
                <Addform />
            </div>
        </div>
    );
}

export default Content;