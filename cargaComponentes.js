
import {rutasProyecto} from './configuraciones/rutasProyecto.js';

(() => 
{
    var componente = null;

    const inicializarComponente = (elemento) => 
    {
        try {
            componente = new elemento.componente();
            //var html = componente.cargarVista();

            /*
            Object.getOwnPropertyNames(elemento.componente.prototype).forEach(c=> 
            { 
                window[c] = componente[c];  // Coloca los metodos de la clase para que esten disponibles desde el html y la consola
            });
            */
        } 
        catch (error) {
            //alert(error);
            console.log(error);
        }
    }

    //=============================================================================>>>>>
    // Al cargar el documento

    var nombre = window.location.href.split("/").reverse()[0];       // "apuntesTema"
    if (nombre.includes("#")) { nombre = nombre.replace("#", ""); }  // Remueve el # en caso de que lo tenga

    if (rutasProyecto.some(c=> c.nombre == nombre)) 
    {
        var rutaUrl = rutasProyecto.find(c=> c.nombre == nombre);
        inicializarComponente(rutaUrl);
    }
    else 
    {
        if (rutasProyecto.some(c=> c.default == true)) {
            var rutaPorDefecto = rutasProyecto.find(c=> c.default == true);
            inicializarComponente(rutaPorDefecto);
        }
        else {
            window.location.href = "404.html";
        }
    }

    //=============================================================================>>>>>

    window.mostrarComponente = (nombre) =>  // Esta funcion es accesible tanto dentro de este modulo como desde los href html y la consola
    {
        if (componente != null && window.destructor != null && typeof window.destructor == "function") {
            componente.destructor();
            //componente.probando();
        }

        //var urlBaseProyecto = window.location.origin + window.location.pathname;   // "http://localhost/miProyecto/"
        //history.pushState({}, null, `${urlBaseProyecto}?${nombre}`);               // Cambia la url que ve el usuario. Ej:   "http://localhost/AAA/probandoSPA/?apuntesTema"
        history.replaceState({}, "", nombre);

        if (nombre.includes("#")) { nombre = nombre.replace("#", ""); }  // Remueve el # en caso de que lo tenga

        var rutaEncontrada = rutasProyecto.find(c=> c.nombre == nombre);

        if (rutaEncontrada != null) 
        { 
            return window.location.reload();            // Esto es un extra OK. Recarga la pagina, asi no genera problemas
            //inicializarComponente(rutaEncontrada);    // Asi era originalmente
        }
    }

    // Array.from(document.querySelectorAll("ul li a")).forEach(c=> { console.log(c) });


    //Array.from(document.getElementsByTagName("a")).forEach(c=> 
    Array.from(document.querySelectorAll("ul li a p")).forEach(c=>   // Detecta los <p> del navbar
    {
        // console.log(nombre);   // apuntesTema
        
        if (c.hasAttribute("link")) 
        {
            //console.log(c.getAttribute("link"));
            var atributoLink = c.getAttribute("link");  // replace("#", "")

            c.addEventListener("click", (e) => 
            { 
                e.preventDefault();

                if (atributoLink != null) {
                    mostrarComponente(atributoLink);
                }
            });

            if (atributoLink.replace("#", "") == nombre) {
                c.parentElement.classList.add("active");  // Marca con color el link del componente seleccionado
            }
        }


    });

})();