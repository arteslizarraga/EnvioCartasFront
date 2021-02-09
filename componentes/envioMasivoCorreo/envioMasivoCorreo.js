
import { CargaVista } from "../cargaVista.js";
import { mostrarLoadingSpinner, ocultarLoadingSpinner } from "../../funciones/funcionesGenericas.js";
import { configuracionesProyecto } from '../../configuraciones/configuracionesProyecto.js';
import {selectBuscador} from '../../funciones/selectBuscador.js';


export class EnvioMasivoCorreo extends CargaVista
{
    constructor()
    {
        super();

        this.url = configuracionesProyecto.rutaWebApi;
        this.envioMasivoCorreo = {};
        this.listasBuscador = [];             
        this.operacion = "";       
        this.paginaActual = 0;    // Atributo opcional en caso de usar Paginación 
        this.totalPaginas = 0;    // Atributo opcional en caso de usar Paginación 

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
        this.cargarHtml({ 
            rutaArchivo: "envioMasivoCorreo/index.html",
            onload: () => { 

                tinymce.init({ selector: "#textarea_contenidoCorreo", height : "300" });  // Inicializa textarea para el contenido del correo masivo con tinymce

                cargarDatePickers();
                this.obtenerListaPrincipal();
            } 
        }); 

        //this.cargarHtml({textoHtml: "<h1> EnvioMasivoCorreo </h1>"});
    }


    cargarDatePickers()
    {
        cargarDatePicker({
            querySelector: "#fechaEnvioDesdeId", 
              placeholder: "Escriba una fecha",
              onSelect: function () {  resetearPaginacion(); 	obtenerListaPrincipal();  },
              onClear: function () {   resetearPaginacion(); 	obtenerListaPrincipal();  }
        });
        cargarDatePicker({
            querySelector: "#fechaEnvioHastaId", 
              placeholder: "Escriba una fecha",
              onSelect: function () {  resetearPaginacion(); 	obtenerListaPrincipal();  },
              onClear: function () {   resetearPaginacion(); 	obtenerListaPrincipal();  }
        });
    }

    inicializarSelectBuscador(evento)  // Convertir select normal en un select buscador con paginacion  
    { 
        var objetoHTML = evento.target; 

        if (objetoHTML.localName == "select" && objetoHTML.getAttribute("pagina") == null && objetoHTML.size <= 1)   // Si aun no ha sido inicializado el select buscador 
        { 
            selectBuscador({ 
                objetoHTML: objetoHTML, 
                token: localStorage.getItem("token_envio_cartas"),
                url: url + objetoHTML.getAttribute("rutaWebApi"), 
                params: { clase: objetoHTML.getAttribute("entidad"), atributoBuscado: objetoHTML.getAttribute("atributoBuscado") }, 
                registrosPorPagina: {nombre: "registrosPorPagina", valor: 10}, 
                nombrePagina: "numeroPagina", nombreBusqueda: "busqueda", mensajeBuscando: "buscando resultados ..." 
            }); 
            objetoHTML.click();  // Abre el select  
        } 
    } 

