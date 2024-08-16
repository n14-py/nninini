const path = require("path");
const fs = require("fs").promises;
const fetch = require("node-fetch"); 
const fastify = require("fastify")({
  logger: false,
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}


async function checkFileExistence(fileName) {
  const localFilePath = path.join(__dirname, "public", fileName);
  try {
    
    await fs.access(localFilePath);
    console.log(`El archivo HTML "${fileName}" existe localmente.`);
    return `/${fileName}`; 
  } catch (error) {
    console.log(`El archivo HTML "${fileName}" no existe localmente.`);
    try {
      
      const response = await fetch(`https://x19premium.glitch.me/${fileName}`);
      if (response.ok) {
        console.log(`El archivo HTML "${fileName}" existe en la página externa.`);
        return `https://x19premium.glitch.me/${fileName}`; 
      } else {
        console.log(`El archivo HTML "${fileName}" no existe en la página externa.`);
        return "notFound"; 
      }
    } catch (error) {
      console.error(`Error al verificar el archivo HTML "${fileName}":`, error);
      return null; 
    }
  }
}

fastify.get("/", async function (request, reply) {
  let params = { seo: seo, errorMessage: null };

  if (request.query.randomize) {
    const colors = require("./src/colors.json");
    const allColors = Object.keys(colors);
    let currentColor = allColors[(allColors.length * Math.random()) << 0];

    params = {
      color: colors[currentColor],
      colorError: null,
      seo: seo,
    };
  }

  return reply.view("/src/pages/index.hbs", params);
});

fastify.post("/signin", async function (request, reply) {
  const { username, password } = request.body;
  if (!username || !password) {
    return reply.view("/src/pages/index.hbs", { 
      seo: seo,
      errorMessage: "Usuario no registrado. Por favor, regístrate."
    });
  }

  const fileName = `${username}.html`;

  
  const filePath = await checkFileExistence(fileName);

  if (filePath === "notFound") {
    return reply.view("/src/pages/index.hbs", { 
      seo: seo,
      errorMessage: "Usuario no registrado. Por favor, regístrate."
    });
  } else if (filePath) {
    reply.redirect(filePath); 
  } else {
   
    console.error(`Error al buscar el archivo HTML "${fileName}".`);
    return reply.status(500).send("Error interno del servidor.");
  }
});

fastify.post("/signup", async function (request, reply) {
  const { email, username, password } = request.body; 
  if (!email || !username || !password) {
    reply.status(400).send("Debe proporcionar un correo electrónico, un nombre de usuario y una contraseña para registrarse.");
    return;
  }

  const fileName = `${email}.html`; 
  const filePath = path.join(__dirname, "public", fileName);

  const defaultHTMLContent = `
 
 
 
 
 <!--  -->
 
 
 
  <!DOCTYPE html>
<html lang="es" translate="no">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png">
  <link rel="icon" type="image/png" href="./assets/img/favicon.png">
  <title>x19</title>
  <!-- Fonts and icons -->
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700" />
  <!-- Nucleo Icons -->
  <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
  <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
  <!-- Font Awesome Icons -->
  <script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
  <!-- Material Icons -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
  <!-- CSS Files -->
  <link id="pagestyle" href="style5.css" rel="stylesheet" />
  <style>
    /* Agregamos estilos CSS personalizados para dispositivos móviles */
    @media (max-width: 576px) {
      .navbar-nav {
        flex-direction: column;
      }

      .navbar-nav .nav-item {
        display: none;
      }

      .input-group {
        margin-bottom: 19px;
      }

      .navbar-toggler-icon {
        font-size: 15rem;
      }

      #iconSettings {
        font-size: 2rem;
      }
    }
  </style>
</head>

<body>


    <!-- Main Content -->
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <!-- Navbar -->
      <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
        <div class="container-fluid py-1 px-33">
          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="javascript:;">x19</a></li>
              <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
            </ol>
            <h6 class="font-weight-bolder mb-0">Hola ${username}, Regalo de 50$</h6>  <!--La contraseña es ${password}-->
           
          </nav>
          
<!-- NO NO NO NO NO NO NO NO activada -->
<div class="navbar-nav justify-content-end">
  <li class="nav-item px-1 d-flex align-items-center">
    <a href="javascript:void(0);" class="nav-link text-body p-0" id="iconSettings" onclick="mostrarMenuUsuario()">
      <i class="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
    </a>
  </li>
</div>

<!-- Script de SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>

<!-- Script para asignar enlaces a los botones del menú de ajustes -->
<script>
  function mostrarMenuUsuario() {
    Swal.fire({
      title: 'Ajustes',
      html: '<div class="user-popup">' +
          '<h5></h5>' +
          '<button class="btn btn-dark" onclick="activarCuenta()">Activa tu cuenta</button><br>' +
          '<button class="btn btn-dark" onclick="retirarDinero()">Retirar Dinero</button><br>' +
          '<button class="btn btn-dark" onclick="referidos()">Invita y Gana $</button><br>' +
          '<button class="btn btn-dark" onclick="contactarSoporte()">Soporte correo</button><br>' +
          '<button class="btn btn-dark" onclick="contactarSoporte1()">Soporte whatsapp</button><br>' +
          '<button class="btn btn-dark" onclick="preguntasFrecuentes()">Preguntas Frecuentes</button><br>' +
          '<div class="social-icons">' +
          '<a href="https://www.instagram.com/x19company/?hl=es-la" target="_blank"><i class="fab fa-instagram"></i></a>' +
          '<a href="https://www.facebook.com/profile.php?id=100063797706322" target="_blank"><i class="fab fa-facebook"></i></a>' +
          '</div><br>' +
          '<button class="btn btn-dark" onclick="cerrarSesion()">Cerrar Sesión</button>' +  
      '</div>',
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
    });
  }

  function activarCuenta() {
    window.location.href = 'activarplan.html';
  }
  
  function retirarDinero() {
    window.location.href = 'retirarr.html';
  }

  function referidos() {
    window.location.href = 'referidos.html'; 

  }

  function contactarSoporte() {
    window.location.href = 'mailto:x19soporte@gmail.com';
  }

  function contactarSoporte1() {
    window.location.href = 'https://wa.link/zs8m1q';
  }

  
  function preguntasFrecuentes() {
    window.location.href = 'info.html';
  }

  function cerrarSesion() {
    window.location.href = 'https://x19.glitch.me/';
  }
</script>

</body>
</html>





              </main>
   
  </div>

  
              </p>
           
  
           </div>
</div>
</div>
</div>
           
  
  
  
   <!-- End Navbar -->
    <div class="container-fluid py-4">
       <div class="row">
         <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
           <div class="card">
             <div class="card-header p-3 pt-2">
               <div class="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                 <i class="material-icons opacity-10">paid</i>
               </div>
               <div class="text-end pt-1">
                 <p class="text-sm mb-0 text-capitalize">Saldo</p>
                 <h4 class="mb-0">50$</h4>
               </div>
             </div>
             <hr class="dark horizontal my-0">
             <div class="card-footer p-3">
               <p class="mb-0"><span class="text-success text-sm font-weight-bolder">0 </span></p>
             </div>
           </div>
         </div>
         <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
           <div class="card">
             <div class="card-header p-3 pt-2">
               <div class="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                 <i class="material-icons opacity-10">person</i>
               </div>
               <div class="text-end pt-1">
                 <p class="text-sm mb-0 text-capitalize">Personas invitadas</p>
                 <h4 class="mb-0">0</h4>
               </div>
             </div>
             <hr class="dark horizontal my-0">
             <div class="card-footer p-3">
               <p class="mb-0"><span class="text-success text-sm font-weight-bolder">+0% </span></p>
             </div>
           </div>
         </div>
         <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
           <div class="card">
             <div class="card-header p-3 pt-2">
               <div class="icon icon-lg icon-shape bg-gradient-success shadow-success text-center border-radius-xl mt-n4 position-absolute">
                 <i class="material-icons opacity-10">subscriptions</i>
               </div>
               <div class="text-end pt-1">
                 <p class="text-sm mb-0 text-capitalize">Suscripciones</p>
                 <h4 class="mb-0">0</h4>
               </div>
             </div>
             <hr class="dark horizontal my-0">
             <div class="card-footer p-3">
               <p class="mb-0"><span class="text-danger text-sm font-weight-bolder">0%</span></p>
             </div>
           </div>
         </div>
         <div class="col-xl-3 col-sm-6">
           <div class="card">
             <div class="card-header p-3 pt-2">
               <div class="icon icon-lg icon-shape bg-gradient-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                 <i class="material-icons opacity-10">account_balance_wallet</i>
               </div>
               <div class="text-end pt-1">
                 <p class="text-sm mb-0 text-capitalize">Retirado</p>
                 <h4 class="mb-0">$0</h4>
               </div>
             </div>
             <hr class="dark horizontal my-0">
             <div class="card-footer p-3">
               <p class="mb-0"><span class="text-success text-sm font-weight-bolder">+0% </span></p>
             </div>
           </div>
         </div>
       </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-lg-8 col-md-6 mb-md-0 mb-4">
          <div class="card">
            <div class="card-header pb-0">
              <div class="row">
                <div class="col-lg-6 col-7">
                  <h6>Ganancias de los usuarios</h6>
                  <p class="text-sm mb-0">
                    <i class="fa fa-check text-info" aria-hidden="true"></i>
                    <span class="font-weight-bold ms-1">En el ultimo</span> mes
                  </p>
                </div>
                <div class="col-lg-6 col-5 my-auto text-end">
                  <div class="dropdown float-lg-end pe-4">
                    <a class="cursor-pointer" id="dropdownTable" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa fa-ellipsis-v text-secondary"></i>
                    </a>
                    <ul class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable">
                      <li><a class="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                      <li><a class="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                      <li><a class="dropdown-item border-radius-md" href="javascript:;">Something else here</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body px-0 pb-2">
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Referidos</th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Mas de 14.000 Usuarios Exitosos</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ganancias en referidos</th>
                      <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">$%</th>
                    </tr>
                  </thead>
               <tbody>
                    <tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="https://cdn.glitch.global/a6f66ce1-1b86-4f6e-b8be-9219f5afbb09/referir.png?v=1649527150340" class="avatar avatar-sm me-3" alt="xd">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">Referidos</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                                      <div class="avatar-group mt-2">
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Usuario 1">
        <img src="https://i.pravatar.cc/150?img=10" alt="Usuario 1">
    </a>
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Usuario 2">
        <img src="https://i.pravatar.cc/150?img=55" alt="Usuario 2">
    </a>
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Usuario 3">
        <img src="https://i.pravatar.cc/150?img=22" alt="Usuario 3">
    </a>
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Usuario 4">
        <img src="https://i.pravatar.cc/150?img=3" alt="Usuario 4">
    </a>
</div>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $43,697 </span>
                      </td>
                      <td class="align-middle">
                        <div class="progress-wrapper w-75 mx-auto">
                          <div class="progress-info">
                            <div class="progress-percentage">
                              <span class="text-xs font-weight-bold">53%</span>
                            </div>
                          </div>
                          <div class="progress">
                            <div class="progress-bar bg-gradient-info w-60" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      
                      </td>
                      </td>
                    </tr>
                    <tr>
                <center>
                      
                      </center>
           <div>
            <div>
 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
              
        
        <center>
        
        
        
     
       
          
 <!DOCTYPE html>
<html lang="en">

<head>
  <!-- Tu código de encabezado existente aquí -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.min.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.all.min.js"></script>

  <style>
    .blurred-task-container {
      position: relative;
      overflow: hidden;
    }

    .blurred-task {
      filter: blur(4px); /* Ajusta el valor según prefieras para el efecto de desenfoque */
    }

    #verTareasBtn {
      margin-top: 20px;
      display: none; /* Ocultar el botón inicialmente */
    }

    .modal-dialog {
      max-width: 400px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-6 offset-md-3">
        <!-- Otras secciones de tu página -->

        
        
        <!-- SweetAlert -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.4/dist/sweetalert2.all.min.js"></script>

        
        
        
        
        
        
        <!-- Tareas Extras -->
        <div class="card">
          <div class="card-header">
            <h6>Tareas Extras</h6>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
      <p>Activa tu cuenta para desbloquear las tareas</p>
          </div>
          <div class="card-body">
            <!-- Primera tarea extra -->
            <div class="blurred-task-container">
              <div class="blurred-task">
                <span class="timeline-step">
                  <i class="material-icons text-dark text-gradient">payments</i>
                </span>
                <div class="timeline-content">
                  <h6 class="text-dark text-sm font-weight-bold mb-0">Gana dinero invitando a amigos</h6>
                  <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">Hasta 20$ Diarios</p>
                </div>

                <button class="btn btn-info" id="b1" onclick="verAdvertencia(1)">Compartir por WhatsApp</button>
              </div>
            </div>

            <!-- Segunda tarea extra -->
            <div class="blurred-task-container">
              <div class="blurred-task">
                <span class="timeline-step">
                  <i class="material-icons text-warning text-gradient">reply</i>
                </span>
                <div class="timeline-content">
                  <h6 class="text-dark text-sm font-weight-bold mb-0">Comparte por WhatsApp</h6>
                  <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">Compartir enlace de invitación</p>
                </div>
                <button class="btn btn-info" id="b2" onclick="verAdvertencia(2)">Compartir por WhatsApp</button>
              </div>
            </div>

            <!-- Tercera tarea extra -->
            <div class="blurred-task-container">
              <div class="blurred-task">
                <span class="timeline-step">
                  <i class="material-icons text-warning text-gradient">reply</i>
                </span>
                <div class="timeline-content">
                  <h6 class="text-dark text-sm font-weight-bold mb-0">Comparte y Gana</h6>
                  <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">POR TIEMPO LIMITADO</p>
                </div>
                <button class="btn btn-info" id="b3" onclick="verAdvertencia(3)">Compartir por WhatsApp</button>
              </div>
            </div>

            <!-- Botón Ver Tareas -->
            <button class="btn btn-primary" id="verTareasBtn" onclick="verTareas()">Ver Tareas</button>
          </div>
        </div>
      </div>
    </div>
  </div>

 <script>
    function verAdvertencia(index) {
      Swal.fire({
        title: 'Aún no has activado tu cuenta',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Activar cuenta',
        cancelButtonText: 'Cerrar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirige a la página de activación de cuenta
          window.location.href = "activarplan.html";
        }
      });
    }

    function verTareas() {
      // Agrega aquí la lógica para mostrar las tareas
      // Puedes usar SweetAlert o cualquier otro método
    }
</script>


  <!-- Tu código adicional aquí -->

</body>

</html>
     
          
          
     
          
          

            </div>
          </div>
        </div>
      </div>
      <footer class="footer py-4  ">
        <div class="container-fluid">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-lg-6 mb-lg-0 mb-4">
              <div class="copyright text-center text-sm text-muted text-lg-start">
                © Asegurate de tener activo tu membresia para que se refleje tus $   <script>
                  document.write(new Date().getFullYear())
                </script>

            </div>
          </div>
        </div>
      </footer>
    </div>
  </main>

        
  
  
  
  
  
  
  
</body>

</html>

 
  `;

  try {
   
    await fs.writeFile(filePath, defaultHTMLContent);
    console.log(`Archivo HTML "${fileName}" creado exitosamente.`);
    
    
    reply.redirect(`/${fileName}`);
  } catch (error) {
    console.error(`Error al crear el archivo HTML "${fileName}":`, error);
    reply.status(500).send("Error al crear el archivo HTML.");
  }
});

fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Tu aplicación está escuchando en ${address}`);
  }
);  
