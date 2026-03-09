import React from 'react';
import Breadcrumb from './Breadcrumb';
import DoctorsList from './DoctorsList';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb />
                    <DoctorsList />
                </div>
            </div>
        </div>
    );
}

export default Content;