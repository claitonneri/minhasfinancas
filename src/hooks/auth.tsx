/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


import * as Facebook from 'expo-facebook';
import * as AppleAuthentication from 'expo-apple-authentication';

interface IUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: IUser;
  userLoading: boolean;
  signInWithApple(): Promise<void>;
  signInWithFacebook(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  // TODO const signInWithGoogle = () => {};

  const signInWithApple = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credentials) {
        const userLogged = {
          id: credentials.user,
          email: credentials.email!,
          name: credentials.fullName!.givenName!,
          photo: `https://ui-avatars.com/api/?name=${credentials.fullName!
            .givenName!}&length=2`,
        };

        setUser(userLogged);

        await AsyncStorage.setItem(
          '@minhasfinancas:user',
          JSON.stringify(userLogged),
        );

        setUserLoading(false);
      }
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '679105869924144',
      });

      const credentials = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (credentials.type === 'success') {
        await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${credentials.token}`,
        ).then(async response => {
          const profile = await response.json();

          const userLogged = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            photo: profile.picture.data.url,
          };

          setUser(userLogged);

          await AsyncStorage.setItem(
            '@minhasfinancas:user',
            JSON.stringify(userLogged),
          );
        });
      } else {
        setUserLoading(false);
      }
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  const signOut = async () => {
    setUser({} as IUser);

    await AsyncStorage.removeItem('@minhasfinancas:user');
  };

  useEffect(() => {
    const loadUserStorageData = async () => {
      const userStoraged = await AsyncStorage.getItem('@minhasfinancas:user');

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as IUser;
        setUser(userLogged);
      }
    };

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading,
        signInWithApple,
        signInWithFacebook,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): IAuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
