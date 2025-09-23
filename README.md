CodeQuest 2025 Blog

Cumpliendo con las indicaciones para los grupos participantes del CodeQuest de DevTalles edición del 2025 presentamos una Web App moderna, con diseño responsive, creada en el front con framework Nextjs, TypeScript y Tailwind CSS.

Este desarrollo se encuentra en producción en [https://dt-blog-2025.levaxonline.com](https://dt-blog-2025.levaxonline.com)

Si prefiere correr en local por defecto su navegador abrira en [http://localhost:3000](http://localhost:3000). A menos que personalice la url.

Frontend

Next.js - React framework con App Router
TypeScript - Tipado
Tailwind CSS - Framework de CSS
shadcn/ui - UI components
React Icons - Librería de iconos
React Hook Form - Librería de formulario

Integración con Backend

JWT Authentication - Para verificar usuarios al login
Cookie Management - Para mantener estado de usuario sin uso de context 

## Ejecución en Local del FrontEnd

1. Git clone del proyecto
2. npm install

```bash
npm run dev

```
3.- Correr en local utilice el comando 

```bash
npm run dev

```

## Detalles del proyecto

Para evitar mayores configuraciones de env en desarrollo local:

- Hemos creado un sistema de rutas que utiliza env de Nextjs pero no necesitan configuración manual.
config/api.ts

- La idea con la que se diseñó este proyecto es que blog sea parte del sitio web y su acceso sea restringuido a usuarios ya registrados, por lo tanto la ruta "/" se programó a la redirección del login de usuarios.

## Accesos

- Para acceder como usuario de tipo user: [https://dt-blog-2025.levaxonline.com/login](https://dt-blog-2025.levaxonline.com/login)

- Para acceder como usuario de tipo admin: [https://dt-blog-2025.levaxonline.com/admin](https://dt-blog-2025.levaxonline.com/admin/)

- Para acceder a endpoint utilizados: [https://codequest-backend-2025.onrender.com/api#/](https://codequest-backend-2025.onrender.com/api#/)
## Usuarios Muestras

```bash
usuario: auroralevanti@levaxonline.com
password: 12345678910
```

## Deploy en Vercel

Este proyecto se limita al FrontEnd del CodeQuest 2025, y está desplegado en Vercel. El backend tiene su propio despliege, el cual demora unos segundos en responder, ya que estamos usando la cap gratuita

Para mas detalle del backend, por favor referirse a la documentación del mismo.