# ENDPOINTS

## Notas

-   **GET** - [/temas/notas] - Obtener lista notas.✅
-   **GET** - [/temas/notas/:idNota] - Obtener la info de una nota concreta.✅
-   **POST** - [/temas/notas] - Insertar nueva nota.✅
-   **PUT** - [/temas/notas/:idNota] - Editar una nota.✅
-   **DELETE** - [/temas/notas/:idNota] - Eliminar una nota.✅
-   **POST** - [/temas/notas/:idNota/valoracion] - Valorar una nota.✅
-   **GET** - [/temas/notas/:idNota/mediavaloracion] - Obtener la media de las valoraciones.

## Temas

- **GET** - [/temas] - Obtener lista temas. ✅
- **GET** - [/temas/:idTema] - Obtener la info de un tema concreto.✅
- **POST** - [/temas/] - Insertar nueva tema.✅
- **PUT** - [/temas/:idTema] - Editar nombre de un tema.✅
- **DELETE** - [/temas/:idTema] - Eliminar una tema.✅
- **POST** - [/temas/:idTema/valoracion] - Valorar una tema.✅
- **GET** - [/temas/:idTema/mediavaloracion] - Obtener la media de los votos.

## Usuarios

-   **GET** - [/Usuarios/:idUsuario] - Obtener info de un usuario.✅
-   **POST** - [/Usuarios] - Crea un usuario pendiente de activar.✅
-   **POST** - [/Usuarios/login] - Logea a un usuario retornando un token.
-   **GET** - [/Usuarios/validacion/:CodigoRegistro] - Valida un usuario recién registrado.
-   **PUT** - [/Usuarios/:idUsuario] - Edita el nombre, el email o el avatar de un usuario.
-   **PUT** - [/Usuarios/:idUsuario/contraseña] - Editar contraseña.
-   **PUT** - [/Usuarios/contraseña/recuperarContraseña] - Envia un correo con el código de reseteo dse contraseña a un email.
-   **PUT** - [/Usuarios/contraseña/reset] - Cambia la contraseña de un usuario.
-   **DELETE** - [/Usuarios/:idUsuario] - Desactivar/Borra usuario.
