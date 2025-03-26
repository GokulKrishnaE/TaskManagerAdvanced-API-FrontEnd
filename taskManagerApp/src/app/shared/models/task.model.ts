export const Prioriy_Values = [
    {label: 'Lowest', value: 'Lowest'},
    {label: 'Low', value: 'Low'},
    {label: 'Medium', value: 'Medium'},
    {label: 'High', value: 'High'},
    {label: 'Highest', value: 'Highest'},
]

export const Status_Values = [
    {label: 'Todo', value: 'Todo'},
    {label: 'In Progress', value: 'In_Progress'},
    {label: 'Completed', value: 'Completed'},
    {label: 'Waiting Feedback', value: 'Waiting_Feedback'},
    {label: 'Abandoned', value: 'Abandoned'},
    {label: 'On Hold', value: 'On_Hold'},
]

export interface TaskResponse {
    allTasks: any[];
    overdueTasks: any[];
    todayTasks: any[];
    upcomingTasks: any[];
}