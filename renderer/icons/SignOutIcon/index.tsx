import { Icon, } from '@chakra-ui/react';
import * as CSS from 'csstype';

interface Props {
  boxSize?: CSS.Property.Width | number,
  color?: CSS.Property.Color,
}

const SignOutIcon = ({
  boxSize = '1.2rem',
  color = 'gray.700',
}: Props) => {
  return (
    <Icon viewBox='0 0 24 24' color={color} boxSize={boxSize}>
      <path d='M0,0h24v24H0V0z' fill='none'/>
      <path fill='currentColor' d='M5,5h6c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h6c0.55,0,1-0.45,1-1v0 c0-0.55-0.45-1-1-1H5V5z'/>
      <path fill='currentColor' d='M20.65,11.65l-2.79-2.79C17.54,8.54,17,8.76,17,9.21V11h-7c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h7v1.79 c0,0.45,0.54,0.67,0.85,0.35l2.79-2.79C20.84,12.16,20.84,11.84,20.65,11.65z'/>
    </Icon>
  );
};

export default SignOutIcon;
