import React from 'react';

import { Container, Title, Amount } from './styles';

interface ICategoryHistoryProps {
  title: string;
  amount: string;
  color: string;
}

const CategoryHistory: React.FC<ICategoryHistoryProps> = ({
  color,
  title,
  amount,
}) => {
  return (
    <Container color={color}>
      <Title>{title}</Title>

      <Amount>{amount}</Amount>
    </Container>
  );
};

export default CategoryHistory;
