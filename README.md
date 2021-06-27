# ENDPOINTS

## Notas

-   **GET** - [/grupos/notas] - Obtener lista notas.✅
-   **GET** - [/grupos/notas/:idNota] - Obtener la info de una nota concreta.✅
-   **POST** - [/grupos/notas] - Insertar nueva nota.✅
-   **PUT** - [/grupos/notas/:idNota] - Editar una nota.✅
-   **DELETE** - [/grupos/notas/:idNota] - Eliminar una nota.✅
-   **POST** - [/grupos/notas/:idNota/valoracion] - Valorar una nota.✅
-   **GET** - [/grupos/notas/:idNota/mediavaloracion] - Obtener la media de las valoraciones.✅

## Grupos

- **GET** - [/grupos] - Obtener lista temas. ✅
- **GET** - [/grupos/:idGrupo] - Obtener la info de un tema concreto.✅
- **POST** - [/grupos/] - Insertar nueva tema.✅
- **PUT** - [/grupos/:idGrupo] - Editar nombre de un tema.✅
- **DELETE** - [/gruposs/:idGrupo] - Eliminar una tema.✅
- **POST** - [/grupos/:idGrupo/valoracion] - Valorar una tema.✅
- **GET** - [/grupos/:idGrupo/mediavaloracion] - Obtener la media de las vvaloraciones.✅

## Usuarios

-   **GET** - [/Usuarios/:idUsuario] - Obtener info de un usuario.✅
-   **POST** - [/Usuarios] - Crea un usuario pendiente de activar.✅
-   **POST** - [/Usuarios/login] - Logea a un usuario retornando un token.
-   **GET** - [/Usuarios/validacion/:CodigoRegistro] - Valida un usuario recién registrado.✅
-   **PUT** - [/Usuarios/:idUsuario] - Edita el nombre, el email o el avatar de un usuario.
-   **PUT** - [/Usuarios/:idUsuario/contraseña] - Editar contraseña.
-   **PUT** - [/Usuarios/contraseña/recuperarContraseña] - Envia un correo con el código de reseteo dse contraseña a un email.
-   **PUT** - [/Usuarios/contraseña/reset] - Cambia la contraseña de un usuario.
-   **DELETE** - [/Usuarios/:idUsuario] - Desactivar/Borra usuario.