    obtenerConsultaBuscador() 
    { 
        var asuntoCorreoId = document.getElementById("asuntoCorreoId"); 
        var emailOrigenEnvioId = document.getElementById("emailOrigenEnvioId"); 
        var usuarioId = document.getElementById("usuarioId");   // Toma el valor del select2 en el buscador para buscar por Usuario 
        var descripcionId = document.getElementById("descripcionId"); 
        var estadoId = document.getElementById("estadoId"); 
        var fechaEnvioDesdeId = document.getElementById("fechaEnvioDesdeId"); 
        var fechaEnvioHastaId = document.getElementById("fechaEnvioHastaId"); 

        var consulta = {}; 

        if (asuntoCorreoId != null && ! ["", null].includes(asuntoCorreoId["value"])) 
            consulta["asuntoCorreo"] = asuntoCorreoId["value"]; 

        if (emailOrigenEnvioId != null && ! ["", null].includes(emailOrigenEnvioId["value"])) 
            consulta["emailOrigenEnvio"] = emailOrigenEnvioId["value"]; 

        if (usuarioId != null && ! ["", null].includes(usuarioId["value"])) 
            consulta["usuario.id"] = usuarioId["value"];   // Foreign key  

        if (descripcionId != null && ! ["", null].includes(descripcionId["value"])) 
            consulta["descripcion"] = descripcionId["value"]; 

        if (estadoId != null && ! ["", null].includes(estadoId["value"])) 
            consulta["estado"] = estadoId["value"]; 

        /*
        if (fechaEnvioDesdeId != null && ! ["", null].includes(fechaEnvioDesdeId["value"])) 
            consulta["fechaEnvioDesde"] = fechaEnvioDesdeId["value"]; 

        if (fechaEnvioHastaId != null && ! ["", null].includes(fechaEnvioHastaId["value"])) 
            consulta["fechaEnvioHasta"] = fechaEnvioHastaId["value"]; 
        */

        if (fechaEnvioDesdeId != null && fechaEnvioDesdeId.hasAttribute("fecha")) 
            consulta["fechaEnvioDesde"] = fechaEnvioDesdeId.getAttribute("fecha"); 

        if (fechaEnvioHastaId != null && fechaEnvioHastaId.hasAttribute("fecha")) 
            consulta["fechaEnvioHasta"] = fechaEnvioHastaId.getAttribute("fecha"); 

        return consulta; 
    } 

    obtenerListaPrincipal()  // Obtener lista de EnvioMasivoCorreo de la Web Api 
    { 
        var registrosPorPagina = 10; 
        var inicio = paginaActual * registrosPorPagina; 

        var consulta = obtenerConsultaBuscador(); 
        consulta["start"] = inicio;                 // Datos para paginacion 
        consulta["length"] = registrosPorPagina;    // Datos para paginacion 

        var parametros = Object.entries(consulta).map(c=> c.join("=")).join("&"); 

        mostrarLoadingSpinner(); 

        fetch(url + "/EnvioMasivoCorreo/llenarDataTable?" + parametros, { 
            method: "POST", 
            headers: {"Authorization": bearerToken} 
        }) 
        .then(response => 
        { 
            if(response.ok) 
            { 
                response.json().then(data => 
                { 
                    totalPaginas = Math.ceil( parseInt(data["recordsTotal"]) / registrosPorPagina ) - 1; 

                    if (totalPaginas > 0) { 
                        // Habilitar o desabilitar botones de navegacion para la paginacion 
                        document.getElementById("nav_paginacion").style.display = "block"; 
                        document.getElementById("btn_pagina_anterior").disabled = (paginaActual == 0) ? true : false; 
                        document.getElementById("btn_pagina_siguiente").disabled = (paginaActual >= totalPaginas) ? true : false; 
                    } 
                    else { 
                        document.getElementById("nav_paginacion").style.display = "none"; 
                    } 

                    var tabla = document.getElementById("tablaPrincipal").getElementsByTagName("tbody")[0]; 
                    tabla.innerHTML = "";   // Limpia la tabla 

                    data["data"].reverse().forEach((c, index) => 
                    { 
                        var fila = tabla.insertRow(0); 
                        fila.insertCell(0).innerHTML = c.id; 
                        fila.insertCell(1).innerHTML = c.asuntoCorreo; 
                        fila.insertCell(2).innerHTML = c.emailOrigenEnvio; 
                        fila.insertCell(3).innerHTML = c.usuario.username; 
                        fila.insertCell(4).innerHTML = c.descripcion; 
                        fila.insertCell(5).innerHTML = c.estado; 
                        fila.insertCell(6).innerHTML = c.fechaEnvio; 

                        //=====================================================>>>>>>
                        var cadena = "";

                        cadena += "<a href='' onclick='editar(event, " + c.id + ")' class='btn btn-success' style='min-width: 131px;'> " + (c.estado == "sin enviar" ? "Editar Correo" : "Ver Correo") + " </a>";
                        cadena += "<br/>";
                        cadena += (c.estado == "sin enviar") ? 
                        "<a href='javascript:;' onclick='eliminar(" + c.id + ")' class='btn btn-danger' style='min-width: 131px;'> Eliminar </a>"
                        : ""; 

                        fila.insertCell(7).innerHTML = cadena;

                        //=====================================================>>>>>>
                    }); 
                }); 
            } 
            else { throw response }
        }) 
        .catch(error => { 
            error.text().then(textoError => alert(textoError));
        }) 
        .finally(c=> { 
            ocultarLoadingSpinner(); 
        }); 
    } 

