import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-task-counts',
    templateUrl: './task-counts.component.html',
    styleUrls: ['./task-counts.component.scss']
})


export class TaskCountComponent implements OnInit{

    @Input() taskCounts = {}

    constructor(){}

    ngOnInit(): void {
        
    }

}