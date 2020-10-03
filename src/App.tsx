import React from 'react';
import './App.css';
import { Stack, Text, Link, Image, IStackTokens } from '@fluentui/react';
import { OpenAPIProvider } from 'react-openapi-client';
import Colors from './components/Colors';
import ThemeSelector from './components/ThemeSelector';
import LanguageSelector from './components/LanguageSelector';
import { UserPreferencesProvider, UserPreferencesContext } from './UserPreferences';
import { useTranslation } from 'react-i18next';

const containerStackTokens: IStackTokens = { childrenGap: 15 };

function App() {
  const { t } = useTranslation();
  return (
    <UserPreferencesProvider>
      <OpenAPIProvider definition="https://api.boundlexx.app/api/v1/schema/?format=openapi-json">
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          verticalFill
          tokens={containerStackTokens}
        >
          <Image src="/logo.svg" height={"40vmin"} alt="logo" />
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