    resetearPaginacion() 
    { 
        paginaActual = 0; 
        totalPaginas = 0; 
    } 

    construirObjeto()  // Colocar los valores del objeto de tipo EnvioMasivoCorreo en el html 
    { 
        document.getElementById("botonEnviarPorEmail").disabled = (envioMasivoCorreo.estado != "sin enviar") ? true : false;
        document.getElementById("botonGuardar").disabled = (envioMasivoCorreo.estado != "sin enviar") ? true : false;   

        Array.from(document.getElementsByClassName("envioMasivoCorreo")).forEach(c => 
        { 
            if (c.name != undefined) 
            { 
                var atributo = envioMasivoCorreo[c.name]; 

                if (atributo instanceof Object)  // Si es una foreign key 
                { 
                    /*
                    if (c.name == "usuario") 
                    { 
                        c.textContent = "";    // Borra todos los options del select 
                        var nuevoOption = document.createElement("option"); 

                        if (atributo["id"] != null && atributo["id"] != "") 
                        { 
                            nuevoOption.selected = true;   nuevoOption.text = atributo["toString"];   nuevoOption.value = atributo["id"]; 
                        } 
                        else { 
                            nuevoOption.text = "- Seleccione -";   nuevoOption.value = ""; 
                        } 
                        c.appendChild(nuevoOption);   // Agrega el nuevo option al select 
                    } 
                    */
                } 
                else { 
                    c.value = envioMasivoCorreo[c.name];  // Coloca los valores del objeto en cada elemento del form 
                } 

                if (! ["estado", "fechaEnvio", "emailOrigenEnvio"].includes(c.name))  // Se excluyen algunos atributos de la entidad
                {  
                    c.disabled = (envioMasivoCorreo.estado != "sin enviar") ? true : false;   // Agregado
                }
            } 
        }); 

        // Referencias cruzadas de la entidad EnvioCorreoContactoPersona 

        var tablaEnvioCorreoContactoPersona = document.getElementById("tablaEnvioCorreoContactoPersona").getElementsByTagName("tbody")[0]; 
        tablaEnvioCorreoContactoPersona.innerHTML = "";   // Limpia la tabla 
        envioMasivoCorreo["listaEnvioCorreoContactoPersona"].forEach((c, index) => 
        { 
            var fila = tablaEnvioCorreoContactoPersona.insertRow(0); 

            if (envioMasivoCorreo.estado != "finalizado") 
            {
                //fila.insertCell(0).innerHTML = c.estado; 

                fila.insertCell(0).innerHTML = '<div>' + 
                    '<input type="text" style="display: none; width: 100%;" class="form-control" />' + 
                    `<select name="contactoPersona.id" id="listaEnvioCorreoContactoPersona_${index}_contactoPersona" class="form-control"> <option value="">-Seleccione-</option> </select>` + 
                "</div>"; 
        
    //			fila.insertCell(2).innerHTML = (c.contactoPersona.ultimaFechaEnvioCorreo != null) ?
    //				c.contactoPersona.ultimaFechaEnvioCorreo : ""; 

                selectBuscador({ 
                    querySelector: "#listaEnvioCorreoContactoPersona_" + index + "_contactoPersona", 
                    token: localStorage.getItem("token_envio_cartas"), 
                    placeholder: "Seleccione", 
                    url: url + "/ContactoPersona/llenarSelect2", 
                    params: { "clase": "ContactoPersona", "atributoBuscado": "email" }, 
                    registrosPorPagina: {nombre: "registrosPorPagina", valor: 10}, 
                    nombrePagina: "numeroPagina", nombreBusqueda: "busqueda", mensajeBuscando: "buscando resultados ...", 
                    optionSelected: (! ["", null].includes(c["contactoPersona"]["id"])) ? { 
                        id: c["contactoPersona"]["id"], text: c["contactoPersona"]["toString"] 
                    } : null, 
                    onchange: function () 
                    { 
                        actualizarEnvioCorreoContactoPersona(event, c); 
                    } 
                }); 

                fila.insertCell(1).innerHTML = "<button type='button' onclick='quitarEnvioCorreoContactoPersona(" + index + ")' class='btn btn-danger'> Remover </button>"; 
            }
            else 
            {
                //fila.insertCell(0).innerHTML = c.estado; 
                fila.insertCell(0).innerHTML = c.contactoPersona.email; 	
                //fila.insertCell(2).innerHTML = c.contactoPersona.ultimaFechaEnvioCorreo; 
                fila.insertCell(1).innerHTML = ""; 
            }	
        }); 

    } 

