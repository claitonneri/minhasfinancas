import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

interface IIconProps {
  type: 'income' | 'outcome';
}

interface IButtonProps {
  isActive: boolean;
  type: 'income' | 'outcome';
}

export const Container = styled.View<IButtonProps>`
  width: 48%;

  border-width: 1.5px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;

  ${({ theme, isActive, type }) =>
    isActive &&
    type === 'income' &&
    css`
      background-color: ${theme.colors.success_light};
      border-color: transparent;
    `}

  ${({ theme, isActive, type }) =>
    isActive &&
    type === 'outcome' &&
    css`
      background-color: ${theme.colors.attention_light};
      border-color: transparent;
    `}
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 16px;
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.fonts.regular};
    font-size: ${RFValue(14)}px;
  `}
`;

export const Icon = styled(Feather)<IIconProps>`
  font-size: ${RFValue(24)}px;

  margin-right: 12px;

  color: ${({ theme, type }) =>
    type === 'income' ? theme.colors.success : theme.colors.attention};
`;
