import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { RolesRequestModel } from 'src/app/interfaces/RolesRequestModel';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  private EMAIL_REGEXP: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public roles: Array<RolesRequestModel>;
  public rolenames: any[] = ['administrador', 'propietario'];
  public form: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) { 
    this.form = new FormGroup({}); 
    this.roles = new Array<RolesRequestModel>();
  }

  ngOnInit(): void {
    this.getRoles();
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_REGEXP)]),
      password: new FormControl('', [Validators.required, Validators.min(6)]),
      torre_apto: new FormControl('', [Validators.required, Validators.minLength(5)]),
      rolename: new FormControl('', [Validators.required]),
    });
  }

  crearUsuario() {
    if (this.form.invalid) {
      this.messageService.showMessage("LOS CAMPOS MARCADOS EN ROJO DEBEN SER VERIFICADOS");
      return;
    }
        this._usuarioService.crearUsuario(this.form.value).subscribe(
          (response: Usuario) => {
            this.messageService.showMessage("USUARIO GUARDADO EXITOSAMENTE");
            this.router.navigate(["/dashboard/usuarios"]);
          },
          (error: any) => {
            this.messageService.showMessage("USUARIO YA EXISTE O ERROR EN EL GUARDADO");
            this.router.navigate(["/dashboard/usuarios"]);
          }
        );
  }

  getRoles() {
    this._usuarioService.getRoles().subscribe(
      (response: Array<RolesRequestModel>) => {
        this.roles = response;
      },
      (error: any) => {
        this.messageService.showMessage("ERROR AL OBTENER LOS ROLES.");
      }
    )
  }
}
