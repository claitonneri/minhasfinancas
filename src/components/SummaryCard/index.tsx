import React from 'react';

import {
  Container,
  Header,
  Title,
  Icon,
  Content,
  Amount,
  LastTransaction,
} from './styles';

interface IProps {
  type: 'income' | 'outcome' | 'total';
  title: string;
  amount: string | undefined;
  lastTransaction: string | undefined;
}

const SummaryCard: React.FC<IProps> = ({
  type,
  title,
  amount,
  lastTransaction,
}) => {
  const icon = {
    income: 'arrow-up-circle',
    outcome: 'arrow-down-circle',
    total: 'dollar-sign',
  };

  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>

      <Content>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Content>
    </Container>
  );
};

export default SummaryCard;
