import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EmployeeService {
  constructor(private http: HttpClient) {
  }

  private baseUrl = 'http://localhost:3000/employees';

  private static handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = '';
    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `Client Side Error  ${errorResponse.message}`;
      console.error(errorMessage);
    } else {
      errorMessage = `Server Side Error: ${errorResponse.message}`;
      console.error(errorMessage);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(this.baseUrl)
      .pipe(
        catchError(EmployeeService.handleError)
      );
  }

  getEmployeeById(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${this.baseUrl}/${id}`)
      .pipe(catchError(EmployeeService.handleError));
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.baseUrl, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(EmployeeService.handleError));
  }

  updateEmployee(employee: IEmployee): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(EmployeeService.handleError));
  }

  deleteEmployee(id): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(EmployeeService.handleError));
  }
}