    crearNuevo()  // Iniciar creación de nuevo EnvioMasivoCorreo 
    { 
        envioMasivoCorreo = { 
            asuntoCorreo: "", 
            emailOrigenEnvio: localStorage.getItem("email_envio_cartas"), 
            //usuario: {"id": null},  // Foreign key 
            descripcion: "", 
            estado: "sin enviar", 
            fechaEnvio: new Date().toISOString().slice(0, 10),   // Pone la fecha actual
            contenidoCorreo: "",
            listaEnvioCorreoContactoPersona: [], 
        }; 

        operacion = "crear"; 
        construirObjeto(); 
        tinymce.get("textarea_contenidoCorreo").setContent("");                              // Borra el contenido del correo en caso de que tenga algo
        //document.getElementById("seleccionar_tipo_destinatario").style.display = "block";    // Muestra el div para seleccionar tipo destinatario
    } 

    preguntarEnviarEmail(evento)
    {
        //envioMasivoCorreo["contenidoCorreo"] = tinyMCE.get("textarea_contenidoCorreo").getContent({format : "text"});  // Obtiene el valor del textarea que usa tinymce sin html
        envioMasivoCorreo["contenidoCorreo"] = tinyMCE.get("textarea_contenidoCorreo").getContent();  // Obtiene el valor del textarea que usa tinymce con html

        var validacion = validar(envioMasivoCorreo); 
        if (validacion != "") return alert(validacion); 
        
        var opcionConfirm = confirm("El correo será enviado a los destinatarios ¿Desea continuar?"); 
        if (opcionConfirm == true) 
        {
            guardar(evento);
        }
    }


    guardar(evento)  // Guardar y Actualizar EnvioMasivoCorreo en la Web Api 
    { 
        evento.preventDefault(); 

        var enviarPorEmail = (evento.target.id == "botonEnviarPorEmail") ?  // botonEnviarPorEmail    botonGuardar
            true : false;

        //envioMasivoCorreo["contenidoCorreo"] = tinyMCE.get("textarea_contenidoCorreo").getContent({format : "text"});  // Obtiene el valor del textarea que usa tinymce sin html
        envioMasivoCorreo["contenidoCorreo"] = tinyMCE.get("textarea_contenidoCorreo").getContent();  // Obtiene el valor del textarea que usa tinymce con html

        var validacion = validar(envioMasivoCorreo); 
        if (validacion != "") return alert(validacion); 

        var metodoEnvio = (operacion == "crear") ? "POST" : "PUT"; 

        mostrarLoadingSpinner(); 

        fetch(url + "/EnvioMasivoCorreo/" + enviarPorEmail, { 
            method: metodoEnvio, 
            headers: {"Content-Type": "application/json", "Authorization": bearerToken},  // headers: {"Authorization": bearerToken}  
            body: JSON.stringify(envioMasivoCorreo) 
        }) 
        .then(response => 
        { 
            if(response.ok) 
            { 
                if (enviarPorEmail) {
                    alert("El envío de email fue realizado con éxito");
                }
                obtenerListaPrincipal();               // Se actualiza la lista de EnvioMasivoCorreo llamando la Web Api 
                $("#modalCrearEditar").modal("hide");  // Cierra el modal 
            } 
            else { throw response }
        }) 
        .catch(error => 
        { 
            //error.text().then(textoError => alert(textoError));
            
            error.text().then(textoError =>  // Modificacion para capturar error producido en el backend
            {
                alert(textoError);
                console.log("=====================================================>>>>>");
                console.log("El objeto enviado que da error es: ");
                console.log(envioMasivoCorreo);
                console.log("=====================================================>>>>>");
            });
        }) 
        .finally(c=> { 
            ocultarLoadingSpinner(); 
        }); 
        
    } 

