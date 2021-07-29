import React, { useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';

import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TransactionButton from '../../components/TransactionButton';
import Categories from '../Categories';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionContent,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface IFormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Informe um nome'),
  amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Informe o preço'),
});

const Register: React.FC = () => {
  const { user } = useAuth();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModal, setCategoryModal] = useState(false);
  const navigation = useNavigation();

  // eslint-disable-next-line consistent-return
  const handleRegister = async (form: IFormData): Promise<void> => {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria');
    }

    const transaction = {
      id: uuid.v4(),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const itens = await AsyncStorage.getItem(
        `@minhasfinancas:transactions_user:${user.id}`,
      );
      const itensParsed = itens ? JSON.parse(itens) : [];

      const allItens = [...itensParsed, transaction];

      await AsyncStorage.setItem(
        `@minhasfinancas:transactions_user:${user.id}`,
        JSON.stringify(allItens),
      );

      reset();
      setTransactionType('');
      setCategory({ key: 'category', name: 'Categoria' });

      navigation.navigate('Listagem');
    } catch {
      Alert.alert('Não foi possível salvar');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <Input
              placeholder="Nome"
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name?.message}
            />
            <Input
              placeholder="Valor"
              name="amount"
              control={control}
              keyboardType="numeric"
              error={errors.amount?.message}
            />

            <TransactionContent>
              <TransactionButton
                type="income"
                title="Income"
                onPress={() => setTransactionType('income')}
                isActive={transactionType === 'income'}
              />
              <TransactionButton
                type="outcome"
                title="Outcome"
                onPress={() => setTransactionType('outcome')}
                isActive={transactionType === 'outcome'}
              />
            </TransactionContent>

            <Select
              title={category.name}
              onPress={() => setCategoryModal(true)}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModal}>
          <Categories
            category={category}
            setCategory={setCategory}
            closeSelectCategory={() => setCategoryModal(false)}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Register;
