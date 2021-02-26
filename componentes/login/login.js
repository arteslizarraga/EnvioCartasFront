
import { CargaVista } from "../cargaVista.js";
import { mostrarLoadingSpinner, ocultarLoadingSpinner } from "../../funciones/funcionesGenericas.js";
import { configuracionesProyecto } from "../../configuraciones/configuracionesProyecto.js";


export class Login extends CargaVista
{
    constructor()
    {
        super({ validarSesionUsuario: false });

        this.url = configuracionesProyecto.rutaWebApi;

        for (var prop in this) { window[prop] = this[prop]; }                                          // Coloca los atributos de la clase para que esten disponibles desde el html
        Object.getOwnPropertyNames(this.constructor.prototype).forEach(c=> { window[c] = this[c]; });  // Coloca los metodos de la clase para que esten disponibles desde el html

        this.validarClaveSeguridad();  // Agregado, ya que el validarSesionUsuario lo tiene como false
        mostrarLoadingSpinner();
        this.cargarVista();
    }

    destructor() {
        for (var prop in this) { delete window[prop]; }                                             // Remueve los atributos de la clase para que no queden en la ventana
        Object.getOwnPropertyNames(this.constructor.prototype).forEach(c=> { delete window[c]; });  // Remueve los metodos de la clase para que no queden en la ventana
    }

    realizarLogin(evento) 
    {
        evento.preventDefault();
        mostrarLoadingSpinner();
        
        var form = new FormData(evento.target);
        var username = form.get("username");
        var password = form.get("password");
        
        if (username == "") {  return alert("Es necesario colocar el username");  }
        if (password == "") {  return alert("Es necesario colocar el password");  }
        
        fetch(url + "/login", {
            method: "POST",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                "username": username, 
                "password": password,
                "claveSeguridad": localStorage.getItem("claveSeguridadEnvioCartas")
            })
        })
        .then(response => 
        {
            if(response.ok) 
            {
                response.json().then(data => 
                {
                    //console.log(data);
                    localStorage.setItem(configuracionesProyecto.nombreToken, data.token);	
                    localStorage.setItem("email_envio_cartas", data.emailEnvioCartas);
                    //window.location.href = "http://localhost/AppApuntes/apuntesTema";  

                    window.location.href = "#contactoPersona";
                    window.location.reload();
                });
            } 
            else {
                response.text().then(textoError => alert(textoError));
            }
        })
        .catch(error => {
            alert(JSON.stringify(error));
        })
        .finally(c=> {
            ocultarLoadingSpinner();
        });
    };


    cargarVista()
    {
        let texto = `
        <br/><br/><br/>
        
        <div class="row">
            <div class="card card-primary">
                <div class="card-header">
                    <h3 class="card-title"> Inicio de sesión </h3>
                </div>
                <form method="POST" enctype="multipart/form-data" onsubmit="realizarLogin(event)">
                    <div class="card-body">
                    <div class="form-group">
                        <label for="exampleInputEmail1"> Usuario </label>
                        <input type="text" name="username" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1"> Password </label>
                        <input type="password" name="password" class="form-control">
                    </div>
                    </div>          
                    <div class="card-footer">
                    <button type="submit" class="btn btn-primary"> Entrar </button>
                    </div>
                </form>
            </div>
        </div>
        `;

        this.cargarHtml({ 
            textoHtml: texto,
            onload: () => {  ocultarLoadingSpinner();  }
        }); 

        //this.cargarHtml({textoHtml: "aaaaaaaaaaaa"});
    }
    
};

