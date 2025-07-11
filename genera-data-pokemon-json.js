const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';

async function fetchAndSavePokemonData() {
  try {
    // Obtener la lista de Pokémon
    const response = await axios.get(apiUrl);
    const pokemonList = response.data.results;

    // Obtener detalles de cada Pokémon
    const detailedPokemonList = await Promise.all(
      pokemonList.map(async (pokemon, index) => {
        const details = await axios.get(pokemon.url);
        return {
          id: index + 1,
          name: pokemon.name,
          url: pokemon.url,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
          types: details.data.types.map((typeInfo) => typeInfo.type.name),
        };
      })
    );

    // Guardar los datos en un archivo JSON
    fs.writeFileSync('original-pokemon-data.json', JSON.stringify(detailedPokemonList, null, 2));
    console.log('Datos guardados en pokemon-data.json');
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
}

fetchAndSavePokemonData();
