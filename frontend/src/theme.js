import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#fff',
  text: '#000',
};

export const darkTheme = {
  background: '#333',
  text: '#fff',
};

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: Arial, sans-serif;
  }
`;
