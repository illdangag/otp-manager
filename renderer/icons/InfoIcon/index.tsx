import { Icon, useColorMode, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

/**
 * https://fonts.google.com/icons?selected=Material%20Icons%20Round%3Ainfo_outline%3A
 */
const InfoIcon = ({
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
      <g fill='none'>
        <path d='M0 0h24v24H0V0z'/>
        <path d='M0 0h24v24H0V0z' opacity='.87'/>
      </g>
      <path fill='currentColor' d='M11 7h2v2h-2zm1 10c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1zm0-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/>
    </Icon>
  );
};

export default InfoIcon;
