import { Icon, useColorMode, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

/**
 * https://fonts.google.com/icons?selected=Material%20Icons%20Round%3Anavigate_next%3A
 */
const NavigateNextIcon = ({
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
      <path d='M0 0h24v24H0V0z' fill='none'/>
      <path fill='currentColor' d='M9.31 6.71c-.39.39-.39 1.02 0 1.41L13.19 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.72 6.7c-.38-.38-1.02-.38-1.41.01z'/>
    </Icon>
  );
};

export default NavigateNextIcon;
