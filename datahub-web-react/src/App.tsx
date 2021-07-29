import React, { useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { ThemeProvider } from 'styled-components';

import './App.less';
import { Routes } from './app/Routes';
import EntityRegistry from './app/entity/EntityRegistry';
import { DashboardEntity } from './app/entity/dashboard/DashboardEntity';
import { ChartEntity } from './app/entity/chart/ChartEntity';
import { UserEntity } from './app/entity/user/User';
import { UserGroupEntity } from './app/entity/userGroup/UserGroup';
import { DatasetEntity } from './app/entity/dataset/DatasetEntity';
import { DataFlowEntity } from './app/entity/dataFlow/DataFlowEntity';
import { DataJobEntity } from './app/entity/dataJob/DataJobEntity';
import { TagEntity } from './app/entity/tag/Tag';
import { EntityRegistryContext } from './entityRegistryContext';
import { Theme } from './conf/theme/types';
import defaultThemeConfig from './conf/theme/theme_light.config.json';
import { PageRoutes } from './conf/Global';
import { isLoggedInVar } from './app/auth/checkAuthStatus';
import { GlobalCfg } from './conf';
import { GlossaryTermEntity } from './app/entity/glossaryTerm/GlossaryTermEntity';
import { MLFeatureEntity } from './app/entity/mlFeature/MLFeatureEntity';
import { MLPrimaryKeyEntity } from './app/entity/mlPrimaryKey/MLPrimaryKeyEntity';
import { MLFeatureTableEntity } from './app/entity/mlFeatureTable/MLFeatureTableEntity';

/*
    Construct Apollo Client
*/
const httpLink = createHttpLink({ uri: '/api/v2/graphql' });

const errorLink = onError(({ response, graphQLErrors, networkError }) => {
    console.log('on error called');

    console.log(response);

    if (graphQLErrors) {
        console.log(`Received graphQL error ${graphQLErrors}`);
    }

    if (networkError) {
        console.log(`Received network error ${networkError}`);
        const serverError = networkError as ServerError;
        if (serverError.statusCode === 401) {
            isLoggedInVar(false);
            Cookies.remove(GlobalCfg.CLIENT_AUTH_COOKIE);
            window.location.replace(PageRoutes.AUTHENTICATE);
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    link: errorLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    dataset: {
                        merge(existing, incoming) {
                            // Better, but not quite correct.
                            return { ...existing, ...incoming };
                        },
                    },
                },
            },
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
            DataFlow: {
                keyFields: ['urn'],
            },
            DataJob: {
                keyFields: ['urn'],
            },
            MLFeatureTable: {
                keyFields: ['urn'],
            },
        },
        possibleTypes: {
            EntityWithRelationships: ['Dataset', 'Chart', 'Dashboard', 'DataJob', 'MLFeature', 'MLPrimaryKey'],
        },
    }),
    credentials: 'include',
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'no-cache',
        },
    },
});

const App: React.VFC = () => {
    const [dynamicThemeConfig, setDynamicThemeConfig] = useState<Theme>(defaultThemeConfig);

    useEffect(() => {
        import(`./conf/theme/${process.env.REACT_APP_THEME_CONFIG}`).then((theme) => {
            setDynamicThemeConfig(theme);
        });
    }, []);

    const entityRegistry = useMemo(() => {
        const register = new EntityRegistry();
        register.register(new DatasetEntity());
        register.register(new DashboardEntity());
        register.register(new ChartEntity());
        register.register(new UserEntity());
        register.register(new UserGroupEntity());
        register.register(new TagEntity());
        register.register(new DataFlowEntity());
        register.register(new DataJobEntity());
        register.register(new GlossaryTermEntity());
        register.register(new MLFeatureEntity());
        register.register(new MLPrimaryKeyEntity());
        register.register(new MLFeatureTableEntity());
        return register;
    }, []);

    return (
        <ThemeProvider theme={dynamicThemeConfig}>
            <Router>
                <EntityRegistryContext.Provider value={entityRegistry}>
                    <ApolloProvider client={client}>
                        <Routes />
                    </ApolloProvider>
                </EntityRegistryContext.Provider>
            </Router>
        </ThemeProvider>
    );
};

export default App;
