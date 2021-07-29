import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInputProps } from 'react-native';

import { Container, Error } from './styles';

interface IInputProps extends TextInputProps {
  control: Control;
  name: string;
  error: string;
}

const Input: React.FC<IInputProps> = ({ control, name, error, ...rest }) => {
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Container onChangeText={onChange} value={value} {...rest} />
        )}
        name={name}
      />
      {error && <Error>{error}</Error>}
    </>
  );
};

export default Input;
