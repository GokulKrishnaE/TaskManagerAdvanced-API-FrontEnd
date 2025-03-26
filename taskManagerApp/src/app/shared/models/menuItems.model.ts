export const Menuitems = [
    {label:'Dashboard',route:'/dashboard', roles: ['Admin','User','GlobalAdmin'], icon:'pi pi-home'},
    {label:'Priority View',route:'/priority-view', roles: ['Admin','User','GlobalAdmin'], icon:'pi pi-list'},
    {label:'Calendar View',route:'/calendar-view', roles: ['Admin','User','GlobalAdmin'], icon: 'pi pi-calendar'},
    {label:'People',route:'/people', roles: ['Admin','GlobalAdmin'], icon:'pi pi-users'},
    {label:'Roles',route:'/roles', roles: ['GlobalAdmin'], icon:'pi pi-shield'},
    {label:'Themes',route:'/themes', roles:['CMS','GlobalAdmin'],icon:'pi pi-palette'},
    {label:'Customize',route:'/cms-home', roles:['CMS','GlobalAdmin'],icon:'pi pi-file'}
]