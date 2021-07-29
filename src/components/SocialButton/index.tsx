import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import { Button, ImageContainer, Title } from './styles';

interface SocialButtonProps extends RectButtonProps {
  title: string;
  icon: React.FC<SvgProps>;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  icon: Icon,
  ...rest
}) => {
  return (
    <Button {...rest}>
      <ImageContainer>
        <Icon />
      </ImageContainer>

      <Title>{title}</Title>
    </Button>
  );
};

export default SocialButton;
