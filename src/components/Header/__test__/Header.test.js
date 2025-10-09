// src/components/Header/__test__/Header.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import Header from '../Header';


const mockTheme = {
  colors: {
    buttons: '#3498db',
    primary: '#2c3e50',
    secondary: '#ecf0f1',
    text: '#ffffff',
    background: '#f5f5f5',
  },
};

//Si usas styled-components con theme es necesrio usar ThemeProvider 
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Header Component', () => {
  
  test('must render the Header component', () => {
    renderWithTheme(<Header title="Pokemon" />);
    
    const headerElement = screen.getByText('Pokemon');
    expect(headerElement).toBeInTheDocument();
  });

  test('should display the title passed as prop', () => {
    const testTitle = 'Poke Api';
    renderWithTheme(<Header title={testTitle} />);
    
    const titleElement = screen.getByText(testTitle);
    
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(testTitle);
  });

  test('should render different titles', () => {
    renderWithTheme(<Header title="Otro título" />);
    expect(screen.getByText('Otro título')).toBeInTheDocument();
  });

  test('must render with empty title', () => {
    renderWithTheme(<Header title="" />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });
});