    validar(envioMasivoCorreo)  // Validar EnvioMasivoCorreo 
    { 
        var listaEnvioCorreoContactoPersona = envioMasivoCorreo["listaEnvioCorreoContactoPersona"]; 

        // Se validan los atributos de la entidad 

        if (["", null].includes(envioMasivoCorreo.asuntoCorreo)) return "El campo Asunto correo no posee un valor"; 
        if (["", null].includes(envioMasivoCorreo.emailOrigenEnvio)) return "El campo Email de envío no posee un valor"; 
        //if (["", null].includes(envioMasivoCorreo.descripcion)) return "El campo descripcion no posee un valor"; 
        //if (["", null].includes(envioMasivoCorreo.estado)) return "El campo estado no posee un valor"; 
        //if (["", null].includes(envioMasivoCorreo.fechaEnvio)) return "El campo fechaEnvio no posee un valor"; 
        if (["", null].includes(envioMasivoCorreo.contenidoCorreo)) return "El campo Contenido correo no posee un valor"; 

        // Se validan las referencias cruzadas de la entidad EnvioCorreoContactoPersona 
        // if (listaEnvioCorreoContactoPersona.some(c=> ["", null].includes(c.estado))) 
        // 	return "Un detalle de tipo EnvioCorreoContactoPersona tiene vacío el campo estado"; 

        if (listaEnvioCorreoContactoPersona.length == 0) 
            return "El correo no posee destinatarios"; 

        if (Array.from(listaEnvioCorreoContactoPersona, c=> c["contactoPersona"]).some(c=> ["", null].includes(c.id))) 
            return "Un destinatario no tiene seleccionado el campo email"; 
        
        return ""; 
    } 

    editar(evento, id)  // Obtener EnvioMasivoCorreo de la Web Api por su id 
    { 
        evento.preventDefault(); 

        mostrarLoadingSpinner(); 

        fetch(url + "/EnvioMasivoCorreo/" + id, { 
            method: "GET", 
            headers: {"Authorization": bearerToken} 
        }) 
        .then(response => 
        { 
            if(response.ok) 
            { 

                response.json().then(data => 
                { 
                    operacion = "editar"; 
                    envioMasivoCorreo = data; 

                    //document.getElementById("seleccionar_tipo_destinatario").style.display = "none";    		  // Oculta el div para seleccionar tipo destinatario
                    tinymce.get("textarea_contenidoCorreo").setContent( envioMasivoCorreo["contenidoCorreo"] );   // Coloca el contenido en el textarea

                    // Asignar atributo toString a objeto(s) hijos(s) que pertenecen a otra entidad 

                    envioMasivoCorreo["listaEnvioCorreoContactoPersona"].forEach(c=> {  // Recorre los elementos de tipo EnvioCorreoContactoPersona que pertenecen a EnvioMasivoCorreo 
                        var contactoPersona = c["contactoPersona"]; 
                        c["contactoPersona"]["toString"] = contactoPersona["email"];  // En su objeto padre de tipo ContactoPersona coloca el atributo toString 
                    }); 

                    construirObjeto(); 
                    $("#modalCrearEditar").modal("show"); 
                }); 
            } 
            else { throw response }
        }) 
        .catch(error => 
        { 
            //error.text().then(textoError => alert(textoError));
            
            error.text().then(textoError =>  // Modificacion para capturar error producido en el backend
            {
                alert(textoError);
                console.log("=====================================================>>>>>");
                console.log("El objeto enviado que da error es: ");
                console.log(envioMasivoCorreo);
                console.log("=====================================================>>>>>");
            });
        }) 
        .finally(c=> { 
            ocultarLoadingSpinner(); 
        }); 
    } 

