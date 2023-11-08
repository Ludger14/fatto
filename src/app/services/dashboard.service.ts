import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefas } from '../model/Tarefas.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //public API = 'https://api-fatto-f0fedcf2976d.herokuapp.com';
  public API = 'https://fatto-server.onrender.com'
  public CONTROLLER = this.API + '/tasks';

  constructor(private http: HttpClient) { }

    saveTask(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.post(this.CONTROLLER + '/createTask', item, { headers: headers, observe: 'response' });
    }

    getAllTask(){
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.get(this.CONTROLLER + '/getAllTask', { headers: headers, observe: 'response' });
    }

    editTask(name: string, item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.put(this.CONTROLLER + '/editTask/' + name, item, { headers: headers, observe: 'response' });
    }

    deleteTask(item: any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.delete(this.CONTROLLER + '/deleteTask/' + item, { headers: headers, observe: 'response' });
    }

    salvarTaskOrder(tarefas: Tarefas[]): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

      return this.http.put(this.CONTROLLER + '/salvarTaskOrder', tarefas, { headers: headers });
  }

}
