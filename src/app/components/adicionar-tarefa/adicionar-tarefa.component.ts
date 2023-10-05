
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Tarefas } from 'src/app/model/Tarefas.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';

@Component({
    selector: 'app-adicionar-tarefa',
    templateUrl: './adicionar-tarefa.component.html',
    styleUrls: ['./adicionar-tarefa.component.scss']
})
export class AddTarefaComponent implements OnInit {

    form!: FormGroup;

    title: string = '';

    oldName: string = '';

    stButton: string = '';

    disableBox = false;

    tarefa: Tarefas = new Tarefas();

    campoNome!: string | null;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddTarefaComponent>, private alertModalService: AlertModalService,
        @Inject(MAT_DIALOG_DATA) public data: AddTarefaComponent, private dashboardService: DashboardService,
    ) {
        this.title = data['title'];
        this.tarefa.id = data['id'];
        this.tarefa.nome = data['nome'];
        this.oldName = data['nome'];
        this.tarefa.custo = data['custo'];
        this.tarefa.dtLimite = data['dtLimite'];
        this.tarefa.ordem_apresentacao = data['ordem_apresentacao'];
        this.stButton = data['stButton'];
    }

    ngOnInit() {

        this.form = this.fb.group({
            nome: ['', [Validators.required]],
            custo: ['', [Validators.required]],
            dtLimite: ['', [Validators.required]],
        });
    }

    fecharCadastrarDialog(): void{
        this.dialogRef.close();
    }

    submit(form: any) {
        this.disableBox = true;
        if(form.invalid){
            this.disableBox = false;
            this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
        } else{
            if(this.stButton == "Create"){
                this.dashboardService.saveTask(this.tarefa).subscribe(data => {
                    if(data.body.success){
                        this.tarefa.id = data.body.id;
                        this.tarefa.nome = data.body.nome;
                        this.tarefa.custo = data.body.custo;
                        this.tarefa.dtLimite = data.body.dtLimite;
                        this.tarefa.ordem_apresentacao = data.body.ordem_apresentacao;
                        this.tarefa.message = data.body.message;
                        this.alertModalService.mostrarMensagem(data.body.message, this.alertModalService.SUCESSO);
                        this.dialogRef.close(this.tarefa);
                    } else{
                        this.disableBox = false;
                        this.alertModalService.mostrarMensagem(data.body.message, this.alertModalService.ERRO);
                    }
                })
            }else{
                this.dashboardService.editTask(this.oldName, this.tarefa).subscribe(data => {
                    if(data.body.success){
                        this.tarefa.id = data.body.id;
                        this.tarefa.nome = data.body.nome;
                        this.tarefa.custo = data.body.custo;
                        this.tarefa.dtLimite = data.body.dtLimite;
                        this.tarefa.ordem_apresentacao = data.body.ordem_apresentacao;
                        this.tarefa.message = data.body.message;
                        this.alertModalService.mostrarMensagem(data.body.message, this.alertModalService.SUCESSO);
                        this.dialogRef.close(this.tarefa);
                    } else{
                        this.disableBox = false;
                        this.alertModalService.mostrarMensagem(data.body.message, this.alertModalService.ERRO);
                    }
                })
            }                        
        }
    }

}
