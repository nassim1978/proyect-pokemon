import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // Obtener los primeros 151 Pokémon
  getPokemonList(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=151`).pipe(
      map((response) =>
        response.results.map((pokemon: any, index: number) => ({
          id: index + 1,
          name: pokemon.name,
          url: pokemon.url,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        }))
      )
    );
  }

  // Obtener los detalles de un Pokémon por URL
  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  // Obtener los detalles de todos los Pokémon (incluyendo tipos)
  getPokemonListWithDetails(): Observable<any[]> {
    return this.getPokemonList().pipe(
      switchMap((pokemonList) => {
        const requests = pokemonList.map((pokemon) =>
          this.getPokemonDetails(pokemon.url)
        );
        return forkJoin(requests).pipe(
          map((details) =>
            details.map((detail, index) => ({
              ...pokemonList[index],
              types: detail.types.map((typeInfo: any) => typeInfo.type.name),
            }))
          )
        );
      })
    );
  }
}
