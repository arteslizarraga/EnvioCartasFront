

// export const menuNavegacionMain = `
// <nav class="navbar navbar-inverse" role="navigation">  
//     <div class="container">
//         <div class="navbar-header">
//             <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
//                 <span class="sr-only">Toggle navigation</span>
//                 <span class="icon-bar"></span>
//                 <span class="icon-bar"></span>
//                 <span class="icon-bar"></span>
//             </button>
//             <a class="navbar-brand" href="#"> AppApuntesSPA </a>
//         </div>
//         <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
//             <ul class="nav navbar-nav navbar-right">	
        
//                 <li> <a href="#" link="#inicio"> Inicio </a></li>
//                 <li> <a href="#" link="#contactoPersona"> contactoPersona </a></li>
//                 <li> <a href="#" link="#envioMasivoCorreo"> envioMasivoCorreo </a></li>   
//                 <li> <a href="#" link="#maestroEnvioEmail"> Configuración de email </a></li>           
//                 <li> <a href="#" onclick="cerrarSesion(event)"> Cerrar Sesión </a> </li>  					                
//             </ul>
//         </div>
//     </div>
// </nav> 
// `;

export const menuNavegacionMain = `
<nav class="main-header navbar navbar-expand navbar-lightblue navbar-light">  <!-- Navbar -->

    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
    </ul>
    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <a href="#" onclick="cerrarSesion(event)" class="nav-link btn btn-default"> Cerrar Sesión </a>
        </li>
    </ul>
</nav>

<aside class="main-sidebar sidebar-dark-primary elevation-4">  <!-- Main Sidebar Container -->
    
    <a href="#" class="brand-link">  <!-- Brand Logo -->
        <img src="AdminLTE/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
        <span class="brand-text font-weight-light"> AppEnvioCartas </span>
    </a>

    <div class="sidebar">  <!-- Sidebar -->

        <nav class="mt-2"> <!-- Sidebar Menu -->

            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
    
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-tree"></i> <p link="#inicio"> Inicio </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-th"></i> <p link="#contactoPersona"> Contactos </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon far fa-envelope"></i> <p link="#envioMasivoCorreo"> Envío correo </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-book"></i> <p link="#maestroEnvioEmail"> Configuración de email </p>
                    </a>
                </li>

                <li class="nav-header"> OPERACIONES </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-file"></i> <p link="#respaldoDatos"> Respaldar información </p>
                    </a>
                </li>

            </ul>
        </nav>
    
    </div>
    
</aside>
`;