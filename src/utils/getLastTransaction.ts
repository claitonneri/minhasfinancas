import { IDataListProps } from '../pages/Dashboard';

const getLastTransactionsDate = (
  transactions: IDataListProps[],
  type: 'income' | 'outcome',
): string =>
  new Date(
    Math.max(
      ...transactions
        .filter((transaction: IDataListProps) => transaction.type === type)
        .map((transaction: IDataListProps) =>
          new Date(transaction.date).getTime(),
        ),
    ),
  ).toLocaleDateString('pt-br', {
    day: '2-digit',
    month: 'long',
  });
export default getLastTransactionsDate;
