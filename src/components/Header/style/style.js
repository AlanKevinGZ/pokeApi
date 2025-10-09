import styled from "styled-components";

export const HeaderWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.buttons};
  color: #fff;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

export const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

 export const NavLink = styled.a`
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;