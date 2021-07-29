import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';

import { useFocusEffect } from '@react-navigation/native';
import CategoryHistory from '../../components/CategoryHistory';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  Warning,
  TextWarning,
  MonthSelect,
  MonthSelectButton,
  MonthName,
  MonthSelectIcon,
} from './styles';

import { IDataListProps } from '../Dashboard';

import categories from '../../resources/categories';
import { useAuth } from '../../hooks/auth';

interface ICategoryHistory {
  key: string;
  name: string;
  percent: string;
  total: number;
  color: string;
}

const Resume: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoriesHistory, setCategoriesHistory] =
    useState<ICategoryHistory[]>();

  const handleDateFilter = (action: 'next' | 'prev') => {
    setIsLoading(true);

    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const loadTransactions = async () => {
    setIsLoading(true);

    const itens = await AsyncStorage.getItem(
      `@minhasfinancas:transactions_user:${user.id}`,
    );
    const itensParsed = itens ? JSON.parse(itens) : [];

    const itensOutcomes = itensParsed.filter(
      (item: IDataListProps) =>
        item.type === 'outcome' &&
        new Date(item.date).getMonth() === selectedDate.getMonth() &&
        new Date(item.date).getFullYear() === selectedDate.getFullYear(),
    );

    const outcomesTotal = Number(
      itensOutcomes.reduce((accumulator: number, item: IDataListProps) => {
        return accumulator + Number(item.amount);
      }, 0),
    );

    const totalByCategory: ICategoryHistory[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      itensOutcomes.forEach((item: IDataListProps) => {
        if (item.category === category.key) {
          categorySum += Number(item.amount);
        }
      });

      if (categorySum > 0) {
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          percent: `${((categorySum / outcomesTotal) * 100).toFixed(0)}%`,
          total: categorySum,
        });
      }
    });
    setCategoriesHistory(totalByCategory);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
      setIsLoading(false);
    }, [selectedDate]),
  );

  return (
    <Container>
      <Header>
        <Title>Resumo</Title>
      </Header>

      <MonthSelect>
        <MonthSelectButton onPress={() => handleDateFilter('prev')}>
          <MonthSelectIcon name="chevron-left" />
        </MonthSelectButton>

        <MonthName>
          {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
        </MonthName>

        <MonthSelectButton onPress={() => handleDateFilter('next')}>
          <MonthSelectIcon name="chevron-right" />
        </MonthSelectButton>
      </MonthSelect>

      {isLoading ? (
        <ActivityIndicator
          size={60}
          color={theme.colors.secondary}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      ) : (
        <>
          <ChartContainer>
            <VictoryPie
              data={categoriesHistory}
              x="percent"
              y="total"
              style={{
                labels: {
                  fontSize: RFValue(12),
                  fontWeight: '500',
                  fill: theme.colors.background,
                },
              }}
              labelRadius={100}
              colorScale={categoriesHistory?.map(
                categoryHistory => categoryHistory.color,
              )}
            />
          </ChartContainer>

          <Content
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {categoriesHistory?.map(categoryHistory => {
              return (
                <CategoryHistory
                  key={categoryHistory.key}
                  title={categoryHistory.name}
                  amount={categoryHistory.total
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                    .replace('R$', 'R$ ')}
                  color={categoryHistory.color}
                />
              );
            })}

            {!categoriesHistory && (
              <Warning>
                <TextWarning>Sem lançamentos</TextWarning>
              </Warning>
            )}
          </Content>
        </>
      )}
    </Container>
  );
};

export default Resume;
