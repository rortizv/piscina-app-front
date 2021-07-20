import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public listUsuarios: Usuario[] = [];
  public form!: FormGroup;
  public isAdmin: boolean = false;
  public displayedColumns: string[] = ['username', 'torre_apto', 'rolename', 'acciones'];
  public dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _usuarioService: UsuarioService,
              private messageService: MessageService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.buildForm();
    this.dataSource = new MatTableDataSource<Usuario>();
    this.listarUsuarios();
    this.showAdminOptions();
  }

  buildForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.email]),
      torre_apto: new FormControl('', [Validators.required]),
      rolename: new FormControl('')
    })
  }

  listarUsuarios(event?: any) {   
    this._usuarioService.listarUsuarios().subscribe(
      (response: Array<Usuario>) => {
        this.dataSource = new MatTableDataSource<Usuario>(response);
      },
      (error: any) => {
        this.messageService.showMessage("ERROR AL OBTENER LOS DATOS.");
        this.router.navigate(["/dashboard/usuarios"]);
      }
    )
  }

  showAdminOptions(){
    const user = this.authService.getCurrentUser();
    const role = user.role;
    this.isAdmin = (role == "administrador")?true : false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarUsuario(id_usuario: number) {
    alert("Próximo a implementar");
    // this._usuarioService.eliminarUsuario(id_usuario).subscribe(
    //   (response: Usuario) => {
    //     this.dataSource = new MatTableDataSource<Usuario>(response.id_usuario);
    //     this.messageService.showMessage("USUARIO ELIMINADO EXITOSAMENTE");
    //     this.router.navigate(["/dashboard/usuarios"]);
    //   },
    //     (error: any) => {
    //     this.messageService.showMessage("ERROR AL ELIMINAR EL USUARIO");
    //     this.router.navigate(["/dashboard/usuarios"]);
    //   }
    // );
  }

}