    eliminar(id)  // Eliminar EnvioMasivoCorreo por su id 
    { 
        var opcionConfirm = confirm("Desea realmente eliminar este registro"); 
        if (opcionConfirm == true) 
        { 
            mostrarLoadingSpinner(); 

            fetch(url + "/EnvioMasivoCorreo/" + id, { 
                method: "DELETE", 
                headers: {"Authorization": bearerToken} 
            }) 
            .then(response => 
            { 
                if(response.ok) 
                { 
                    obtenerListaPrincipal();  // Se actualiza la lista de EnvioMasivoCorreo llamando la Web Api 
                } 
                else { throw response }
            }) 
            .catch(error => { 
                error.text().then(textoError => alert(textoError));
            }) 
            .finally(c=> { 
                ocultarLoadingSpinner(); 
            }); 
        } 
    } 

    //====================================================================================================>>>>>> 
    // Control de referencias cruzadas de la entidad EnvioCorreoContactoPersona 

    agregarNuevoEnvioCorreoContactoPersona()  // Agregar a EnvioMasivoCorreo un detalle de tipo EnvioCorreoContactoPersona 
    { 
        envioMasivoCorreo["listaEnvioCorreoContactoPersona"].push({ 
            estado: "sin enviar", 
            contactoPersona: {"id": null, "toString": ""}, 
        }); 
        construirObjeto(); 
    } 

    actualizarEnvioCorreoContactoPersona(evento, envioCorreoContactoPersona)  // Actualizar detalle de tipo EnvioCorreoContactoPersona que pertenece a EnvioMasivoCorreo 
    { 
        var nombre = evento.target.name; 

        if(nombre.includes("."))  // Si se selecciona un padre para el detalle de tipo EnvioCorreoContactoPersona 
        { 
            var padre = nombre.split(".")[0]; 
            var idPadre = nombre.split(".")[1]; 
            if (padre == "contactoPersona")  // Validar duplicidad de ContactoPersona 
            { 
                if (envioMasivoCorreo["listaEnvioCorreoContactoPersona"].find(c=> c.contactoPersona.id == evento.target.value)) 
                { 
                    alert("Ya existe un detalle de tipo EnvioCorreoContactoPersona con el ContactoPersona " + evento.target.options[evento.target.selectedIndex].text); 
                    if (envioCorreoContactoPersona.contactoPersona["id"] == null)  // Si no tenia un valor seleccionado previamente 
                    { 
                        envioCorreoContactoPersona.contactoPersona = {"id": null};  	  // Anula el ContactoPersona seleccionado 
                        return evento.target.selectedIndex = 0;   // Selecciona primer option del combobox 
                    } 
                    else  // Si ya tenia un valor seleccionado previamente 
                    { 
                        var optionAnterior = Array.from(evento.target.options).find(c=> c["value"] == envioCorreoContactoPersona.contactoPersona["id"]); 

                        if (optionAnterior != null)  // Si es un select normal, o es un select buscador con paginacion que aun conserva el option anteriormente seleccionado 
                        { 
                            optionAnterior["selected"] = true;   // Selecciona el valor anterior 
                        } 
                        else if (evento.target.getAttribute("pagina") != null)   // Si es un select buscador con paginacion 
                        { 
                            evento.target.textContent = "";    										//Borra todos los options del select 
                            var nuevoOption = document.createElement("option");  					nuevoOption.selected = true; 
                            nuevoOption.text = evento.target.getAttribute("textoSeleccionado");		nuevoOption.value = evento.target.getAttribute("valorSeleccionado"); 
                            evento.target.appendChild(nuevoOption);  								//Agrega un option con los valores de la seleccion anterior 
                        } 
                        return; 
                    } 
                } 
            } 
            envioCorreoContactoPersona[padre][idPadre] = evento.target.value; 
            envioCorreoContactoPersona[padre]["toString"] = evento.target.options[evento.target.selectedIndex].text;  // Coloca el atributo toString usando el texto del option seleccionado 
        } 
        else { 
            envioCorreoContactoPersona[evento.target.name] = evento.target.value; 
        } 
    } 

    quitarEnvioCorreoContactoPersona(indice)  // Quitar detalle de tipo EnvioCorreoContactoPersona que pertenece a EnvioMasivoCorreo 
    { 
        envioMasivoCorreo["listaEnvioCorreoContactoPersona"].splice(indice, 1); 
        construirObjeto(); 
    } 

    //====================================================================================================>>>>>> 

    
};

