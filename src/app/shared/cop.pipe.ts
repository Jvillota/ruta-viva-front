import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Formats Colombian pesos: 1500000 → "$ 1.500.000". Empty values render as an em dash. */
@Pipe({ name: 'cop' })
export class CopPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return value === null || value === undefined ? '—' : formatter.format(value);
  }
}

const kmFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

/** Formats kilometers: 60450 → "60.450 km". */
@Pipe({ name: 'km' })
export class KmPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return value === null || value === undefined ? '—' : `${kmFormatter.format(value)} km`;
  }
}
