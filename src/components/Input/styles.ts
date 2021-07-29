import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(TextInput)`
  ${({ theme }) => css`
    width: 100%;
    padding: 16px 18px;

    font-family: ${theme.fonts.regular};
    font-size: ${RFValue(14)}px;

    color: ${theme.colors.title};
    background-color: ${theme.colors.shape};
    border-radius: 5px;

    margin-bottom: 8px;
  `}
`;

export const Error = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${theme.colors.attention};

    margin-bottom: 8px;
  `};
`;
