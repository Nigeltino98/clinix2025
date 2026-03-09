import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = () => {
    return (
        <div className="col-md-12">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb pl-0">
                    <li className="breadcrumb-item"><Link to="/"><i className="material-icons">home</i> Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/appointment">Appointment</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add Appointment</li>
                </ol>
            </nav>
        </div>
    );
}

export default Breadcrumb;