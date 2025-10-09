import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPokemonByName } from "../../store/PokemonSlice";
import { BackButton, Container, InfoSection, InfoText, LoadingMessage, PokemonCard, PokemonImage, PokemonName, StatBarBackground, StatBarFill, StatItem, StatName, StatsSection, StatsTitle, TypeBadge, TypesContainer} from './style/MoreStyles'
import Header from "../../components/Header/Header";

function MoreInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pokemonDetails, loadingDetails, errorDetails } = useSelector(
    (state) => state.pokemon
  );

  useEffect(() => {
    console.log(id);
    
    if (id) {
      dispatch(fetchPokemonByName(id));
    }

   
  }, [id, dispatch]);

  if (loadingDetails) {
    return (
      <div>
        <Header title={`Buscando ${id}...`} />
        <LoadingMessage>Cargando detalles...</LoadingMessage>
      </div>
    )
  }

   const handleGoBack = () => {
    navigate('/home')
  }

  if (errorDetails) {
    return (
      <div>
        <Header title="Error" />
        <div style={{ padding: '20px' }}>
          <p style={{ color: 'red' }}>Error: {errorDetails}</p>
          <button onClick={handleGoBack}>Volver al inicio</button>
        </div>
      </div>
    )
  }

  if (!pokemonDetails) {
    return (
      <div>
        <Header title="Pokémon no encontrado" />
        <button onClick={handleGoBack}>Volver al inicio</button>
      </div>
    )
  }


  return <div>
     <div>
      <Header title={pokemonDetails.name.toUpperCase()} />
      
      <Container>
        <BackButton onClick={handleGoBack}>
          ← Volver
        </BackButton>

        <PokemonCard>
          {/* Imagen del pokémon */}
          <PokemonImage 
            src={pokemonDetails.sprites.front_default} 
            alt={pokemonDetails.name}
          />

          {/* Nombre */}
          <PokemonName>{pokemonDetails.name}</PokemonName>

          {/* Información básica */}
          <InfoSection>
            <InfoText>
              <strong>ID:</strong> #{pokemonDetails.id}
            </InfoText>
            <InfoText>
              <strong>Altura:</strong> {pokemonDetails.height / 10} m
            </InfoText>
            <InfoText>
              <strong>Peso:</strong> {pokemonDetails.weight / 10} kg
            </InfoText>
            
            {/* Tipos */}
            <InfoText>
              <strong>Tipo:</strong>
              <TypesContainer>
                {pokemonDetails.types.map((t, index) => (
                  <TypeBadge 
                    key={t.type.name}
  
                    first={index === 0}
                  >
                    {t.type.name}
                  </TypeBadge>
                ))}
              </TypesContainer>
            </InfoText>

            {/* Habilidades */}
            <InfoText>
              <strong>Habilidades:</strong>{' '}
              {pokemonDetails.abilities.map(a => a.ability.name).join(', ')}
            </InfoText>

            {/* Estadísticas */}
            <StatsSection>
              <StatsTitle>Estadísticas:</StatsTitle>
              {pokemonDetails.stats.map((stat) => (
                <StatItem key={stat.stat.name}>
                  <StatName>{stat.stat.name}:</StatName> {stat.base_stat}
                </StatItem>
              ))}
            </StatsSection>
          </InfoSection>
        </PokemonCard>
      </Container>
    </div>

  </div>;
}

export default MoreInfo;
