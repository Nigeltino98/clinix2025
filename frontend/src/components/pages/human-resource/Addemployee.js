import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Topbar from '../../layouts/Topbar';
import Setting from '../../layouts/Settings';
import Sidenav from '../../layouts/Sidenav';
import Content from '../../sections/human-resource/addemployee/Content';

class Addemployee extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Seacole | Add Employee</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </Helmet>

                <div className="body ms-body ms-aside-left-open ms-primary-theme ms-has-quickbar" id="body">
                    <Setting />
                    <Sidenav />
                    <main className="body-content">
                        <Topbar />
                        <Content/>
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default Addemployee;
