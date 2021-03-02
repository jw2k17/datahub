import React, { useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from 'styled-components';

import './App.less';
import { Routes } from './app/Routes';
import { mocks } from './Mocks';

import { DashboardEntity } from './app/entity/dashboard/DashboardEntity';
import { ChartEntity } from './app/entity/chart/ChartEntity';
import { UserEntity } from './app/entity/user/User';
import { DatasetEntity } from './app/entity/dataset/DatasetEntity';
import { TagEntity } from './app/entity/tag/Tag';

import EntityRegistry from './app/entity/EntityRegistry';
import { EntityRegistryContext } from './entityRegistryContext';

import themeConfig from './theme.config.json';

// Enable to use the Apollo MockProvider instead of a real HTTP client
const MOCK_MODE = false;

/*
    Construct Apollo Client 
*/
const client = new ApolloClient({
    uri: '/api/v2/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Dataset: {
                keyFields: ['urn'],
            },
            CorpUser: {
                keyFields: ['urn'],
            },
            Dashboard: {
                keyFields: ['urn'],
            },
            Chart: {
                keyFields: ['urn'],
            },
        },
    }),
    credentials: 'include',
});

const App: React.VFC = () => {
    const entityRegistry = useMemo(() => {
        const register = new EntityRegistry();
        register.register(new DatasetEntity());
        register.register(new DashboardEntity());
        register.register(new ChartEntity());
        register.register(new UserEntity());
        register.register(new TagEntity());
        return register;
    }, []);

    const stylingOverridesWithoutPrefix = useMemo(() => {
        const overridesWithoutPrefix = {};
        // this is based on the assumpton that antdStylingOverrides will always be a dictionary of <string, string>. If that changes,
        // we will need to turn this into a deep copy
        Object.assign(overridesWithoutPrefix, themeConfig.antdStylingOverrides);
        Object.keys(overridesWithoutPrefix).forEach((key) => {
            overridesWithoutPrefix[key.substring(1)] = overridesWithoutPrefix[key];
            delete overridesWithoutPrefix[key];
        });
        return overridesWithoutPrefix;
    }, []);

    return (
        <ThemeProvider theme={stylingOverridesWithoutPrefix}>
            <Router>
                <EntityRegistryContext.Provider value={entityRegistry}>
                    {/* Temporary: For local testing during development. */}
                    {MOCK_MODE ? (
                        <MockedProvider mocks={mocks} addTypename={false}>
                            <Routes />
                        </MockedProvider>
                    ) : (
                        <ApolloProvider client={client}>
                            <Routes />
                        </ApolloProvider>
                    )}
                </EntityRegistryContext.Provider>
            </Router>
        </ThemeProvider>
    );
};

export default App;
