// src/store/__test__/PokemonSlice.test.js
import pokemonReducer, {
  fetchPokemons,
  fetchPokemonByName,
  selectPokemon,
} from "../PokemonSlice";
import { configureStore } from "@reduxjs/toolkit";

// ========================================
// MOCK fetch global
// ========================================
global.fetch = jest.fn();

// ========================================
// MOCK POKEMON DATA
// ========================================
const mockPokemonList = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
];

const mockPokemonDetails = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  },
  types: [{ type: { name: "electric" } }],
  abilities: [{ ability: { name: "static" } }],
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } }
  ]
};

// ========================================
// HELPER: Create test store
// ========================================
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
    },
    preloadedState: {
      pokemon: {
        list: [],
        selected: null,
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
        ...preloadedState,
      },
    },
  });
};

// ========================================
// TESTS
// ========================================
describe("PokemonSlice", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  // ========================================
  // TEST: Initial state
  // ========================================
  describe("Initial State", () => {
    test("should return the initial state", () => {
      const state = pokemonReducer(undefined, { type: "unknown" });
      
      expect(state).toEqual({
        list: [],
        selected: null,
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      });
    });
  });

  // ========================================
  // TEST: selectPokemon reducer
  // ========================================
  describe("selectPokemon", () => {
    test("should select a pokemon", () => {
      const initialState = {
        list: mockPokemonList,
        selected: null,
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const pokemon = mockPokemonList[0];
      const state = pokemonReducer(initialState, selectPokemon(pokemon));

      expect(state.selected).toEqual(pokemon);
      expect(state.selected.name).toBe("bulbasaur");
    });

    test("should update selected pokemon", () => {
      const initialState = {
        list: mockPokemonList,
        selected: mockPokemonList[0],
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const newPokemon = mockPokemonList[1];
      const state = pokemonReducer(initialState, selectPokemon(newPokemon));

      expect(state.selected).toEqual(newPokemon);
      expect(state.selected.name).toBe("charmander");
    });
  });

  // ========================================
  // TEST: fetchPokemons async thunk
  // ========================================
  describe("fetchPokemons", () => {
    test("should handle fetchPokemons.pending", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: false,
        error: "Previous error",
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const state = pokemonReducer(initialState, fetchPokemons.pending());

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    test("should handle fetchPokemons.fulfilled", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: true,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const state = pokemonReducer(
        initialState,
        fetchPokemons.fulfilled(mockPokemonList, "requestId")
      );

      expect(state.loading).toBe(false);
      expect(state.list).toEqual(mockPokemonList);
      expect(state.list.length).toBe(3);
    });

    test("should handle fetchPokemons.rejected", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: true,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const errorMessage = "Network error";
      const state = pokemonReducer(
        initialState,
        fetchPokemons.rejected(new Error(errorMessage), "requestId")
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test("should fetch pokemons successfully with real API call", async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ results: mockPokemonList }),
      });

      const store = createTestStore();
      await store.dispatch(fetchPokemons());

      const state = store.getState().pokemon;
      expect(state.loading).toBe(false);
      expect(state.list).toEqual(mockPokemonList);
      expect(state.error).toBe(null);
    });

    test("should handle API error", async () => {
      global.fetch.mockRejectedValueOnce(new Error("API Error"));

      const store = createTestStore();
      await store.dispatch(fetchPokemons());

      const state = store.getState().pokemon;
      expect(state.loading).toBe(false);
      expect(state.error).toBe("API Error");
      expect(state.list).toEqual([]);
    });
  });

  // ========================================
  // TEST: fetchPokemonByName async thunk
  // ========================================
  describe("fetchPokemonByName", () => {
    test("should handle fetchPokemonByName.pending", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: "Previous error",
      };

      const state = pokemonReducer(
        initialState,
        fetchPokemonByName.pending("requestId", "pikachu")
      );

      expect(state.loadingDetails).toBe(true);
      expect(state.errorDetails).toBe(null);
    });

    test("should handle fetchPokemonByName.fulfilled", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: true,
        errorDetails: null,
      };

      const state = pokemonReducer(
        initialState,
        fetchPokemonByName.fulfilled(mockPokemonDetails, "requestId", "pikachu")
      );

      expect(state.loadingDetails).toBe(false);
      expect(state.pokemonDetails).toEqual(mockPokemonDetails);
      expect(state.pokemonDetails.name).toBe("pikachu");
    });

    test("should handle fetchPokemonByName.rejected", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: true,
        errorDetails: null,
      };

      const errorMessage = "Pokemon not found";
      const state = pokemonReducer(
        initialState,
        fetchPokemonByName.rejected(
          new Error(errorMessage),
          "requestId",
          "invalidpokemon"
        )
      );

      expect(state.loadingDetails).toBe(false);
      expect(state.errorDetails).toBe(errorMessage);
    });

   
    test("should handle API error when fetching by name", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Pokemon not found"));

      const store = createTestStore();
      await store.dispatch(fetchPokemonByName("invalidpokemon"));

      const state = store.getState().pokemon;
      expect(state.loadingDetails).toBe(false);
      expect(state.errorDetails).toBe("Pokemon not found");
      expect(state.pokemonDetails).toBe(null);
    });
  });

  // ========================================
  // TEST: Integration tests
  // ========================================
  describe("Integration Tests", () => {
    test("should handle multiple operations in sequence", async () => {
      global.fetch
        .mockResolvedValueOnce({
          json: async () => ({ results: mockPokemonList }),
        })
        .mockResolvedValueOnce({
          json: async () => mockPokemonDetails,
        });

      const store = createTestStore();

      // Fetch list of pokemons
      await store.dispatch(fetchPokemons());
      let state = store.getState().pokemon;
      expect(state.list).toEqual(mockPokemonList);

      // Select a pokemon
      store.dispatch(selectPokemon(mockPokemonList[0]));
      state = store.getState().pokemon;
      expect(state.selected).toEqual(mockPokemonList[0]);

      // Fetch details of a pokemon
      await store.dispatch(fetchPokemonByName("pikachu"));
      state = store.getState().pokemon;
      expect(state.pokemonDetails).toEqual(mockPokemonDetails);
    });

    test("should maintain separate loading states", () => {
      const store = createTestStore();

      // Start fetching list
      store.dispatch(fetchPokemons.pending("requestId1"));
      let state = store.getState().pokemon;
      expect(state.loading).toBe(true);
      expect(state.loadingDetails).toBe(false);

      // Start fetching details
      store.dispatch(fetchPokemonByName.pending("requestId2", "pikachu"));
      state = store.getState().pokemon;
      expect(state.loading).toBe(true);
      expect(state.loadingDetails).toBe(true);
    });

    test("should maintain separate error states", () => {
      const store = createTestStore();

      // Error fetching list
      store.dispatch(fetchPokemons.rejected(new Error("List error"), "requestId1"));
      let state = store.getState().pokemon;
      expect(state.error).toBe("List error");
      expect(state.errorDetails).toBe(null);

      // Error fetching details
      store.dispatch(
        fetchPokemonByName.rejected(new Error("Details error"), "requestId2", "pikachu")
      );
      state = store.getState().pokemon;
      expect(state.error).toBe("List error");
      expect(state.errorDetails).toBe("Details error");
    });
  });

  // ========================================
  // TEST: Edge cases
  // ========================================
  describe("Edge Cases", () => {
    test("should handle selecting null pokemon", () => {
      const initialState = {
        list: mockPokemonList,
        selected: mockPokemonList[0],
        loading: false,
        error: null,
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const state = pokemonReducer(initialState, selectPokemon(null));
      expect(state.selected).toBe(null);
    });

    test("should handle empty pokemon list", async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ results: [] }),
      });

      const store = createTestStore();
      await store.dispatch(fetchPokemons());

      const state = store.getState().pokemon;
      expect(state.list).toEqual([]);
      expect(state.loading).toBe(false);
    });

    test("should clear previous error on new pending request", () => {
      const initialState = {
        list: [],
        selected: null,
        loading: false,
        error: "Previous error",
        pokemonDetails: null,
        loadingDetails: false,
        errorDetails: null,
      };

      const state = pokemonReducer(initialState, fetchPokemons.pending("requestId"));
      expect(state.error).toBe(null);
    });
  });
});