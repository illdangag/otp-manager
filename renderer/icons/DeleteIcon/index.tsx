import { Icon, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

/**
 * https://fonts.google.com/icons?selected=Material%20Icons%20Round%3Aclear%3A
 */
const DeleteIcon = ({
  boxSize = '1.2rem',
  color = 'gray.700',
}: Props) => {
  return (
    <Icon viewBox='0 0 24 24' color={color} boxSize={boxSize}>
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path fill='currentColor' d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
    </Icon>
  );
};

export default DeleteIcon;
