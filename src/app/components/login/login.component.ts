import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { MessageService } from 'src/app/services/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  [x: string]: any;
  public form: FormGroup;
  public loading: boolean = false;

  constructor(private authService: AuthService,
              private localDataService: LocalDataService,
              private router: Router,
              private messageService: MessageService,
              public globalService: GlobalService,
              private _snackBar: MatSnackBar
  ) { this.form = new FormGroup({}); }

  ngOnInit(): void {
    localStorage.clear();
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  login() {
    if(this.form.invalid) {
      this.messageService.showMessage('LOS CAMPOS MARCADOS EN ROJO DEBEN SER VERIFICADOS');
      return;
    }

    this.authService.login({
      username: this.form.value.username,
      password: this.form.value.password
    }).subscribe(
      (response: any) => {
        //Se ejecuta cuando la respuesta es correcta
        this.authService.setToken(response.success);
        this.success();
        this.fakeLoading();
        this.router.navigate(['/dashboard']);
        console.log(this.form.value.username);
        console.log(this.form.value.password);
      },
      (error: any) => {
        //Se ejecuta cuando la respuesta es mayor a 400
        this.messageService.showMessage('HA OCURRIDO UN ERROR AL INTENTAR INICIAR SESIÓN. INTENTE NUEVAMENTE');
        this.error();
        this.form.reset();
      }
    )
  }

  error() {
    this._snackBar.open('Username o password incorrectos', '', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  success() {
    this._snackBar.open('Has iniciado sesión', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
  }

  fakeLoading(){
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['dashboard']);
      this.loading = false;
    }, 2000)
  }

}
