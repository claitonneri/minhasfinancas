import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import SummaryCard from '../../components/SummaryCard';
import TransactionCard, {
  ITransactionCardProps,
} from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserInfo,
  UserWrapper,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  SummaryCards,
  TransactionsList,
  Transactions,
  Title,
  Logout,
} from './styles';

import { getLastTransactionDate } from '../../utils';

export interface IDataListProps extends ITransactionCardProps {
  id: string;
}

interface ISummaryResult {
  income: {
    total: string;
    lastTransaction: string;
  };
  outcome: {
    total: string;
    lastTransaction: string;
  };
  total: string;
  interval: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<IDataListProps[]>();
  const [summaryResult, setSummaryResult] = useState<ISummaryResult>();

  const loadTransactions = async () => {
    const itens = await AsyncStorage.getItem(
      `@minhasfinancas:transactions_user:${user.id}`,
    );
    const itensParsed = itens ? JSON.parse(itens) : [];

    let incomeTotal = 0;
    let outcomeTotal = 0;

    const itensFormatted: IDataListProps[] = itensParsed.map(
      (item: IDataListProps) => {
        if (item.type === 'income') {
          incomeTotal += Number(item.amount);
        } else {
          outcomeTotal += Number(item.amount);
        }

        const amount = Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
          .format(Number(item.amount))
          .replace('R$', 'R$ ');

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      },
    );
    setTransactions(itensFormatted);

    const lastTransactionDateIncome = getLastTransactionDate(
      itensParsed,
      'income',
    );
    const lastTransactionDateOutcome = getLastTransactionDate(
      itensParsed,
      'outcome',
    );

    setSummaryResult({
      income: {
        total: incomeTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
          .replace('R$', 'R$ '),
        lastTransaction:
          lastTransactionDateIncome === 'Invalid Date'
            ? 'Não existem entradas'
            : `Última entrada em ${lastTransactionDateIncome}`,
      },
      outcome: {
        total: outcomeTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
          .replace('R$', 'R$ '),
        lastTransaction:
          lastTransactionDateOutcome === 'Invalid Date'
            ? 'Não existem saídas'
            : `Última saída em ${lastTransactionDateOutcome}`,
      },
      total: (incomeTotal - outcomeTotal)
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
        .replace('R$', 'R$ '),
      interval:
        lastTransactionDateOutcome === 'Invalid Date'
          ? 'Não existem entradas/saídas'
          : `1 à ${lastTransactionDateOutcome}`,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
      setIsLoading(false);
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator
          size={60}
          color={theme.colors.secondary}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />

                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <Logout onPress={signOut}>
                <Icon name="power" />
              </Logout>
            </UserWrapper>
          </Header>

          <SummaryCards>
            <SummaryCard
              title="Entradas"
              amount={summaryResult?.income.total}
              lastTransaction={summaryResult?.income.lastTransaction}
              type="income"
            />
            <SummaryCard
              title="Saídas"
              amount={summaryResult?.outcome.total}
              lastTransaction={summaryResult?.outcome.lastTransaction}
              type="outcome"
            />
            <SummaryCard
              title="Totais"
              amount={summaryResult?.total}
              lastTransaction={summaryResult?.interval}
              type="total"
            />
          </SummaryCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
