import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = `${environment.apiUrl}/pokemon`;

  constructor(private http: HttpClient) {}

//  getPokemonList(): Observable<any[]> {
//   const url = `${this.apiUrl}?timestamp=${new Date().getTime()}`; // Agregar un parámetro único
//   return this.http.get<any[]>(url).pipe(
//     catchError((error) => {
//       console.error('Error al obtener la lista de Pokémon:', error);
//       return throwError(() => new Error('Error al obtener la lista de Pokémon'));
//     })
//   );
// }
getPokemonList(): Observable<any[]> {
  const url = `${this.apiUrl}?timestamp=${new Date().getTime()}`; // Agregar un parámetro único
  return this.http.get<any[]>(url).pipe(
    catchError((error) => {
      console.error('Error al obtener la lista de Pokémon:', error);
      return throwError(() => new Error('Error al obtener la lista de Pokémon'));
    })
  );
}


  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener detalles del Pokémon:', error);
        return throwError(() => new Error('Error al obtener detalles del Pokémon'));
      })
    );
  }

  getPokemonListWithDetails(): Observable<any[]> {
    return this.getPokemonList().pipe(
      switchMap((pokemonList) => {
        const requests = pokemonList.map((pokemon) =>
          this.getPokemonDetails(pokemon.url).pipe(
            catchError((error) => {
              console.error(`Error al obtener detalles del Pokémon ${pokemon.name}:`, error);
              return throwError(() => new Error(`Error al obtener detalles del Pokémon ${pokemon.name}`));
            })
          )
        );
        return forkJoin(requests).pipe(
          map((details) =>
            details.map((detail, index) => ({
              ...pokemonList[index],
              types: detail.types.map((typeInfo: any) => typeInfo.type.name),
            }))
          )
        );
      }),
      catchError((error) => {
        console.error('Error al obtener la lista de Pokémon con detalles:', error);
        return throwError(() => new Error('Error al obtener la lista de Pokémon con detalles'));
      })
    );
  }

  deletePokemon(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    catchError((error) => {
      console.error(`Error al eliminar el Pokémon con ID ${id}:`, error);
      return throwError(() => new Error(`Error al eliminar el Pokémon con ID ${id}`));
    })
  );
}


 restoreData(): Observable<string> {
  return this.http.post(`${environment.apiUrl}/restore-data`, {}, { responseType: 'text' }).pipe(
    catchError((error) => {
      console.error('Error al restaurar los datos:', error);
      return throwError(() => new Error('Error al restaurar los datos'));
    })
  );
}




}


