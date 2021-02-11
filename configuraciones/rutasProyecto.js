
import { Inicio } from "../componentes/inicio/inicio.js";
import { Login } from "../componentes/login/login.js";
import { ContactoPersona } from "../componentes/contactoPersona/contactoPersona.js";
import { EnvioMasivoCorreo } from "../componentes/envioMasivoCorreo/envioMasivoCorreo.js";
import { MaestroEnvioEmail } from "../componentes/maestroEnvioEmail/maestroEnvioEmail.js";
import { RespaldoDatos } from "../componentes/respaldoDatos/respaldoDatos.js";


export const rutasProyecto = [
    {nombre: "inicio", componente: Inicio, default: true},
    {nombre: "login", componente: Login},
    {nombre: "contactoPersona", componente: ContactoPersona},
    {nombre: "envioMasivoCorreo", componente: EnvioMasivoCorreo},
    {nombre: "maestroEnvioEmail", componente: MaestroEnvioEmail},
    {nombre: "respaldoDatos", componente: RespaldoDatos}
];





