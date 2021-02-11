
import { CargaVista } from "../cargaVista.js";
import { mostrarLoadingSpinner, ocultarLoadingSpinner } from "../../funciones/funcionesGenericas.js";
import { configuracionesProyecto } from '../../configuraciones/configuracionesProyecto.js';


export class RespaldoDatos extends CargaVista
{
    constructor()
    {
        super();

        this.url = configuracionesProyecto.rutaWebApi;
        this.bearerToken = "Bearer " + localStorage.getItem(configuracionesProyecto.nombreToken);

        for (var prop in this) { window[prop] = this[prop]; }                                          // Coloca los atributos de la clase para que esten disponibles desde el html
        Object.getOwnPropertyNames(this.constructor.prototype).forEach(c=> { window[c] = this[c]; });  // Coloca los metodos de la clase para que esten disponibles desde el html

        mostrarLoadingSpinner();
        this.cargarVista();
    }

    destructor() {
        for (var prop in this) { delete window[prop]; }                                             // Remueve los atributos de la clase para que no queden en la ventana
        Object.getOwnPropertyNames(this.constructor.prototype).forEach(c=> { delete window[c]; });  // Remueve los metodos de la clase para que no queden en la ventana
    }

    cargarVista()
    {
        let texto = `
        <br/><br/><br/>

        <div> 
            <button onclick="generarRespaldo()" class="btn btn-success"> Generar Respaldo </button> <br/> 
        </div> 
        `;
        
        this.cargarHtml({textoHtml: texto});
    }


    generarRespaldo = async () => 
    {
        var clave = prompt("Introduzca la clave", "");

        if (clave != null) 
        {
            if (clave == "")  return alert("Falta la clave");
            
            mostrarLoadingSpinner(); 

            await fetch(url + "/RespaldoDatos/" + clave, { 
                method: "POST", 
                headers: {"Authorization": "Bearer " + localStorage.getItem("token_envio_cartas")}
            }) 
            .then(response => 
            {
                if(response.ok) 
                {
                    response.blob().then(datos => 
                    {
                        var url = window.URL.createObjectURL(datos);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = "respaldo.sql";
                        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();    
                        a.remove();  //afterwards we remove the element again     
                    });
                } 
                else {
                    throw new Error("No fue posible generar el archivo de respaldo");
                }
            })
            .catch(error => {
                alert(error);
            })
            .finally(c=> {
                ocultarLoadingSpinner();
            });
            
            /*
            fetch(url + "/RespaldoDatos/" + clave, { 
                method: "POST", 
                headers: {"Authorization": bearerToken}
            }) 
            .then(async res => ({
                nombreArchivo: "respaldo.sql",
                blob: await res.blob()
            }))
            .then(datos => 
            {
                var url = window.URL.createObjectURL(datos.blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = datos.nombreArchivo;
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();    
                a.remove();  //afterwards we remove the element again        
            })
            .catch(error => {
                alert("Se encontro un error al generar el respaldo");
            })
            .finally(c=> {
                ocultarLoadingSpinner();
            });
            */
        }
    }
   
    
};

