import { MatPaginatorIntl } from '@angular/material/paginator';

export function getSpanishPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Pokémon por página:'; // Cambiar "Items per page" a español
  paginatorIntl.nextPageLabel = 'Siguiente página'; // Cambiar "Next page" a español
  paginatorIntl.previousPageLabel = 'Página anterior'; // Cambiar "Previous page" a español
  paginatorIntl.firstPageLabel = 'Primera página'; // Cambiar "First page" a español
  paginatorIntl.lastPageLabel = 'Última página'; // Cambiar "Last page" a español

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

  return paginatorIntl;
}
