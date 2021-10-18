/*
 * Copyright 2019-2020 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BrComponent, BrPage, BrPageContext } from '@bloomreach/react-sdk';
import { CommerceConnectorProvider } from '@bloomreach/connector-components-react';
import { getDefaultConnector, getGraphqlServiceUrl } from './utils';
import PreviewModal from './PreviewModal';

// brXM Components
import {
    Banner,
    CategorySlider,
    Content,
    FlexibleGrid,
    Footer,
    Header,
    NewsList,
    ProductDetail,
    ProductDetailCustomContent,
    ProductGridCategory,
    SlickSlider,
} from './components';

import './App.scss';

export interface ErrorState {
    errorMessage?: string;
}

export default class App extends React.Component<RouteComponentProps, ErrorState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            errorMessage: undefined
        };

        if (process.env.REACT_APP_DEFAULT_CONNECTOR) {
          sessionStorage.setItem('default-connector', process.env.REACT_APP_DEFAULT_CONNECTOR);
        }
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { errorMessage: error.message };
    }

    componentDidCatch(error: Error) {
        // You can also log error messages to an error reporting service here
        console.log(error);
    }

    render() {
        const { location: { pathname, search } } = this.props;

        // To view the site in "Preview" mode, pass the query sting parameter "preview=true"
        const cookies = new Cookies();
        const queryString = require('query-string');
        const previewQueryString = queryString.parse(window?.location.search);
        if (previewQueryString?.preview) {
            cookies.set('previewMode', 'true', { path: '/' });
        }

        // brXM Configuration
        const previewMode = cookies.get('previewMode') || false;
        const configuration = {
            endpoint: previewMode === "true" ? process.env.REACT_APP_BRXM_ENDPOINT_PREVIEW : process.env.REACT_APP_BRXM_ENDPOINT,
            endpointQueryParameter: 'endpoint',
            httpClient: axios,
            path: `${pathname}${search}`,
        };

        // brXM Component Mapping
        const mapping = {
            Banner,
            CategorySlider,
            Content,
            FlexibleGrid,
            'News List': NewsList,
            'Simple Content': Content,
            ProductDetail,
            ProductDetailCustomContent,
            ProductGridCategory,
            SlickSlider,
        };


        // Error State
        if (this.state.errorMessage) {
            return (
                <>
                    <header>
                        <nav className="navbar navbar-expand-sm navbar-dark sticky-top bg-dark" role="navigation">
                            <div className="container">
                                <Link to='/' className="navbar-brand">
                                    brXM + React = 💔
                                </Link>
                                <div className="collapse navbar-collapse"></div>
                                <div></div>
                            </div>
                        </nav>
                    </header>
                    <section className="container flex-fill pt-3">
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMessage}
                        </div>
                    </section>
                    <footer className="bg-dark text-light py-3">
                        <div className="container clearfix">
                            <div className="float-left pr-3">&copy; Bloomreach</div>
                            <div className="overflow-hidden"></div>
                        </div>
                    </footer>
                </>
            );
        }

        const token = sessionStorage.getItem('token') ?? undefined;
        return (
            <BrPage configuration={configuration} mapping={mapping}>
                <BrPageContext.Consumer>
                    {page => {
                        return (
                            <CommerceConnectorProvider
                                connector={getDefaultConnector(page!)}
                                graphqlServiceUrl={getGraphqlServiceUrl(page!)}
                                existingToken={token}>
                                <Header />
                                    <main id='main' className="">
                                        <BrComponent path="main" />
                                    </main>
                                <Footer />
                                {previewMode && <PreviewModal /> }
                        </CommerceConnectorProvider>
                    ) }}
                </BrPageContext.Consumer>
            </BrPage>
        );
    }
}
