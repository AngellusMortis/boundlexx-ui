import React from 'react';
import './App.css';
import { Stack, Text, Link, IStackTokens } from '@fluentui/react';
import { OpenAPIProvider } from 'react-openapi-client';
import Colors from './components/Colors';
import ThemeSelector from './components/ThemeSelector';
import LanguageSelector from './components/LanguageSelector';
import { UserPreferencesProvider } from './UserPreferences';
import { useTranslation } from 'react-i18next';

const containerStackTokens: IStackTokens = { childrenGap: 15 };

function App() {
  const { t, i18n } = useTranslation();
  return (
    <UserPreferencesProvider>
      <OpenAPIProvider definition="https://api.boundlexx.app/api/v1/schema/?format=openapi-json">
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          verticalFill
          tokens={containerStackTokens}
        >
          <img src="/logo.svg" className="App-logo" alt="logo" />
          <h1>{t("Boundlexx")}</h1>
          <Text variant="large"><Link href="https://api.boundlexx.app/api/v1/">{t("API Documentation")}</Link></Text>

          <ThemeSelector />
          <LanguageSelector />
          <Colors locale={i18n.language} loading={true} results={[]} />
        </Stack>
      </OpenAPIProvider>
    </UserPreferencesProvider>
  );
}

export default App;
