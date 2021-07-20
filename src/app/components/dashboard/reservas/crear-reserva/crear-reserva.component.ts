import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Reserva } from 'src/app/interfaces/reserva';
import { MessageService } from 'src/app/services/message.service';
import { ReservasService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.css']
})
export class CrearReservaComponent implements OnInit {

  form: FormGroup;
  
  public minDate: Date = new Date();
  public reservaModel: Array<Reserva>;
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
    private messageService: MessageService,
    private router: Router)
    { 
      this.form = new FormGroup({});
      this.reservaModel = new Array<Reserva>();
    }
    
    ngOnInit(): void {
      this.buildForm();
    }
    
    buildForm() {
      this.form = new FormGroup({
        fecha_reserva: new FormControl('', [Validators.required]),
        turno_txt: new FormControl('', [Validators.required]),
        torre_apto: new FormControl('', [Validators.required])
      })
    }
    
    agregarReserva() {
      //let valorForm;
      // if(this.form.get('fecha_reserva')) {
      //   valorForm = this.form.get('fecha_reserva').value;
      // }
      //valorForm = this.form.get('fecha_reserva').value || new Date();
      //const fechaFormateada = moment((valorForm).format  || new Date).format('YYYY-MM-DD');
      this._reservaService.agregarReserva(this.form.value).subscribe(
        (response: Reserva) => {
          this.messageService.showMessage("RESERVA GUARDADA EXITOSAMENTE");
          this.router.navigate(["/dashboard/reservas"]);
        },
          (error: any) => {
          this.messageService.showMessage("ERROR");
          this.router.navigate(["/dashboard/reservas"]);
        }
      );
  }

  // closeModal(): void {
  //   this.dialogRef.close();
  // }

}