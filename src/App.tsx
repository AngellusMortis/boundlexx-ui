import React from 'react';
import './App.css';
import { Stack, Text, Link, Image, IStackTokens, initializeIcons } from '@fluentui/react';
import { OpenAPIProvider } from 'react-openapi-client';
import Colors from './components/Colors';
import ThemeSelector from './components/ThemeSelector';
import LanguageSelector from './components/LanguageSelector';
import { UserPreferencesProvider, UserPreferencesContext } from './UserPreferences';
import { useTranslation } from 'react-i18next';
import api from './api';
import Headers from './components/header/Headers'

const containerStackTokens: IStackTokens = { childrenGap: 15 };

function App() {
  const { t } = useTranslation();

  initializeIcons();

  return (
    <UserPreferencesProvider>
      <OpenAPIProvider definition={`${api.apiBase}/schema/?format=openapi-json`} withServer={api.server}>
        <Headers />
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
          <UserPreferencesContext.Consumer>
            {value => <Colors locale={value.language} />}
          </UserPreferencesContext.Consumer>
        </Stack>
      </OpenAPIProvider>
    </UserPreferencesProvider>
  );
}

export default App;
