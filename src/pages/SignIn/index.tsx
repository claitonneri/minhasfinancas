import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';

import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import Apple from '../../assets/apple-icon.svg';
import Facebook from '../../assets/facebook-icon.svg';

import SocialButton from '../../components/SocialButton';

import {
  Container,
  Header,
  HeaderWrapper,
  Logo,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

const SignIn: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithApple, signInWithFacebook } = useAuth();

  const handleSignInWithApple = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch {
      Alert.alert('Não foi possível conectar com a conta Apple');
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      setIsLoading(true);
      await signInWithFacebook();
    } catch (error) {
      Alert.alert('Não foi possível conectar com a conta Facebook');
    }
  };

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <Logo>minha$ finança$</Logo>

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            simples
          </Title>
        </HeaderWrapper>

        <SignInTitle>
          Faça seu login
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          {Platform.OS === 'ios' ? (
            <SocialButton
              title="Entrar com Apple"
              icon={Apple}
              onPress={handleSignInWithApple}
            />
          ) : (
              <SocialButton
                title="Entrar com Facebook"
                icon={Facebook}
                onPress={handleSignInWithFacebook}
              />
            )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            size="large"
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
};

export default SignIn;
