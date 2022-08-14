import { Icon, useColorMode, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

/**
 * https://fonts.google.com/icons?selected=Material+Icons&icon.style=Rounded&icon.query=copy
 */
const CopyIcon = ({
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
        <path fill='currentColor' d='M15,20H5V7c0-0.55-0.45-1-1-1h0C3.45,6,3,6.45,3,7v13c0,1.1,0.9,2,2,2h10c0.55,0,1-0.45,1-1v0C16,20.45,15.55,20,15,20z M20,16V4c0-1.1-0.9-2-2-2H9C7.9,2,7,2.9,7,4v12c0,1.1,0.9,2,2,2h9C19.1,18,20,17.1,20,16z M18,16H9V4h9V16z'/>
      </g>
    </Icon>
  );
};

export default CopyIcon;
