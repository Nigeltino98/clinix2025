import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Topbar from '../../layouts/Topbar';
import Setting from '../../layouts/Settings';
import Content from '../../sections/prebuilt-pages/defaultlogin/Content';

class Defaultlogin extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Seacole | Login</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </Helmet>

                <div className="body ms-body ms-primary-theme ms-logged-out" id="body">
                    <Setting />
                    <main className="body-content">
                        <Topbar/>
                        <Content/>
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default Defaultlogin;
