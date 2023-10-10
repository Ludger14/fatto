
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Tarefas } from 'src/app/model/Tarefas.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

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

    custoFieldBlurred = false;

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
            nome: ['', [Validators.required, Validators.maxLength(255)]],
            custo: ['', [Validators.required, this.custoValidator()]],
            dtLimite: ['', [Validators.required, this.dataValida]],
        });
    }

    fecharCadastrarDialog(): void{
        this.dialogRef.close();
    }

    
    dataValida(control: FormControl) {
        const inputDate = new Date(control.value);
        
        
        if (isNaN(inputDate.getTime())) {
        return { dataInvalida: true };
        }
    
        return null;
    }

    custoValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value !== null && control.value > 999999999999) {
                return { custoExcedido: true };
            }
            return null;
        };
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
                const nomeTarefa = encodeURIComponent(this.oldName);
                this.dashboardService.editTask(nomeTarefa, this.tarefa).subscribe(data => {
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
