import { Icon, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

const AddIcon = ({
  boxSize = '1.2rem',
  color = 'gray.700',
}: Props) => {
  return (
    <Icon viewBox='0 0 24 24' color={color} boxSize={boxSize}>
      <path d='M0 0h24v24H0V0z' fill='none'/>
      <path fill='currentColor' d='M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z'/>
    </Icon>
  );
};

export default AddIcon;
