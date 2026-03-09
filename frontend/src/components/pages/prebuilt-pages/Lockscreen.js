import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Content from '../../sections/prebuilt-pages/lockscreen/Content';

class Lockscreen extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Seacole | Lock Screen</title>
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

export default Lockscreen;
