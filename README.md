This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

## ✅ Vistas creadas en el frontend (`/app`)

### 1. Login (`/`)
- Formulario de login con validación usando **React Hook Form + Zod**.
- Envío de credenciales a la API (`/admin/login`) con `fetch` y `credentials: 'include'`.
- Si el login es exitoso, redirige a `/clients`.

---

### 2. Vista principal de clientes (`/clients`)
- Muestra una lista de clientes obtenidos desde la API.
- Link para agregar nuevo cliente.
- Permite redirigir a la página para **actualizar un cliente**.
- Permite **eliminar un cliente**.
- Modal de confirmación antes de eliminar.

---

### 3. Crear nuevo cliente (`/clients/new`)
- Formulario para crear un nuevo cliente.
- Validaciones con Zod (`identification`, `email`, `full_name`).
- Usa `POST http://localhost:1234/users`.

---

### 4. Creación de atributos personalizados (parte de `/clients/new`)
- En la misma vista donde se crea un nuevo cliente se permite:
  - Agregar atributos adicionales como campos dinámicos (ej: `cargo: gerente`, `edad: 40`).
  - Usa un estado separado (`attributes`) para manejarlos.
  - Los atributos nuevos se agregan con un botón que hace un `POST /attributes` y luego redirige a `/client/:id`.

---

### 5. Vista de detalle y edición del cliente (`/clients/[id]`)
- Objetivo: mostrar los datos del cliente y permitir actualizarlos.

#### Funcionalidades:
- Hace un `fetch` por ID al backend para obtener los datos del cliente.
- Completa el formulario con esos datos (`defaultValues`) usando React Hook Form.
- Permite modificar los datos y hacer un `PATCH` para actualizarlos.
- **Campos editables: Todos**.
- También puede incluir la edición o carga de nuevos atributos personalizados.

---

### 6. Crear nuevo admin (`/newAdmin`)
- Formulario dinámico con campos: `username`, `full_name`, `email`, `password`.
- Validación con **Zod + React Hook Form**.
- `password` es de tipo `"password"` y requiere mínimo 8 caracteres.
- Envío de datos con `fetch` (`POST` a `/admin`).
- Redirige al home al terminar.
- Incluye botón “Back”.
- Preparado para permitir atributos personalizados, aunque **no están implementados** en este código.

---

### 7. Header con navegación y logout
- Links a: **Login**, **Clients** y botón para **Logout**.
- Modal de confirmación antes de cerrar sesión.
- Hace `POST /admin/logout` y redirige a `/`.

---

### 8. Manejo de rutas públicas/privadas
- El layout es un **server component**, por lo tanto protege desde el lado del servidor.
- Los formularios y navegación son **client components**.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
