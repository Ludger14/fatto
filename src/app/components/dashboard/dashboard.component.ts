
import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from "@angular/platform-browser";
import { AddTarefaComponent } from '../adicionar-tarefa/adicionar-tarefa.component';
import { Tarefas } from 'src/app/model/Tarefas.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { ConfirmacaoDialogComponent } from '../confirmacao-dialog/confirmacao-dialog.component';
import { CdkDragDrop, DragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{

    isCollapsed = false;

    tarefas: Array<Tarefas> = [];

    constructor( private dialog: MatDialog, public dialogRef: MatDialogRef<AddTarefaComponent>, private alertModalService: AlertModalService,
        public sanitizer: DomSanitizer, private dashboardService: DashboardService,
        ){
    }
    

    ngOnInit() {        
        this.dashboardService.getAllTask().subscribe((data: HttpResponse<Tarefas[]>) => {
            this.tarefas = data.body;
        });
    }

    ngOnDestroy(): void {
    }  

    addTask(){
        this.dialogRef = this.dialog.open(AddTarefaComponent, {
            width: "30rem",
            data: {
                title: 'Adicionar Tarefa',
                stButton: 'Create',
            },
        })
        this.dialogRef.afterClosed().subscribe(data => {
            if(data){
                this.dashboardService.getAllTask().subscribe((data: HttpResponse<Tarefas[]>) => {
                    this.tarefas = data.body;
                });
            }
        });
    }

    editTask(index: number, tarefa: Tarefas){
        const dialogRef = this.dialog.open(AddTarefaComponent, {
            width: '30rem',
            data: {
              title: 'Editar Tarefa',
              id: tarefa.id,
              nome: tarefa.nome,
              custo: tarefa.custo,
              dtLimite: tarefa.dtLimite,
              ordem_apresentacao: tarefa.ordem_apresentacao,
              stButton: 'Edit',
            }
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.tarefas[index] = result;
            }
        });
    }

    deleteTask(index: number, tarefa: Tarefas){
        const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
            width: '30rem',
            data: {
              title: 'Deletar Tarefa',
              nome: tarefa.nome,
              custo: tarefa.custo,
              dtLimite: tarefa.dtLimite,
              ordem_apresentacao: tarefa.ordem_apresentacao,
            }
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'Sim') {
                this.dashboardService.getAllTask().subscribe((data: HttpResponse<Tarefas[]>) => {
                    this.tarefas = data.body;
                });
            }
        });
    }

    reOrdemList(event: CdkDragDrop<Tarefas[]>){
        moveItemInArray(this.tarefas, event.previousIndex, event.currentIndex);
        this.tarefas.forEach((tarefa, index) => {
            tarefa.ordem_apresentacao = index + 1;
        });
        this.dashboardService.salvarTaskOrder(this.tarefas).subscribe(response => {
            this.dashboardService.getAllTask().subscribe((data: HttpResponse<Tarefas[]>) => {
                this.tarefas = data.body;
            });
        });
    }

    upTask(index: number){
        if (index > 0) {
            [this.tarefas[index], this.tarefas[index - 1]] = [this.tarefas[index - 1], this.tarefas[index]];
            this.tarefas.forEach((tarefa, i) => {
                tarefa.ordem_apresentacao = i + 1;
            });
            this.dashboardService.salvarTaskOrder(this.tarefas).subscribe(response => {
                this.dashboardService.getAllTask().subscribe((data: HttpResponse<Tarefas[]>) => {
                    this.tarefas = data.body;
                });
            });
        }
    }

    downTask(index: number){
        if (index < this.tarefas.length - 1) {
            [this.tarefas[index], this.tarefas[index + 1]] = [this.tarefas[index + 1], this.tarefas[index]];
            this.tarefas.forEach((tarefa, i) => {
                tarefa.ordem_apresentacao = i + 1;
            });
            this.dashboardService.salvarTaskOrder(this.tarefas).subscribe(response => {
                this.dashboardService.getAllTask().subscribe((data: HttpResponse<Tarefas[]>) => {
                    this.tarefas = data.body;
                });
            });
        }
    }

}
