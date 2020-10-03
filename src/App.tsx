import React from 'react';
import './App.css';
import { Stack, Text, Link, FontWeights, IStackTokens } from '@fluentui/react';
import { OpenAPIProvider } from 'react-openapi-client';
import Colors from './components/Color';

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const containerStackTokens: IStackTokens = { childrenGap: 15 };

function App() {
  return (
    <OpenAPIProvider definition="https://api.boundlexx.app/api/v1/schema/?format=openapi-json">
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        verticalFill
        tokens={containerStackTokens}
      >
        <img src="/logo.svg" className="App-logo" alt="logo" />
        <Text variant="xxLarge" styles={boldStyle}>Boundlexx</Text>
        <Text variant="large"><Link href="https://api.boundlexx.app/api/v1/">API Documentation</Link></Text>
        <Colors />
      </Stack>
    </OpenAPIProvider>
  );
}

export default App;
