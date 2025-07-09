import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemonList: any[] = [];
  filteredPokemonList: any[] = [];
  searchQuery: string = '';
  pageSize: number = 8;
  currentPage: number = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();
  }

  // Cargar la lista de Pokémon
  loadPokemon(): void {
    this.pokemonService.getPokemonList().subscribe((data) => {
      this.pokemonList = data;
      this.filteredPokemonList = [...this.pokemonList];
    });
  }

  // Filtrar por búsqueda
  onSearch(): void {
    this.filteredPokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Ordenar por nombre
  onSort(): void {
    this.filteredPokemonList.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Eliminar temporalmente un Pokémon
  onDelete(pokemon: any): void {
    this.filteredPokemonList = this.filteredPokemonList.filter(
      (p) => p.id !== pokemon.id
    );
  }

  // Obtener Pokémon para la página actual
  getPaginatedPokemon(): any[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPokemonList.slice(start, end);
  }

  // Cambiar página
  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
