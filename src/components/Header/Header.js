import React from 'react'
import { HeaderWrapper, Title } from './style/style';


function Header({title}) {
  return (
    <HeaderWrapper>
      <Title>{title} </Title>
      
    </HeaderWrapper>
  );
}

export default Header