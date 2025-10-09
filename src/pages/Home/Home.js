import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
// ========================================
// IMPORTAR HOOKS DE REACT-REDUX
// ========================================
import { useDispatch, useSelector } from 'react-redux'

// useDispatch: para ENVIAR acciones (como fetchPokemons)
// useSelector: para LEER datos del store
import { fetchPokemons, selectPokemon } from '../../store/PokemonSlice'
import { Container, PokemonButton, PokemonItem, PokemonList, Section, SelectedPokemon, Title } from './style/HomeStyle'
import { useNavigate } from 'react-router-dom'

// ========================================
// IMPORTAR ACCIONES DEL SLICE
// ========================================

// fetchPokemons: acción asíncrona para traer pokémons de la API
// selectPokemon: acción para seleccionar un pokémon

function Home() {
  // ========================================
  // 1. CONFIGURAR DISPATCH
  // ========================================
  // dispatch es como un "mensajero" que envía acciones al store
  const dispatch = useDispatch()
 const navigate = useNavigate(); 
  // ========================================
  // 2. LEER DATOS DEL STORE CON useSelector
  // ========================================
  // Extraemos los datos que necesitamos del store
  // state.pokemon viene de la clave que pusiste en configureStore
  const { list, selected, loading, error } = useSelector((state) => state.pokemon)
  // list: array de pokémons
  // selected: pokémon seleccionado (o null)
  // loading: true/false si está cargando
  // error: mensaje de error (o null)

  // ========================================
  // 3. LLAMAR LA API CUANDO EL COMPONENTE SE MONTA
  // ========================================
  useEffect(() => {
    // dispatch(fetchPokemons()) ejecuta la acción asíncrona
    // Esto automáticamente:
    // 1. Pone loading en true
    // 2. Llama a la API
    // 3. Guarda los pokémons en list
    dispatch(fetchPokemons())

    
  }, [dispatch]) // Se ejecuta solo una vez al montar el componente

  // ========================================
  // 4. FUNCIÓN PARA MANEJAR CLICK EN POKÉMON
  // ========================================
  const handleSelectPokemon = (pokemon) => {
    // Enviamos la acción selectPokemon con el pokémon como payload
    dispatch(selectPokemon(pokemon))
  }

  const moreInfo = (name) => {
    navigate(`/more/${name}`)
    
  }

  // ========================================
  // 5. RENDERIZADO CONDICIONAL
  // ========================================
  
  // Si está cargando, mostramos un mensaje
  if (loading) {
    return (
      <div>
        <Header title="poke Api"></Header>
        <p>Cargando pokémons...</p>
      </div>
    )
  }

  // Si hay un error, lo mostramos
  if (error) {
    return (
      <div>
        <Header title="poke Api"></Header>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  // ========================================
  // 6. RENDERIZADO NORMAL
  // ========================================
  return (
    <Container>
      <Header title="Poké API" />

      {/* Pokémon seleccionado */}
      {selected && (
        <SelectedPokemon>
          <Title>Pokémon Seleccionado:</Title>
          <p><strong>{selected.name}</strong></p>
          <PokemonButton selected onClick={()=>moreInfo(selected.name)}>Más información</PokemonButton>
        </SelectedPokemon>
      )}

      {/* Lista de pokémons */}
      <Section>
        <Title>Lista de Pokémons:</Title>
        <PokemonList>
          {list.map((pokemon) => (
            <PokemonItem key={pokemon.name}>
              <PokemonButton
                selected={selected?.name === pokemon.name}
                onClick={() => handleSelectPokemon(pokemon)}
              >
                {pokemon.name}
              </PokemonButton>
            </PokemonItem>
          ))}
        </PokemonList>
      </Section>
    </Container>
  )
}

export default Home