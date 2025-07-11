import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Subject } from 'rxjs';

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
   isLoading: boolean = false;
 

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
 this.restoreData();
 
}
 
restoreData(): void {
  this.pokemonService.restoreData().subscribe(
    (response) => {
      console.log('Respuesta del servidor:', response); // Aquí deberías ver "Datos restaurados correctamente"
      this.loadPokemon(); // Recargar los datos después de restaurarlos
    },
    (error) => {
      console.error('Error al restaurar los datos:', error);
      alert('No se pudieron restaurar los datos. Por favor, intenta nuevamente.');
    }
  );
}




  // Cargar la lista de Pokémon con detalles (incluyendo tipos)
  loadPokemon(): void {
    setTimeout(() => {
      
      this.pokemonService.getPokemonListWithDetails().subscribe(
    (data) => {
      this.pokemonList = data; // Actualizar la lista base
      this.filteredPokemonList = data;//[...this.pokemonList]; // Actualizar la lista filtrada
      this.updatePaginatedPokemon(); // Actualizar la lista paginada
       this.isLoading = true;
    },
    (error) => {
      console.error('Error al cargar la lista de Pokémon:', error);
    }
  );
    }, 1000);
     this.isLoading = false; 
    
  }

  // Actualizar la lista paginada
  updatePaginatedPokemon(): void {
     console.log(" this.pokemonList", this.pokemonList);
      console.log("this.filteredPokemonList",this.filteredPokemonList);
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
  const inputElement = event.target as HTMLInputElement;
  const searchQuery = inputElement.value.trim();

  this.searchQuery = searchQuery;

  // Si el término de búsqueda está vacío, mostramos todos los Pokémon
  if (!this.searchQuery) {
    this.filteredPokemonList = this.pokemonList;
    this.currentPage = 0;
    this.updatePaginatedPokemon();
    return;
  }

  // Filtrar según el tipo seleccionado y el término de búsqueda
  if (this.selectedType === 'all') {
    this.filteredPokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
    );
  } else {
    this.filteredPokemonList = this.pokemonList.filter(
      (pokemon) =>
        pokemon.types.includes(this.selectedType) &&
        pokemon.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
    );
  }

  // Reiniciar la paginación y actualizar la lista visible
  this.currentPage = 0;
  this.updatePaginatedPokemon();
}





  // Eliminar temporalmente un Pokémon
onDelete(pokemon: any): void {
  // Llamar al servicio para eliminar el Pokémon
  this.pokemonService.deletePokemon(pokemon.id).subscribe(
    () => {
      console.log(`Pokémon con ID ${pokemon.id} eliminado correctamente.`);

      // Eliminar el Pokémon de la lista base
      this.pokemonList = this.pokemonList.filter((p) => p.id !== pokemon.id);

      // Eliminar el Pokémon de la lista filtrada
      this.filteredPokemonList = this.filteredPokemonList.filter((p) => p.id !== pokemon.id);

      // Actualizar la lista paginada para reflejar el cambio
      this.updatePaginatedPokemon();

      // Mensaje opcional para el usuario
     // alert(`Pokémon con ID ${pokemon.id} eliminado correctamente.`);
    },
    (error) => {
      console.error('Error al eliminar el Pokémon:', error);
      alert('No se pudo eliminar el Pokémon. Por favor, intenta nuevamente.');
    }
  );
}





  // Manejar el cambio de página
  onPageChange(event: any): void {
    this.pageSize = event.pageSize; // Actualizar el tamaño de página
    this.currentPage = event.pageIndex; // Actualizar la página actual
    this.updatePaginatedPokemon(); // Actualizar la lista paginada
  }
}
