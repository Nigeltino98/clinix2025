import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Content from '../../sections/prebuilt-pages/error/Content';

class Error extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Seacole | Error 404</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </Helmet>

                <div className="body ms-body ms-primary-theme" id="body">
                    <Content/>
                </div>
            </Fragment>
        );
    }
}

export default Error;
