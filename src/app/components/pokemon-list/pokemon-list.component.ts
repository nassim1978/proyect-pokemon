import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  searchQuery: string = ''; // Texto ingresado en el campo de búsqueda
  selectedType: string = 'all'; // Tipo seleccionado, por defecto "all"

  pokemonList: any[] = [];
  filteredPokemonList: any[] = [];
  paginatedPokemon: any[] = [];

  pageSize: number = 8; // Cantidad de Pokémon por página
  currentPage: number = 0; // Página actual
 

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();
  }

  // Cargar la lista de Pokémon con detalles (incluyendo tipos)
  loadPokemon(): void {
    this.pokemonService.getPokemonListWithDetails().subscribe((data) => {
      this.pokemonList = data;
      this.filteredPokemonList = [...this.pokemonList];
      this.updatePaginatedPokemon();
    });
  }

  // Actualizar la lista paginada
  updatePaginatedPokemon(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPokemon = this.filteredPokemonList.slice(start, end);
  }

  // Filtrar por tipo de Pokémon
filterByType(type: string): void {
  this.selectedType = type; // Actualizar el tipo seleccionado
  this.searchQuery = ''; // Vaciar el campo de búsqueda

  if (this.selectedType === 'all') {
    // Mostrar todos los Pokémon si el tipo es "all"
    this.filteredPokemonList = [...this.pokemonList];
  } else {
    // Filtrar por tipo
    this.filteredPokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.types.includes(this.selectedType)
    );
  }

  this.currentPage = 0; // Reiniciar a la primera página
  this.updatePaginatedPokemon(); // Actualizar la lista paginada
}


 onSearch(event: Event): void {
  const inputElement = event.target as HTMLInputElement; // Aseguramos que event.target es un HTMLInputElement
  const searchQuery = inputElement.value; // Obtenemos el valor del input

  this.searchQuery = searchQuery;

  if (this.selectedType === 'all') {
    // Búsqueda general
    this.filteredPokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  } else {
    // Búsqueda por tipo
    this.filteredPokemonList = this.pokemonList.filter(
      (pokemon) =>
        pokemon.types.includes(this.selectedType) &&
        pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  this.currentPage = 0; // Reiniciar a la primera página
  this.updatePaginatedPokemon();
}




  // Eliminar temporalmente un Pokémon
  onDelete(pokemon: any): void {
    this.filteredPokemonList = this.filteredPokemonList.filter(
      (p) => p.id !== pokemon.id
    );
    this.updatePaginatedPokemon(); // Actualizar la lista paginada después de eliminar
  }

  // Manejar el cambio de página
  onPageChange(event: any): void {
    this.pageSize = event.pageSize; // Actualizar el tamaño de página
    this.currentPage = event.pageIndex; // Actualizar la página actual
    this.updatePaginatedPokemon(); // Actualizar la lista paginada
  }
}
