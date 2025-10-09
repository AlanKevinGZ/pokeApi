// src/pages/Home/__test__/Home.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";
import Home from "../Home";
import pokemonReducer from "../../../store/PokemonSlice";


const mockTheme = {
  colors: {
    buttons: '#3498db',
    primary: '#2c3e50',
    secondary: '#ecf0f1',
    text: '#ffffff',
    background: '#f5f5f5',
  },
};

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../components/Header/Header", () => {
  return function MockHeader({ title }) {
    return <div data-testid="header">{title}</div>;
  };
});
global.fetch = jest.fn();

const renderWithProviders = (initialState = {}) => {
  const defaultState = {
    list: [],
    selected: null,
    loading: false,
    error: null,
    pokemonDetails: null,
    loadingDetails: false,
    errorDetails: null,
    ...initialState
  };

  const store = configureStore({
    reducer: {
      pokemon: pokemonReducer,
    },
    preloadedState: {
      pokemon: defaultState
    }
  });

  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={mockTheme}>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
    store
  };
};


describe("Home Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
   
    global.fetch.mockResolvedValue({
      json: async () => ({ results: [] }),
    });
  });


  test("renders Header component", async () => {
    renderWithProviders();
    
   
    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
  });


  test("shows loading message when loading is true", () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText(/cargando pokémons/i)).toBeInTheDocument();
  });


  test("shows error message when error exists", async () => {
   
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    
    renderWithProviders();
    
  
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

 
  test("renders list of pokemons", async () => {
   
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
          { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
        ]
      }),
    });

    renderWithProviders();

   
    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    expect(screen.getByText(/squirtle/i)).toBeInTheDocument();
  });


  test("selects a pokemon when clicked", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }
        ]
      }),
    });

    renderWithProviders();

    
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    const pikachuButton = screen.getByRole('button', { name: /pikachu/i });
    fireEvent.click(pikachuButton);
    
    
    await waitFor(() => {
      expect(screen.getByText(/pokémon seleccionado/i)).toBeInTheDocument();
    });
  });


  test("shows selected pokemon section when selected", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" }
        ]
      }),
    });

    renderWithProviders({
      selected: { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon seleccionado/i)).toBeInTheDocument();
    });
  });

  test("shows more info button when pokemon selected", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" }
        ]
      }),
    });

    renderWithProviders({
      selected: { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
    });

    await waitFor(() => {
      expect(screen.getByText(/más información/i)).toBeInTheDocument();
    });
  });


  test("renders correctly with empty list", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ results: [] }),
    });

    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
    
    expect(screen.getByText(/lista de pokémons/i)).toBeInTheDocument();
  });


  test("matches snapshot", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        ]
      }),
    });

    const { container } = renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  test("navigates to more info page when clicking more info button", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }
        ]
      }),
    });

    renderWithProviders({
      selected: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
    });

   
    await waitFor(() => {
      expect(screen.getByText(/más información/i)).toBeInTheDocument();
    });

 
    const moreInfoButton = screen.getByText(/más información/i);
    fireEvent.click(moreInfoButton);


    expect(mockNavigate).toHaveBeenCalledWith('/more/pikachu');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});