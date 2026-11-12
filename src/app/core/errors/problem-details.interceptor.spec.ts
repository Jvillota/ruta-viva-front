import { HttpErrorResponse } from '@angular/common/http';
import { describeError } from './problem-details.interceptor';

describe('describeError', () => {
  it('combines title and detail of a ProblemDetails body', () => {
    const error = new HttpErrorResponse({
      status: 409,
      error: { title: 'La operación no es posible en el estado actual', detail: "Cannot start a service order in status 'Quoted'." },
    });

    expect(describeError(error)).toBe("La operación no es posible en el estado actual: Cannot start a service order in status 'Quoted'.");
  });

  it('uses validation messages when there is no detail', () => {
    const error = new HttpErrorResponse({ status: 400, error: { title: 'Datos inválidos', errors: { Km: ['The Km field is required.'] } } });

    expect(describeError(error)).toBe('Datos inválidos: The Km field is required.');
  });

  it('explains a network failure', () => {
    expect(describeError(new HttpErrorResponse({ status: 0 }))).toBe('No hay conexión con el servidor.');
  });
});
