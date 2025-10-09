// src/pages/MoreInfo/__test__/MoreInfo.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";
import MoreInfo from "../MoreInfo";
import pokemonReducer from "../../../store/PokemonSlice";

// ========================================
// MOCK THEME
// ========================================
const mockTheme = {
  colors: {
    buttons: '#3498db',
    primary: '#2c3e50',
    secondary: '#ecf0f1',
    text: '#ffffff',
    background: '#f5f5f5',
  },
};

// ========================================
// MOCK useNavigate
// ========================================
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ========================================
// MOCK Header Component
// ========================================
jest.mock("../../../components/Header/Header", () => {
  return function MockHeader({ title }) {
    return <div data-testid="header">{title}</div>;
  };
});

// ========================================
// MOCK fetch global
// ========================================
global.fetch = jest.fn();

// ========================================
// MOCK POKEMON DATA
// ========================================
const mockPokemonData = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  },
  types: [
    {
      type: {
        name: "electric"
      }
    }
  ],
  abilities: [
    {
      ability: {
        name: "static"
      }
    },
    {
      ability: {
        name: "lightning-rod"
      }
    }
  ],
  stats: [
    {
      base_stat: 35,
      stat: {
        name: "hp"
      }
    },
    {
      base_stat: 55,
      stat: {
        name: "attack"
      }
    },
    {
      base_stat: 40,
      stat: {
        name: "defense"
      }
    }
  ]
};

// ========================================
// HELPER: Render with all providers
// ========================================
const renderWithProviders = (initialState = {}, route = "/more/pikachu") => {
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
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path="/more/:id" element={<MoreInfo />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
    store
  };
};

// ========================================
// TESTS
// ========================================
describe("MoreInfo Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    global.fetch.mockResolvedValue({
      json: async () => mockPokemonData,
    });
  });

  // ========================================
  // TEST 1: Shows loading message
  // ========================================
  test("shows loading message when loading details", () => {
    renderWithProviders({ loadingDetails: true });
    
    expect(screen.getByText(/cargando detalles/i)).toBeInTheDocument();
  });

 

  // ========================================
  // TEST 3: Shows back button on error
  // ========================================
  test("shows back button on error and navigates when clicked", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText(/volver al inicio/i)).toBeInTheDocument();
    });

    const backButton = screen.getByText(/volver al inicio/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });


  // ========================================
  // TEST 5: Renders pokemon details
  // ========================================
  test("renders pokemon details correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    // Wait for pokemon name to appear
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    // Verify ID
    expect(screen.getByText(/#25/i)).toBeInTheDocument();
    
    // Verify height (4 / 10 = 0.4m)
    expect(screen.getByText(/0\.4 m/i)).toBeInTheDocument();
    
    // Verify weight (60 / 10 = 6kg)
    expect(screen.getByText(/6 kg/i)).toBeInTheDocument();
  });

  // ========================================
  // TEST 6: Renders pokemon types
  // ========================================
  test("renders pokemon types", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/electric/i)).toBeInTheDocument();
    });
  });

  // ========================================
  // TEST 7: Renders pokemon abilities
  // ========================================
  test("renders pokemon abilities", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/static, lightning-rod/i)).toBeInTheDocument();
    });
  });

  // ========================================
  // TEST 8: Renders pokemon stats
  // ========================================
  test("renders pokemon stats", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/estadísticas/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/hp:/i)).toBeInTheDocument();
    expect(screen.getByText(/attack:/i)).toBeInTheDocument();
    expect(screen.getByText(/defense:/i)).toBeInTheDocument();
  });


  test("renders pokemon image", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    await waitFor(() => {
      const image = screen.getByAltText(/pikachu/i);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockPokemonData.sprites.front_default);
    });
  });


  test("back button navigates to home", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/← volver/i)).toBeInTheDocument();
    });

    const backButton = screen.getByText(/← volver/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test("fetches pokemon by ID from URL params", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        ...mockPokemonData,
        name: "charmander",
        id: 4
      }),
    });

    renderWithProviders({}, "/more/charmander");

    await waitFor(() => {
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/#4/i)).toBeInTheDocument();
  });

  
  test("renders header with pokemon name in uppercase", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    renderWithProviders();

    await waitFor(() => {
      const header = screen.getByTestId("header");
      expect(header).toHaveTextContent("PIKACHU");
    });
  });

 
  test("renders multiple types correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        ...mockPokemonData,
        types: [
          { type: { name: "grass" } },
          { type: { name: "poison" } }
        ]
      }),
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/grass/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/poison/i)).toBeInTheDocument();
  });


  test("matches snapshot", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockPokemonData,
    });

    const { container } = renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});