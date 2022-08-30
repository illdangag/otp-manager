import { Icon, useColorMode, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

/**
 * https://fonts.google.com/icons?selected=Material%20Icons%3Alink%3A
 */
const LinkIcon = ({
  boxSize = '1.2rem',
  color,
}: Props) => {
  const { colorMode, } = useColorMode();
  const getColor = (): string => {
    if (color !== null) {
      return color;
    } else if (colorMode === 'light') {
      return 'gray.700';
    } else {
      return 'white.700';
    }
  };
  return (
    <Icon viewBox='0 0 24 24' color={getColor()} boxSize={boxSize}>
      <path d='M0 0h24v24H0z' fill='none'/>
      <path fill='currentColor' d='M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'/>
    </Icon>
  );
};

export default LinkIcon;
