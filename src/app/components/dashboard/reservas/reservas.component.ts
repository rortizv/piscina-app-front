import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Reserva } from 'src/app/interfaces/reserva';
import { ReservasService } from '../../../services/reservas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import * as moment from 'moment';
import { ReservaFilterModel } from 'src/app/interfaces/ReservaFilterModel';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  public listReservas: Reserva[] = [];
  public form!: FormGroup;
  public dateForm!: FormGroup;
  public hasError: boolean = false;
  public isAdmin: boolean = false;
  public minDate: Date = new Date();
  public displayedColumns: string[] = ['id_reserva', 'fecha_reserva', 'turno_txt', 'torre_apto', 'acciones'];
  public dataSource!: MatTableDataSource<Reserva>;

  constructor(
              private _reservaService: ReservasService, 
              private messageService: MessageService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.buildForm();
    this.dataSource = new MatTableDataSource<Reserva>();
    this.showAdminOptions();
  }

  buildForm() {
    this.form = new FormGroup({
      fecha_reserva: new FormControl('', [Validators.required]),
      turno: new FormControl('', [Validators.required]),
      id_usuario: new FormControl('', [Validators.required])
    });
    this.dateForm = new FormGroup({
      fecha_seleccionada: new FormControl('')
    });
  }

  listarReservas(fecha_seleccionada: any) {
    if(fecha_seleccionada) {
      fecha_seleccionada = moment(fecha_seleccionada).add(5,'h').format('YYYY-MM-DD');
    }
    let fecha: ReservaFilterModel = {
      fecha_reserva: fecha_seleccionada
    }
    this._reservaService.listarReservas(fecha.fecha_reserva).subscribe(
      (response: Array<Reserva>) => {
        this.dataSource = new MatTableDataSource<Reserva>(response);
      },
      (error: any) => {
        this.messageService.showMessage("ERROR AL OBTENER LOS DATOS.");
        this.router.navigate(["/dashboard/reservas"]);
      }
    )
  }

  showAdminOptions(){
    const user = this.authService.getCurrentUser();
    const role = user.role;
    this.isAdmin = (role == "administrador")?true : false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  crearReserva() {
    this.router.navigate(["/dashboard/crear-reserva"]);
  }
    

  eliminarReserva(id_reserva: number) {
    alert("Próximo a implementar");
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(CrearReservaComponent, {
  //     width: '250px',
  //     data: { 
  //       //TODO
  //       // crearReserva()
  //      }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     //console.log('The dialog was closed');
  //   });
  // }

}