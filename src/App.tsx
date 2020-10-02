import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Stack, Text, Link, FontWeights } from '@fluentui/react';

const boldStyle = { root: { fontWeight: FontWeights.semibold } };

function App() {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      gap={15}
    >
      <img src={logo} className="App-logo" alt="logo" />
      <Text variant="xxLarge" styles={boldStyle}>
        Welcome to Your UI Fabric App
</Text>
      <Text variant="large">For a guide on how to customize this project, check out the UI Fabric documentation.</Text>
      <Text variant="large" styles={boldStyle}>
        Essential Links
</Text>
      <Stack horizontal gap={15} horizontalAlign="center">
        <Link href="https://developer.microsoft.com/en-us/fabric">Docs</Link>
        <Link href="https://stackoverflow.com/questions/tagged/office-ui-fabric">Stack Overflow</Link>
        <Link href="https://github.com/officeDev/office-ui-fabric-react/">Github</Link>
        <Link href="https://twitter.com/officeuifabric">Twitter</Link>
      </Stack>
      <Text variant="large" styles={boldStyle}>
        Design System
</Text>
      <Stack horizontal gap={15} horizontalAlign="center">
        <Link href="https://developer.microsoft.com/en-us/fabric#/styles/icons">Icons</Link>
        <Link href="https://developer.microsoft.com/en-us/fabric#/styles/typography">Typography</Link>
        <Link href="https://developer.microsoft.com/en-us/fabric#/styles/themegenerator">Theme</Link>
      </Stack>
    </Stack>
  );
}

export default App;
