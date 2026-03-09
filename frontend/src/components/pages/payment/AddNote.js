import React, { Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Topbar from '../../layouts/Topbar';
import Setting from '../../layouts/Settings';
import Sidenav from '../../layouts/Sidenav';
import ContentNote from '../../sections/payment/addpayment/ContentNote';

const Addpayment = () => {
    return (
        <Fragment>
            <Helmet>
                <title>Seacole | Add Note</title>
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
                    <ContentNote />
                </main>
            </div>
        </Fragment>
    );
}

export default Addpayment;
