import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { parseISO } from 'date-fns';
import { Reserva } from 'src/app/interfaces/reserva';
import { ReservaIn } from 'src/app/interfaces/reservaIn';
import { MessageService } from 'src/app/services/message.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { propietario } from '../../../../interfaces/propietario';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.css']
})
export class CrearReservaComponent implements OnInit {

  public form: FormGroup;
  public minDateLessOne: Date = new Date();
  public dayMin = 60 * 60 * 24 * 1000;
  public minDate: Date =  new Date(this.minDateLessOne.getTime()+this.dayMin);

  public maxDatePlus2Weeks: Date = new Date();
  public dayMax = 14 * 60 * 60 * 24 * 1000;
  public maxDate: Date =  new Date(this.maxDatePlus2Weeks.getTime()+this.dayMax);
  public reservaModel: Array<Reserva>;
  public propietarios: Array<propietario>;
  public miReserva: ReservaIn;
  public turnos: any[] = [
    'De 9:00 am - 11:00 am',
    'De 11:00 am - 1:00 pm',
    'De 2:00 pm - 4:00 pm',
    'De 4:00 pm - 6:00 pm'
  ];

  constructor(
    // public dialogRef: MatDialogRef<any>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
    private _reservaService: ReservasService,
    private _usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router)
    { 
      this.form = new FormGroup({});
      this.reservaModel = new Array<Reserva>();
      this.propietarios = new Array<propietario>();
    }   
    
    ngOnInit(): void {
      this.buildForm();
      this.listarPropietarios();
    }
    
    buildForm() {
      this.form = new FormGroup({
        fecha_reserva: new FormControl('', [Validators.required]),
        turno: new FormControl('', [Validators.required]),
        torre_apto: new FormControl('', [Validators.required])
      })
    }
    
    agregarReserva() {
      var fechaForm: Date;
      var miTurno: string;
      if(this.form.get('fecha_reserva')) {
        fechaForm = this.form.get('fecha_reserva').value;
      }
      console.log(fechaForm);
      var fechaFormString = moment(fechaForm).format('YYYY-MM-DD');
      console.log(fechaFormString);
      miTurno = this.form.get('turno').value;
      const miUsername = this.propietarios.find(item => item.torre_apto == this.form.get('torre_apto').value);
      this.miReserva = {
        fecha_reserva: fechaFormString,
        turno: miTurno,
        username: miUsername.username,
      }
      console.log(this.miReserva);
      this._reservaService.agregarReserva(this.miReserva).subscribe(
        (response: ReservaIn) => {
          this.messageService.showMessage("RESERVA GUARDADA EXITOSAMENTE");
          this.router.navigate(["/dashboard/reservas"]);
        },
          (error: any) => {
          this.messageService.showMessage("ERROR AL GUARDAR LA RESERVA");
          this.router.navigate(["/dashboard/reservas"]);
        }
      );
  }

  listarPropietarios() {
    this._usuarioService.listarPropietarios().subscribe(
      (response: Array<propietario>) => {
        this.propietarios = response;
      },
      (error: any) => {
        this.messageService.showMessage("ERROR AL OBTENER LOS DATOS DE PROPIETARIOS.");
        this.router.navigate(["/dashboard/crear-reserva"]);
      }
    )
  }

  // closeModal(): void {
  //   this.dialogRef.close();
  // }

}