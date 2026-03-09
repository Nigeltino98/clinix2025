import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Breadcrumb extends Component {
    render() {
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb pl-0">
                    <li className="breadcrumb-item"><Link to="/"><i className="material-icons">house</i> House</Link></li>
                    <li className="breadcrumb-item"><Link to="/house-overview">House</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">House Overview</li>
                </ol>
            </nav>
        );
    }
}

export default Breadcrumb;