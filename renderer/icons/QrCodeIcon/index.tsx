import { Icon, useColorMode, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

/**
 * https://fonts.google.com/icons?selected=Material%20Icons%3Alink%3A
 */
const QrCodeIcon = ({
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
      <g>
        <rect fill='none' height='24' width='24'/>
      </g>
      <g>
        <g>
          <path fill='currentColor' d='M3,11h8V3H3V11z M5,5h4v4H5V5z'/>
          <path fill='currentColor' d='M3,21h8v-8H3V21z M5,15h4v4H5V15z'/>
          <path fill='currentColor' d='M13,3v8h8V3H13z M19,9h-4V5h4V9z'/>
          <rect fill='currentColor' height='2' width='2' x='19' y='19'/>
          <rect fill='currentColor' height='2' width='2' x='13' y='13'/>
          <rect fill='currentColor' height='2' width='2' x='15' y='15'/>
          <rect fill='currentColor' height='2' width='2' x='13' y='17'/>
          <rect fill='currentColor' height='2' width='2' x='15' y='19'/>
          <rect fill='currentColor' height='2' width='2' x='17' y='17'/>
          <rect fill='currentColor' height='2' width='2' x='17' y='13'/>
          <rect fill='currentColor' height='2' width='2' x='19' y='15'/>
        </g>
      </g>
    </Icon>
  );
};

export default QrCodeIcon;
