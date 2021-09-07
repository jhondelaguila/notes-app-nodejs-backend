require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

const { PORT } = process.env;

const existeGrupo = require("./middlewares/existeGrupo");
const existeUsuario = require("./middlewares/existeUsuario");
const puedeEditarGrupo = require("./middlewares/puedeEditarGrupo");
const existeNota = require("./middlewares/existeNota");
const puedeEditarNota = require("./middlewares/puedeEditarNota");
const usuarioAutorizado = require("./middlewares/usuarioAutorizado");

const {
  listaNotas,
  infoNota,
  nuevaNota,
  valorarNota,
  editarNota,
  borrarNota,
  mediaValoracionNota,
  obtenerNotasUsuario,
} = require("./controladores/notas");

const {
  listaGrupos,
  infoGrupo,
  nuevoGrupo,
  valorarGrupo,
  editarGrupo,
  borrarGrupo,
  mediaValoracionGrupo,
  listaGruposUsuario,
} = require("./controladores/grupos");

const {
  obtenerUsuario,
  usuarioNuevo,
  validarUsuario,
  loginUsuario,
  editaUsuario,
  editaContraseña,
  recuperarContraseña,
  cambiarContraseña,
  borrarUsuario,
  cargarImagenAvatar,
} = require("./controladores/usuarios");

app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use("/uploads", express.static("./uploads"));

/**
 * #####################
 * ## Endpoints Notas ##
 * #####################
 */

app.get("/grupos/notas", listaNotas);
app.get("/grupos/notas/:idNota", existeNota, infoNota);
app.get(
  "/grupos/notas/usuario/:idUsuario",
  usuarioAutorizado,
  obtenerNotasUsuario
);
app.post("/grupos/notas", usuarioAutorizado, nuevaNota);
app.post(
  "/grupos/notas/:idNota/valoracion",
  usuarioAutorizado,
  existeNota,
  valorarNota
);

app.put(
  "/grupos/notas/:idNota",
  usuarioAutorizado,
  existeNota,
  puedeEditarNota,
  editarNota
);
app.delete(
  "/grupos/notas/:idNota",
  usuarioAutorizado,
  existeNota,
  puedeEditarNota,
  borrarNota
);
app.get(
  "/grupos/notas/:idNota/mediavaloracion",
  existeNota,
  mediaValoracionNota
);

/**
 * ######################
 * ## Endpoints Grupos ##
 * ######################
 */

app.get("/grupos", listaGrupos);
app.get("/grupos/:idUsuario", usuarioAutorizado, listaGruposUsuario);
app.get("/grupos/:idGrupo", existeGrupo, infoGrupo);
app.post("/grupos", usuarioAutorizado, nuevoGrupo);
app.post(
  "/grupos/:idGrupo/valoracion",
  usuarioAutorizado,
  existeGrupo,
  valorarGrupo
);
app.put(
  "/grupos/:idGrupo",
  usuarioAutorizado,
  existeGrupo,
  puedeEditarGrupo,
  editarGrupo
);
app.delete(
  "/grupos/:idGrupo",
  usuarioAutorizado,
  existeGrupo,
  puedeEditarGrupo,
  borrarGrupo
);
app.get("/grupos/:idGrupo/mediavaloracion", existeGrupo, mediaValoracionGrupo);

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */
app.get(
  "/Usuarios/:idUsuario",
  usuarioAutorizado,
  existeUsuario,
  obtenerUsuario
);
//Crea un usuario nuevo "da error"
app.post("/Usuarios", usuarioNuevo);
// Validar usuario
app.post("/Usuarios/validacion", validarUsuario);
//Login de usuario
app.post("/Usuarios/login", loginUsuario);
//Editar usuario
app.put("/Usuarios/:idUsuario", usuarioAutorizado, existeUsuario, editaUsuario);
//Edita contraseña
app.put(
  "/Usuarios/:idUsuario/password",
  usuarioAutorizado,
  existeUsuario,
  editaContraseña
);
//Envia correo de recuperación
app.put("/Usuarios/contrasena/recuperarContrasena", recuperarContraseña);
// Resetear contraseña de usuario con un código de recuperación.
app.put("/Usuarios/contrasena/reset", cambiarContraseña);
//Eliminar usuario.
app.delete(
  "/Usuarios/:idUsuario",
  usuarioAutorizado,
  existeUsuario,
  borrarUsuario
);

app.post("/Usuarios/upload-avatar", usuarioAutorizado, cargarImagenAvatar);

/**
 * #######################
 * ## Error & Not Found ##
 * #######################
 */

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
