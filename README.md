# PrismaCrawler

> Proyecto de Back-end desarrollado con Node.js, Express y Prisma ORM en el contexto del bootcamp de IronHack.

PrismaCrawler es una aplicación web full-stack de estilo **Rogue-like** que combina un servidor REST robusto con un cliente frontend moderno. El backend gestiona la persistencia de datos, la lógica de juego y la autenticación segura de usuarios mediante JWT.

---

## Índice

- [Requisitos Previos](#requisitos-previos)
- [Características Principales](#características-principales)
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
- **Motor de Juego Integrado**: Frontend desarrollado con React y motor gráfico Phaser para una experiencia de exploración de mazmorras inmersiva en HTML5 Canvas.
- **Gestión de Mapas**: Los niveles son servidos por la API REST desde PostgreSQL, contando además con un sistema de _fallback_ procedural en el cliente.
- **Progresión y Estadísticas**: Sistema de combate, cálculo de daño, recolección de experiencia (XP), sistema de curación y paneles flotantes de inventario y estadísticas.
- **Leaderboard Global**: Salón de la fama con el top 10 de jugadores globales destacando su desempeño.

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

## Testing

El proyecto incluye una suite de **8 tests de integración** que cubren los principales endpoints de la API. Para ejecutarlos:

```bash
cd backend
npm test
```

---

## Autores

Desarrollado como **Midterm Project** en IronHack por:

- **Kilian** — [@iDankest](https://github.com/iDankest)
- **Hades**

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulte el archivo [LICENSE](./LICENSE) para más información.
