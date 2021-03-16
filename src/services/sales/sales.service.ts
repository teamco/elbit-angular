import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MonthlySales } from './monthly.sales';

@Injectable({
  providedIn: 'root'
})

export class SalesService {
  private salesUrl = 'assets/mock/sales.json';

  constructor(private http: HttpClient) { }

  getSalesByMonth(): Observable<MonthlySales[]>{
    return this.http.get<MonthlySales[]>(this.salesUrl).pipe(catchError(this.handleError));
  }

  private handleError = (err: HttpErrorResponse) => throwError(`An error occurred: ${err}`);
}
