import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { ProblemDetails } from '../api/models';

/** Turns an API error (ProblemDetails) into a readable message. Exported for unit tests. */
export function describeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No hay conexión con el servidor.';
  }

  const problem = (error.error ?? {}) as ProblemDetails;
  const validation = problem.errors ? Object.values(problem.errors).flat().join(' ') : '';
  return [problem.title, problem.detail ?? validation].filter(Boolean).join(': ') || `Error ${error.status}`;
}

/** Shows every API error in a snackbar and rethrows it so the caller can still react (e.g. reload). */
export const problemDetailsInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        snackBar.open(describeError(error), 'Cerrar', { duration: 6000, panelClass: 'snack-error' });
      }
      return throwError(() => error);
    }),
  );
};
