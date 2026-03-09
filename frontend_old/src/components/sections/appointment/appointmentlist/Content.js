import React from 'react';
import Appointmentlist from './Appointmentlist';
import Breadcrumb from './Breadcrumb';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb />
                    <Appointmentlist />
                </div>
            </div>
        </div>
    );
}

export default Content;