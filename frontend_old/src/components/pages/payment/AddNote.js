import React, { Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Topbar from '../../layouts/Topbar';
import Setting from '../../layouts/Settings';
import Sidenav from '../../layouts/Sidenav';
import ContentNote from '../../sections/payment/addpayment/ContentNote';

const Addpayment = () => {
    return (
        <Fragment>
            <MetaTags>
                <title>Seacole  | Add Note</title>
                <meta
                    name="description"
                    content="#"
                />
            </MetaTags>
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