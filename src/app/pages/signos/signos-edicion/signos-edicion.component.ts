import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from 'src/app/_service/paciente.service';
import { map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PacienteDialogoComponent } from '../paciente-dialogo/paciente-dialogo.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  myControlPaciente: FormControl = new FormControl();
  pacientes: Paciente[] = [];
  pacientesFiltrados: Observable<any[]>;
  pacienteSeleccionado: Paciente;

  temperatura: string;
  pulso: number;
  ritmo_respiratorio: string;

  maxFecha: Date = new Date();
  fecha : string;

  constructor(
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private router : Router,
    private route: ActivatedRoute,
    private dialog : MatDialog
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      'id' : new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'pulso': new FormControl(''),
      'ritmo_respiratorio': new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this.listarPacientes();
    
    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.inicializarForm();
    });

    this.signosService.dataPaciente.subscribe( (data:Paciente) => {
      this.listarPacientes();
      this.form.controls['paciente'].setValue({idPaciente: data.idPaciente, nombres: data.nombres, apellidos: data.apellidos, dni: data.dni});
    });

  }

  inicializarForm(){
    if(this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSigno),
          'paciente': this.myControlPaciente,
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura, [Validators.required, Validators.minLength(3)]),
          'pulso': new FormControl(data.pulso),
          'ritmo_respiratorio': new FormControl(data.ritmo_respiratorio, [Validators.required, Validators.minLength(3)])
        });
        this.form.controls['paciente'].setValue({idPaciente: data.paciente.idPaciente, nombres: data.paciente.nombres, apellidos: data.paciente.apellidos, dni: data.paciente.dni});
      });
    }
  }

  get f() { return this.form.controls; }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }

  filtrarPacientes(val : any){   
    console.log(val); 
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  guardar_datos(){
    let id = this.form.value['paciente'];
    
    let paciente = new Paciente();
    paciente.idPaciente = id.idPaciente;

    let signos = new Signos();
    signos.idSigno = this.form.value['id'];
    signos.paciente = paciente;
    signos.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signos.temperatura = this.form.value['temperatura'].toUpperCase();
    signos.pulso = this.form.value['pulso'];
    signos.ritmo_respiratorio = this.form.value['ritmo_respiratorio'].toUpperCase();


    if(this.edicion){

      this.signosService.modificar(signos).pipe(switchMap( () => {
        return this.signosService.listarPageable(0, 10);
      })).subscribe(data => {
        this.signosService.signosCambio.next(data.content);
        this.signosService.mensajeCambio.next('SE MODIFICO');
      });

    }else{

      this.signosService.registrar(signos).pipe(switchMap( () => {
        return this.signosService.listarPageable(0, 10);
      })).subscribe(data => {
        this.signosService.signosCambio.next(data.content);
        this.signosService.mensajeCambio.next('SE REGISTRO');
      });

    }

    this.router.navigate(['signos']);
    
  }

  abrirDialogoPaciente(){
    this.dialog.open(PacienteDialogoComponent, {
      height: '610px',
      width: '600px',
      disableClose: true
    });
  }

}
