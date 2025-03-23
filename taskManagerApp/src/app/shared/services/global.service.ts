import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})

export class GlobalService{

    constructor(private messageService:MessageService){}

    showToast(severity:string,summary:string,detail:string){
        this.messageService.add({ severity: severity, summary: summary, detail: detail });
    }
    showToastGlobalError(){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something Went wrong" })
    }
}