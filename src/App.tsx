import React from 'react';
import './App.css';
import { Stack, Text, Link, IStackTokens } from '@fluentui/react';
import { OpenAPIProvider } from 'react-openapi-client';
import Worlds from './components/api/Worlds';
import ThemeSelector from './components/ThemeSelector';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { apiConfig, getDefinition } from './api/config';
import { ReactReduxContext } from 'react-redux'

const containerStackTokens: IStackTokens = { childrenGap: 15 };

function App() {
  const { t } = useTranslation();

  return (
    <ReactReduxContext.Consumer>
      { store =>
        <OpenAPIProvider definition={getDefinition(store.store.getState())} withServer={apiConfig.server}>
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          verticalFill
          tokens={containerStackTokens}
        >
          <img src="https://cdn.boundlexx.app/logos/logo.svg" alt="logo" width="300" height="300" className="logo" />
          <h1>{t("Boundlexx")}</h1>
          <Text variant="large"><Link href="https://api.boundlexx.app/api/v1/">{t("API Documentation")}</Link></Text>

          <ThemeSelector />
          <LanguageSelector />
          <Worlds />
        </Stack>
      </OpenAPIProvider>
      }
    </ReactReduxContext.Consumer>
  );
}

export default App;
