# 🛡️ PrismaCrawler - API Backend

Bienvenido al núcleo de **PrismaCrawler**, un motor Rogue-like desarrollado con Node.js, Express y Prisma ORM. Este servidor gestiona la persistencia de datos, la lógica de juego y la seguridad de los usuarios mediante JWT.

---

## 🚀 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **PostgreSQL** (Instancia local o en la nube)
- **npm** (Gestor de paquetes)

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

### 1. Entrar en la carpeta del backend

```bash
cd backend
```

### 2. Instalar todas las dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de plantilla y rellena tus credenciales personales (asegúrate de que el `.env` esté en tu `.gitignore`):

```bash
cp .env.example .env
```

### 4. Sincronizar la Base de Datos con Prisma

Genera el cliente y ejecuta las migraciones para crear las tablas físicas en PostgreSQL:

```bash
npx prisma migrate dev --name init
```

### 5. Arrancar el servidor

Para desarrollo con reinicio automático (nodemon):

```bash
npm run dev
```

---

## 🏗️ Estructura del Proyecto

El código sigue una arquitectura de separación de responsabilidades para facilitar el testing y la escalabilidad:

```
src/
├── config/          # Configuración de Prisma Client y variables globales
├── controllers/     # Lógica de negocio y manejo de respuestas
├── middlewares/     # Validación JWT, control de roles y manejo de errores
├── routes/          # Definición de endpoints de la API REST
└── services/        # Lógica específica del juego (combates, XP, inventario)

prisma/
├── schema.prisma    # Esquema de datos
└── migrations/      # Archivos de migración
```

---

## 🧪 Testing

Para cumplir con los requisitos de calidad técnica, el proyecto incluye un conjunto de **8 tests de integración** con Jest y Supertest. Puedes ejecutarlos con:

```bash
npm test
```

---

## 🛠️ Tecnologías Principales

| Tecnología | Propósito |
|-----------|-----------|
| **Express** | Framework web minimalista |
| **Prisma** | ORM moderno para PostgreSQL |
| **JWT** | Autenticación basada en tokens |
| **BcryptJS** | Encriptación de contraseñas |
| **Jest/Supertest** | Suite completa para testing |

---

## 👥 Créditos

Desarrollado como **Midterm Project** por Kilian y Hades.

---

**¡Que disfrutes aventurándote en PrismaCrawler!** 🎮✨