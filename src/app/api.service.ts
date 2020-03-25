import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  endpoint: string = 'https://api.steinhq.com/v1/storages/5e6fd170b88d3d04ae081593/Raw_Data';
  endpoint2: string = 'https://api.rootnet.in/covid19-in/unofficial/covid19india.org';
  // endpoint: string = 'api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }



  // Get all students
  GeAllPatients() {
    return this.http.get(`${this.endpoint}`);
  }
  GeAllPatientscovid19() {
    return this.http.get(`${this.endpoint2}`);
  }

  // Get student
  GetStudent(id): Observable<any> {
    let API_URL = `${this.endpoint}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.errorMgmt)
      )
  }


  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
