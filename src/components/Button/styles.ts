import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(RectButton)`
  ${({ theme }) => css`
    width: 100%;
    background-color: ${theme.colors.secondary};

    align-items: center;
    border-radius: 5px;
    padding: 18px;
  `}
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.fonts.medium};
    font-size: ${RFValue(14)}px;

    color: ${theme.colors.shape};
  `};
`;
