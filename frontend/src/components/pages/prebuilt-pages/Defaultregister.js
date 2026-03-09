import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Topbar from '../../layouts/Topbar';
import Setting from '../../layouts/Settings';
import Sidenav from '../../layouts/Sidenav';
import Content from '../../sections/prebuilt-pages/defaultregister/PasswordReset';

class Defaultregister extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Seacole | Default Register</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </Helmet>

                <div className="body ms-body ms-primary-theme ms-logged-out" id="body">
                    <Setting />
                    <Sidenav />
                    <main className="body-content">
                        <Topbar/>
                        <Content/>
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default Defaultregister;
