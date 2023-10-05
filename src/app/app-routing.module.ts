import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddTarefaComponent } from './components/adicionar-tarefa/adicionar-tarefa.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  // { path: 'add-task', component: AddTarefaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
