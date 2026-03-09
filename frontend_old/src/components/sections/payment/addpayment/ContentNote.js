import React from 'react';
import AddformNote from './AddformNote';
import Breadcrumb from './Breadcrumb';

const Content = () => {
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb />
                </div>
                <AddformNote />
            </div>
        </div>
    );
}

export default Content;