import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})


export class ApiService{

    constructor(
        private http:HttpClient
    ) {

    }

    get(path:string):Observable<any[]>{
        return this.http.get<any[]>(path)
    }

    post(path:string, payload:any){
        return this.http.post(path, payload)
    }

    put(path:string, payload:any){
        return this.http.put(path,payload)
    }

    delete(path:string){
        return this.http.delete(path)
    }
}