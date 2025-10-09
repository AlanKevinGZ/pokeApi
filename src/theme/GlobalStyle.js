import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');


  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.base};
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  h1 {
    margin: 0;
    color: ${props => props.theme.colors.text};
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.textInfo};
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

export default GlobalStyle;
