import React from 'react'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// apollo
import client from './config/apollo'
import { ApolloProvider } from '@apollo/client'

// app + apollo provider
const upTaskApp = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => upTaskApp);
