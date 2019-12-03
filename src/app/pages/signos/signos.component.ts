import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  cantidad: number = 0;
  dataSource: MatTableDataSource<Signos>;
  displayedColumns = ['idSigno', 'paciente', 'fecha', 'temperatura', 'pulso', 'ritmo_respiratorio', 'acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private signosService: SignosService, private snack : MatSnackBar, public route: ActivatedRoute) { }

  ngOnInit() {

    this.signosService.signosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });

    this.signosService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.signosService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toUpperCase();
  }

  mostrarMas(e: any){
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(signos: Signos){
    this.signosService.eliminar(signos.idSigno).pipe(switchMap(() => {
      return this.signosService.listarPageable(0, 10);
    })).subscribe(data => {
      this.signosService.signosCambio.next(data.content);
      this.signosService.mensajeCambio.next('SE ELIMINO');
    });
  }

}
