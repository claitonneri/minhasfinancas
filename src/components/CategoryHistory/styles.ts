import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface ICategoryHistoryProps {
  color: string;
}

export const Container = styled.View<ICategoryHistoryProps>`
  ${({ theme, color }) => css`
    width: 100%;

    background-color: ${theme.colors.shape};

    flex-direction: row;
    justify-content: space-between;

    padding: 12px 24px;

    border-radius: 5px;
    border-left-width: 5px;
    border-left-color: ${color};

    margin-bottom: 8px;
  `}
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;
`;

export const Amount = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(15)}px;
`;
