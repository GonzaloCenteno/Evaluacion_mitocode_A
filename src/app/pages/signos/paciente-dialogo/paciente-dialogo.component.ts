import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { SignosService } from 'src/app/_service/signos.service';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    private pacienteService: PacienteService,
    private signoService: SignosService
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      'nombres' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'email': new FormControl('',Validators.email),
      'telefono': new FormControl('',[Validators.minLength(9),Validators.maxLength(9)]),
      'dni': new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(8)])
    });

  }

  get f() { return this.form.controls; }

  cancelar() {
    this.dialogRef.close();
  }

  guardar_datos(){

    let paciente = new Paciente();
    paciente.nombres = this.form.value['nombres'].toUpperCase();
    paciente.apellidos = this.form.value['apellidos'].toUpperCase();
    paciente.telefono = this.form.value['telefono'];
    paciente.dni = this.form.value['dni'];
    paciente.email = this.form.value['email'].toUpperCase();

    this.pacienteService.registrar(paciente).subscribe(data => {
      this.signoService.dataPaciente.next(data);
      this.dialogRef.close();
      this.signoService.mensajeCambio.next('SE REGISTRO LA PERSONA CON EXITO');
    });

  }

}
