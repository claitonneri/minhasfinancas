import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Button from '../../components/Button';

import categories from '../../resources/categories';

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface ICategoryProps {
  key: string;
  name: string;
}

interface ICategoriesProps {
  category: ICategoryProps;
  setCategory: (category: ICategoryProps) => void;
  closeSelectCategory: () => void;
}

const Categories: React.FC<ICategoriesProps> = ({
  category,
  setCategory,
  closeSelectCategory,
}) => {
  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => setCategory(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button onPress={closeSelectCategory} title="Selecionar" />
      </Footer>
    </Container>
  );
};

export default Categories;
