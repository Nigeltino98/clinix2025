import React from 'react';
import Breadcrumb from './Breadcrumb';
import Departmentlist from './Departmentlist';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb />
                    <Departmentlist />
                </div>
            </div>
        </div>
    );
}

export default Content;