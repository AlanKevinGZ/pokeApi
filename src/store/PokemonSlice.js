// Importamos las herramientas de Redux Toolkit
// createSlice: crea una "rebanada" del store con actions y reducers automáticos
// createAsyncThunk: maneja operaciones asíncronas (como llamadas a APIs)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ========================================
// ACCIÓN ASÍNCRONA (para llamadas a APIs)
// ========================================
// createAsyncThunk crea una acción que puede hacer operaciones asíncronas
// Retorna automáticamente 3 estados: pending, fulfilled, rejected
export const fetchPokemons = createAsyncThunk(
  "pokemon/fetchPokemons",  // Nombre único de la acción (tipo: string)
                            // Formato: "nombreSlice/nombreAccion"
  
  async () => {             // Función asíncrona que hace el trabajo
    // Hacemos la petición a la API de Pokémon
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    
    // Convertimos la respuesta a JSON
    const data = await res.json();
    
    // Lo que retornes aquí será el "action.payload" en fulfilled
    return data.results;  // Devuelve el array de pokémons
  }
);

export const fetchPokemonByName = createAsyncThunk(
  "pokemon/fetchPokemonByName",  
  async (pokemonName) => {      
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await res.json();
    return data;  
  }
);

// ========================================
// SLICE (Rebanada del Store)
// ========================================
// Un slice contiene: estado inicial, reducers y extra reducers
const pokemonSlice = createSlice({
  
  // Nombre del slice - debe coincidir con la clave en el store
  name: "pokemon",
  
  // Estado inicial de este slice
  // Es como definir las variables iniciales de esta sección
  initialState: {
    list: [],       // Array vacío que guardará la lista de pokémons
    selected: null, // Pokémon actualmente seleccionado (null = ninguno)
    loading: false, // Indica si está cargando datos (false = no está cargando)
    error: null,    // Guarda mensajes de error (null = sin errores)

    
    pokemonDetails: null,
    loadingDetails: false,
    errorDetails: null,
  },

  // ========================================
  // REDUCERS (Acciones Síncronas)
  // ========================================
  // Estas son acciones instantáneas que modifican el estado
  // Redux Toolkit las convierte automáticamente en actions
  reducers: {
    // Acción para seleccionar un pokémon
    selectPokemon: (state, action) => {
      // state: el estado actual de este slice
      // action: contiene { type: '...', payload: datos }
      
      // Modificamos el estado directamente (Redux Toolkit usa Immer por dentro)
      // action.payload es el dato que enviaste al llamar la acción
      state.selected = action.payload;  
    },
  },
  
  // ========================================
  // EXTRA REDUCERS (Acciones Asíncronas)
  // ========================================
  // Aquí manejamos las acciones creadas con createAsyncThunk
  // builder es un objeto que nos permite agregar "casos" para diferentes acciones
  extraReducers: (builder) => {
    builder
      // CASO 1: Cuando fetchPokemons está en estado "pending" (cargando)
      .addCase(fetchPokemons.pending, (state) => {
        // Se ejecuta cuando la petición inicia
        state.loading = true;   // Activamos el indicador de carga
        state.error = null;     // Limpiamos errores previos
      })
      
      // CASO 2: Cuando fetchPokemons está en estado "fulfilled" (exitoso)
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        // Se ejecuta cuando la petición termina exitosamente
        state.loading = false;        // Desactivamos el indicador de carga
        state.list = action.payload;  // Guardamos los pokémons en la lista
                                      // action.payload = lo que retornó la función async
      })
      
      // CASO 3: Cuando fetchPokemons está en estado "rejected" (error)
      .addCase(fetchPokemons.rejected, (state, action) => {
        // Se ejecuta si la petición falla
        state.loading = false;              // Desactivamos el indicador de carga
        state.error = action.error.message; // Guardamos el mensaje de error
      })


       .addCase(fetchPokemonByName.pending, (state) => {
        state.loadingDetails = true;
        state.errorDetails = null;
      })
      .addCase(fetchPokemonByName.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.pokemonDetails = action.payload;  // Guarda los detalles completos
      })
      .addCase(fetchPokemonByName.rejected, (state, action) => {
        state.loadingDetails = false;
        state.errorDetails = action.error.message;
      });

      

  },
});

// ========================================
// EXPORTACIONES
// ========================================

// Exportamos las acciones síncronas (del objeto reducers)
// pokemonSlice.actions contiene todas las acciones creadas automáticamente
// Ahora puedes usar: dispatch(selectPokemon(miPokemon))
export const { selectPokemon } = pokemonSlice.actions;

// Exportamos el reducer (función que actualiza el estado)
// Esto se importará en el store principal
// Por defecto exportamos: pokemonSlice.reducer
export default pokemonSlice.reducer;