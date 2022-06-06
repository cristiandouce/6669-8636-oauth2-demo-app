# OAuth2 Demo App para la materia Criptografía y Seguridad Informática [66.69][86.36]

El presente repositorio contiene dos aplicaciones web para demostrar el flujo de autenticación y autorización OAuth2 presentado en la materia de Criptografía y Seguridad Informática de la [FIUBA](https://fi.uba.ar).

1. [Web Server](./packages/web-server/)
2. [AuthZ Server](./packages/authz-server/)

## Aplicaciones

Ambos servicios se encuentra hoy deployados en la plataforma de Heroku:

- Web Application (client): https://fiuba-cripto-6669-8636-web.herokuapp.com/
- Authorization Server: https://fiuba-cripto-6669-8636-authz.herokuapp.com/

### Web Server [./packages/web-server/](./packages/web-server/)

La primer application es un simple servidor web con dos pantallas implementadas. Una pública y otra privada. La pantalla privada requiere previa autenticación y autorización por parte del usuario para que la aplicación (**Cliente** en el modelo OAuth2) pueda solicitar información privada para mostrar de este. Como **Cliente** OAuth2, la aplicación web se encuentra registrada en el **Authorization Server**, identificada por el uso de un `client_id` y `client_secret`.

La misma se ha construido utilizando paquetes y librerías de código abierto. Algunas de notable mención son:

- [PassportJS](https://github.com/jaredhanson/passport)
- [Passport OAuth2 Strategy](https://github.com/jaredhanson/passport-oauth2)
- [ExpressJS](https://github.com/expressjs/express)
- [Bootstrap](https://github.com/twbs/bootstrap)

### Authz Server [./packages/authz-server/](./packages/authz-server/)

La segunda aplicación implementa un **Authorization Server**. El mismo se ha construido por simple utilización de una librería de código abierto que simplifica la interfaz de construcción de servidores OAuth. La implementación de la intefaz para un **Authorization Server** que permite realizar el flujo de `Code Exchange` se encuentra en [./packages/authz-server/lib/adapter](./packages/authz-server/lib/adapter).
Algunas de las librerías de código abierto notables de mención son:

- [Node OAuth2 Server](https://github.com/oauthjs/node-oauth2-server)
- [Express OAuth2 Server](https://npmjs.org/package/express-oauth-server)
- [PassportJS](https://github.com/jaredhanson/passport)
- [Passport Local Strategy](https://github.com/jaredhanson/passport-local)

## Instalación

Para correr las aplicaciones primero se debe tener instalado [NodeJS](https://nodejs.com) en el sistema operativo. Una vez instalado, y descargados (o clonados) los archivos de este repositorio, debe correr el siguiente comando desde el directorio raiz del proyecto:

```bash
npm install
```

## Inicialización

Es necesario correr las dos aplicaciones de forma paralela para poder observar el flujo completo.

Para correr el servidor del **Authorization Server**, desde la linea de comando debe correr el siguiente script:

```bash
SERVER=authz npm run start
```

Para correr el servidor de la **Aplicación Web (el cliente)**, desde la linea de comando (una adicional) debe correr el siguiente script:

```bash
SERVER=web npm run start
```

## Almacenamiento

Ambas aplicaciones tienen la posibilidad de correr dos modos de almacenamiento:

1. En Memoria
2. MongoDB

### Modo de almacenamiento en memoria

Es el modo de almacenamiento por defecto. Todos los datos necesarios para correr el **Authorization Server** son cargados desde un archivo estático ubicado en el directorio de [./packages/authz-server/lib/db/fixtures](./packages/authz-server/lib/db/fixtures/).

### Modo de almacenamiento en MongoDB

El modo de almacenamiento en MongoDB puede especificarse agregando la variable de entorno `STORE_PROVIDER=mongodb` al momento de correr cualquiera de los servidores. Por ejemplo:

```bash
SERVER=authz STORE_PROVIDER=mongodb npm run start
```

:warning: Para correr los servicios se necesita tener previvaente instalado y corriendo un servidor MongoDB. Para especificar la URL de connección debe usar la variable de entorno `DATABASE_URL` cuando ejecuta el comando de inicio de los servicios. Por ejemplo:

```bash
SERVER=web DATABASE_URL=mongodb://localhost:27027/my-db npm run start
```

Por defecto la URL utiliza `localhost` como dominio local a ubicar la base de datos de MongoDB.

#### Fixtures

Para que el modo de almacenamiento en MongoDB funcione para el **Authorization Server** es necesario incertar primero en la base de datos los fixtures desde el archivo estático ubicado en [./packages/authz-server/lib/db/fixtures](./packages/authz-server/lib/db/fixtures/).

Esta tarea puede realizarse de dos maneras posibles. La primera sería corriendo el comando de migración de datos a mano, empleando el comando

```bas
DATABASE_URL=<llenar-con-mongodb-database-uri> npm run migrations:run
```

La segunda forma y quizá la más segura para no estar manipulando el usuario y password para conectarse a la base de datos, es dejar que el **Authorization Server** corra las migraciones cuando se inicializa. Para ello, hay que agregar las siguientes dos variables de entorno al comando que corre:

```bash
SERVER=authz DATABASE_URL=<llenar-con-mongodb-database-uri> RUN_MIGRATIONS=true npm run start
```
