import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AuthService } from "../../services/auth.service";

@Component(
    {
        selector: 'app-task-calendar-view',
        templateUrl: './task-calendar-view.component.html',
        styleUrls: ['./task-calendar-view.component.scss']
    }
)


export class TaskCalendarViewComponent{

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin], 
        initialView: 'dayGridMonth',
        events: []
      };

      constructor(
        private apiService:ApiService,
        private authService:AuthService
    ){}


      ngOnInit() {
        this.loadTasks();
      }
    
      loadTasks() {
        this.apiService.get(`tasks/user-tasks/${this.authService.getUserId()}`).subscribe((tasks:any) => {
          this.calendarOptions.events = tasks.allTasks.map((task:any) => ({
            title: task.taskName,
            date: task.deadline // Ensure format is YYYY-MM-DD
          }));
        });
      }
}