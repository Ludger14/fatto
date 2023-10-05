
import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Tarefas } from 'src/app/model/Tarefas.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AlertModalService } from 'src/app/services/alert-modal.service';

@Component({
    selector: 'app-confirmacao-dialog',
    templateUrl: './confirmacao-dialog.component.html',
    styleUrls: ['./confirmacao-dialog.component.scss']
})
export class ConfirmacaoDialogComponent implements OnInit {

    form!: FormGroup;

    title: string = '';

    disableBox = false;

    tarefa: Tarefas = new Tarefas();

    msg: string = '';

    constructor(
        private dashboardService: DashboardService,
        public dialogRef: MatDialogRef<ConfirmacaoDialogComponent>, private alertModalService: AlertModalService,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoDialogComponent,
    ) {
        this.title = data['title'];
        this.tarefa.nome = data['nome'];
        this.tarefa.custo = data['custo'];
        this.tarefa.dtLimite = data['dtLimite'];
        this.tarefa.ordem_apresentacao = data['ordem_apresentacao'];
    }

    ngOnInit() {
    }

    fecharCadastrarDialog(): void{
        this.dialogRef.close();
    }

    salvar(value: string) {
        if (value == 'Sim') {
            this.dashboardService.deleteTask(this.tarefa.nome).subscribe(data => {
                this.alertModalService.mostrarMensagem(data.body.message, this.alertModalService.SUCESSO);
                this.dialogRef.close(value);
            })
        }else{
            this.dialogRef.close();
        }        
    }

}
