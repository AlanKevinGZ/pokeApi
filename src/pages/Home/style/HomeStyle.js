
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Section = styled.div`
  margin: 20px 0;
`;

export const Title = styled.h2`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

export const PokemonList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const PokemonItem = styled.li`
  margin: 10px 0;
`;

export const PokemonButton = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? '#4CAF50' : '#008CBA')};
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }

  
`;
export const SelectedPokemon = styled.div`
  padding: 20px;
  margin: 10px 0;
  background: #000;
  border-radius: 8px;
`;