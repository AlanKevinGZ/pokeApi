import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const BackButton = styled.button`
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

export const PokemonCard = styled.div`
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const PokemonImage = styled.img`
  width: 200px;
  display: block;
  margin: 0 auto;
`;

export const PokemonName = styled.h2`
  text-align: center;
  text-transform: uppercase;
  color: #fff;
  margin: 20px 0;
`;

export const InfoSection = styled.div`
  margin-top: 20px;
`;

export const InfoText = styled.p`
  font-size: 16px;
  margin: 10px 0;
  color: #fff;
`;

export const TypeBadge = styled.span`
  background:  '#e0e0e0';
  padding: 5px 10px;
  border-radius: 5px;
  margin-left: '5px';
  display: inline-block;
  color: white;
  font-weight: bold;
  text-transform: capitalize;
`;

export const StatsSection = styled.div`
  margin-top: 20px;
`;

export const StatsTitle = styled.h3`
  color: #fff;
  margin-bottom: 15px;
`;

export const StatItem = styled.div`
  margin-bottom: 10px;
`;

export const StatName = styled.strong`
  text-transform: capitalize;
  color: #fff;
`;

export const StatBarBackground = styled.div`
  background: #e0e0e0;
  height: 10px;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
`;

export const StatBarFill = styled.div`
  background:  '#4CAF50';
  height: 100%;
  width: 0%;
  border-radius: 5px;
  transition: width 0.3s ease;
`;


export const LoadingMessage = styled.p`
  padding: 20px;
  font-size: 18px;
  color: #666;
`;

export const ErrorMessage = styled.p`
  color: #fff;
  font-size: 16px;
  padding: 20px;
`;


export const TypesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 5px;
`;