import React from 'react';
import Addform from './AddFormPlan';
import BreadcrumbPlan from './BreadcrumbPlan';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <BreadcrumbPlan />
                </div>
                <Addform />
            </div>
        </div>
    );
}

export default Content;