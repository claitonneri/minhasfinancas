import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import codePush from "react-native-code-push";

import Routes from './src/routes';

import { AuthProvider, useAuth } from './src/hooks/auth';

import theme from './src/styles/theme';

const App: React.FC = () => {
  const { userLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    codePush.sync({
      installMode: codePush.InstallMode.IMMEDIATE
    })
  }, []);

  if (!fontsLoaded && !userLoading) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#2D2D2C" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
})(App);
