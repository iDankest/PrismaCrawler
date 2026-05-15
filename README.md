# PrismaCrawler

> Proyecto de Back-end desarrollado con Node.js, Express y Prisma ORM en el contexto del bootcamp de IronHack.

PrismaCrawler es un **Roguelike Dungeon Crawler** full-stack que separa magistralmente la lógica de renderizado y experiencia de juego (Frontend) de la gestión de contenido y economía (Backend). El backend actúa como un CMS y API REST utilizando Node.js y Prisma, mientras que el frontend combina una interfaz moderna en React con mecánicas de juego en HTML5 Canvas impulsadas por Phaser.

---

## Índice

- [Requisitos Previos](#requisitos-previos)
- [Características Principales](#características-principales)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Testing](#testing)
- [Autores](#autores)
- [Licencia](#licencia)

---

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado en su sistema:

- **Node.js** v18 o superior
- **PostgreSQL** (instancia local o en la nube)
- **npm** (incluido con Node.js)

---

## Características Principales

- **Autenticación Segura**: Sistema de registro e inicio de sesión utilizando JWT y contraseñas encriptadas con Bcrypt.
- **Motor de Juego Integrado**: Frontend orquestado con React 18+ y motor gráfico Phaser 4.20 para una experiencia de exploración inmersiva.
- **Gestión Dinámica de Mapas y Encadenamiento**: Diseño de niveles servido desde PostgreSQL con un sistema de **encadenamiento automático** (*Room Clearing*). Al eliminar a todos los enemigos de la sala, las puertas se abren permitiendo la transición al siguiente nivel, haciendo un fetch secuencial dinámico al backend.
- **Catálogo de Objetos en Base de Datos**: Los ítems del juego se generan a partir de una base de datos administrada centralmente en PostgreSQL y se almacenan en caché de memoria (`itemsDatabase.js`) en el cliente, aplicando *buffs* estadísticos en tiempo real.
- **Motor de Colisiones AABB**: Movimiento y colisiones calculadas de forma pura e iterativa (matemáticas de hitboxes), manteniendo una altísima optimización de rendimiento sin depender de costosos motores de físicas externos.
- **Progresión y Combate**: Combate direccional, cálculo de daño multiplicativo, cofres de botín dinámico y seguimiento exhaustivo de estadísticas (XP, pisos alcanzados, enemigos derrotados, daño total).
- **Perfiles y Leaderboard Global**: Sistema de perfiles con historial de las 5 mejores partidas por jugador y un Salón de la Fama global.

---

## Arquitectura del Proyecto

### Backend (Node.js, Express, Prisma, PostgreSQL/Supabase)
Sigue un patrón de diseño **Controller-Service**, donde las rutas HTTP derivan a controladores que manejan las respuestas (`req, res, next`), mientras que la lógica de negocio de la base de datos se delega en servicios especializados (`gameLogic.js`).

**Modelos de Dominio (Prisma):**
- `User`: Credenciales y RBAC (User/Admin).
- `Map`: Diseños de nivel prefabricados con un *layout* JSON y diccionarios de estadísticas.
- `Item`: Catálogo dinámico de objetos y efectos json.
- `Score`: Puntuaciones para las tablas de clasificación de la comunidad.

**Seguridad y Middlewares:**
- **Autenticación (JWT)**: Middleware para proteger rutas privadas decodificando el token del encabezado `Authorization`.
- **RBAC (Role-Based Access Control)**: Control estricto de permisos (ej: solo los usuarios `ADMIN` pueden inyectar nuevos mapas mediante `POST /api/game/map`).
- **Manejo Global de Errores**: Clase utilitaria `AppError` que captura y estandariza los códigos de estado HTTP y mensajes antes de enviarlos al cliente.

**Endpoints Principales (API REST):**
- `POST /api/users/register` | `POST /api/users/login` | `GET /api/users/profile` *(Autenticación y Perfiles)*
- `GET /api/game/items` *(Descarga de caché de objetos)*
- `GET /api/game/map/:id` | `POST /api/game/map` *(Gestión de Niveles)*
- `POST /api/game/score` | `GET /api/game/leaderboard` *(Clasificación)*

### Frontend (React, Vite, Tailwind CSS, Phaser)
El frontend desacopla estrictamente la lógica de la Interfaz de Usuario (React) de las rutinas por ciclo y mecánicas del juego (Phaser).
- **Orquestador UI (`Game.jsx` & `PhaserGame.jsx`)**: Gestionan la interfaz HUD flotante (vida, XP, inventario) y modales de Muerte/Reinicio, ejerciendo de puente mediante callbacks asíncronos (`onGameOver`, `onLevelExit`). También orquestan las llamadas `fetch` de los mapas para la paginación de salas.
- **Caché Local (`itemsDatabase.js`)**: Base de datos de *fallback* y memoria temporal que sincroniza los ítems de PostgreSQL con React, reduciendo las peticiones al servidor (*polling*) y suministrando objetos de forma instantánea a la escena.
- **GameScene (`gameScene.js`)**: Entorno puramente focalizado en la jugabilidad. Procesa la matriz enviada por el backend, dibuja baldosas, gestiona rutinas simples de IA de enemigos y el procesamiento matemático (colisiones y ataques).

---

## Instalación y Configuración

Siga los pasos indicados a continuación para poner en marcha el entorno de desarrollo en su máquina local.

### 1. Clonar el repositorio

```bash
git clone https://github.com/iDankest/PrismaCrawler.git
cd PrismaCrawler
```

### 2. Instalar dependencias del proyecto raíz

```bash
npm install
```

### 3. Configurar el backend

```bash
cd backend
npm install
```

### 4. Configurar las variables de entorno

Copie el archivo de plantilla y rellene sus credenciales. Asegúrese de que el archivo `.env` esté incluido en su `.gitignore`.

```bash
cp .env.example .env
```

Las variables de entorno requeridas son las siguientes:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/prismacrawler"
DIRECT_URL="postgresql://usuario:contraseña@localhost:5432/prismacrawler"
JWT_SECRET="su_clave_secreta"
PORT=3000
```

### 5. Sincronizar la base de datos con Prisma

Sincronice el esquema con su base de datos PostgreSQL, genere el cliente de Prisma y cree su primera migración:

```bash
npx prisma db push
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Iniciar la aplicación

Desde la raíz del proyecto, arranque el backend y el frontend de forma simultánea:

```bash
npm run dev
```

O bien, inícielos de forma independiente:

```bash
# Solo el backend
npm run start:back

# Solo el frontend
npm run start:front
```

---

## Estructura del Proyecto

El proyecto se organiza en dos módulos principales con una arquitectura de separación de responsabilidades:

```
PrismaCrawler/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Esquema de datos y modelos
│   │   └── migrations/         # Historial de migraciones
│   ├── src/
│   │   ├── config/             # Configuración de Prisma Client y variables globales
│   │   ├── controllers/        # Lógica de negocio y manejo de respuestas HTTP
│   │   ├── middlewares/        # Validación JWT, control de roles y manejo de errores
│   │   ├── routes/             # Definición de endpoints de la API REST
│   │   ├── services/           # Lógica específica del juego (combates, XP, inventario)
│   │   └── utils/              # Utilidades y clases de apoyo (ej. AppError)
│   └── tests/                  # Pruebas de integración con Jest y Supertest
├── frontend/                   # Aplicación cliente (React + Phaser)
│   ├── public/                 # Archivos estáticos accesibles públicamente
│   └── src/
│       ├── assets/             # Recursos gráficos, sprites y multimedia
│       ├── components/         # Componentes reutilizables de la UI (GameHeader, PhaserGame)
│       ├── pages/              # Vistas principales de la aplicación (Game, Login, etc.)
│       └── App.jsx / main.jsx  # Puntos de entrada y configuración de rutas
├── package.json                # Scripts y dependencias raíz
└── README.md
```

---

## Scripts Disponibles

Los siguientes scripts están disponibles desde la raíz del proyecto:

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Arranca el backend y el frontend simultáneamente (con `concurrently`) |
| `npm run start:back` | Inicia únicamente el servidor backend |
| `npm run start:front` | Inicia únicamente el cliente frontend |
| `npm test` | Ejecuta la suite de tests de integración |

---

## Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | v18+ | Entorno de ejecución |
| **Express** | — | Framework web para la API REST |
| **Prisma ORM** | — | Gestión de la base de datos y migraciones |
| **PostgreSQL** | — | Sistema de base de datos relacional |
| **JSON Web Token (JWT)** | ^9.0.3 | Autenticación basada en tokens |
| **BcryptJS** | ^3.0.3 | Encriptación segura de contraseñas |
| **Jest** | — | Framework de testing |
| **Supertest** | — | Testing de endpoints HTTP |

### Frontend

| Tecnología | Propósito |
|------------|-----------|
| **React** | Biblioteca principal para la interfaz de usuario (SPA) |
| **Vite** | Entorno de desarrollo súper rápido y *bundler* de módulos |
| **Phaser** | Motor de renderizado web y mecánicas del juego |
| **Tailwind CSS** | Framework de CSS para diseño responsivo y estilizado rápido |
| **React Router** | Enrutamiento protegido entre Login, Juego y Leaderboard |
| **Axios / Fetch** | Clientes HTTP para las comunicaciones con la API REST |

### Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **concurrently** | Ejecución paralela de scripts npm |
| **nodemon** | Reinicio automático del servidor en desarrollo |

---

## Testing y Metodología

El proyecto cuenta con una robusta suite de pruebas automatizadas construida sobre **Jest** y **Supertest**, siguiendo principios de la metodología **TDD (Test-Driven Development)** para garantizar la fiabilidad y resiliencia del código.

### Tipos de Pruebas Implementadas

- **Tests Unitarios**: Validación aislada de la lógica interna del juego, como los algoritmos matemáticos de combate y multiplicadores (`combat.test.js`) y la recuperación de la base de datos local de ítems (`items.test.js`).
- **Tests de Integración**: Comprobación de la interacción armónica entre los endpoints de la API de Express, los middlewares de seguridad (validación JWT) y la base de datos PostgreSQL usando Prisma (`api.test.js`, `db.test.js`, `auth.test.js`).
- **Tests End-to-End (E2E) - User Journey**: Simulación completa del ciclo de vida de los usuarios en el backend (`complete.test.js`). Prueba un flujo secuencial que incluye el registro de usuarios, asignación de roles, inicio de sesión, creación de niveles (Admin), petición de mapas y registro de puntuaciones (Jugador).

### Técnicas Avanzadas
- **Mocks y Spies**: Utilización intensiva de `jest.fn()` y `jest.spyOn()` para simular objetos de Express (`req`, `res`, `next`) en middlewares y aislar componentes de dependencias externas.
- **Aislamiento de BD**: Uso estratégico de los ciclos de vida de Jest (`beforeAll`, `afterEach`, `afterAll`) configurados para limpiar (cascade delete) y restablecer el estado de la base de datos en cada test, asegurando resultados predecibles y repetibles.

### Ejecución de las Pruebas

Para ejecutar la suite completa de pruebas e inspeccionar los casos evaluados:

```bash
cd backend
npm test
```

---

## Autores

Desarrollado como **Midterm Project** en IronHack por:

- **Kilian** — [@iDankest](https://github.com/iDankest)
- **Hades** — [@Hades-1496](https://github.com/Hades-1496)

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulte el archivo [LICENSE](./LICENSE) para más información.
