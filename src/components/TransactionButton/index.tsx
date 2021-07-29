import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Button, Title, Icon } from './styles';

const icons = {
  income: 'arrow-up-circle',
  outcome: 'arrow-down-circle',
};

interface ITransactionButtonProps extends RectButtonProps {
  title: string;
  type: 'income' | 'outcome';
  isActive: boolean;
}

const TransactionButton: React.FC<ITransactionButtonProps> = ({
  title,
  type,
  isActive,
  ...rest
}) => {
  return (
    <Container type={type} isActive={isActive}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
};

export default TransactionButton;
