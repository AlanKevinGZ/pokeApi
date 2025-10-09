import styled from "styled-components";

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
`;

export const LoginCard = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textInfo};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.buttons};
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: ${({ theme }) => theme.colors.buttons};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0053d6;
  }
`;

export const LinkText = styled.p`
  font-size: 14px;
  text-align: center;
  margin-top: 15px;

  a {
    color: ${({ theme }) => theme.colors.buttons};
    font-weight: 600;
    text-decoration: none;
  }
`;