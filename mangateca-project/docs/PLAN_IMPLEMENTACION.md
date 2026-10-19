# Plan: Mangateca en React + Tailwind (sin backend)

## Contexto

Mangateca existía como sitio vanilla JS (HTML por página + servicios en `localStorage`). En la rama `migration/react` se limpió todo y quedó un esqueleto Vite + React 19 + Tailwind v4 vacío (`src/App.jsx` es una función vacía). Los datos simulados están en `db/` (`products.json` = 36 productos: 15 BOOK, 9 MANGA, 12 COMIC; `categories.json` = 17 categorías; `users.json` = admin + cliente). El objetivo es reconstruir la tienda como SPA en React: home con buscador en tiempo real y carruseles, catálogo por tipo, detalle de producto, carrito, favoritos, login/registro con 3 roles y un panel de administración CRUD. Todo persiste en `sessionStorage`.

Lo que se reutiliza del historial git (commit `6d8ca76`):
- Iconos SVG en `assets/icons/*.svg` (user, favorite, shopping-cart, cart-add, search, logout, shield) → se convierten en componentes React con `currentColor`.
- Listas curadas de "Más vendidos" y "Recomendados" en `src/pages/home.js`.
- La lógica de `cart-service.js`, `wishlist-service.js` y `auth-service.js` → se pasa a stores de zustand.

## Decisiones clave

| Tema | Decisión |
|---|---|
| Router | `react-router` v8 (8.4.0) en modo datos: `createBrowserRouter` + `RouterProvider`. La API es la misma que en v7. |
| Estado | `zustand` v5 + middleware `persist` con `createJSONStorage(() => sessionStorage)`, centralizado en `src/lib/storage.js`. Para pasar a `localStorage` se cambia una sola línea. |
| Datos semilla | Se importan `db/*.json` con Vite. Si `sessionStorage` está vacío se usan como estado inicial; después mandan los cambios del admin. |
| Detalle de producto | Modal con `<dialog>` nativo controlado por el parámetro `?producto=:id`. Se monta en el layout raíz, así funciona desde cualquier página (carrusel, buscador, catálogo, favoritos). Se puede compartir el enlace y el botón Atrás lo cierra. |
| Carrusel | CSS `scroll-snap` nativo + botones ‹ ›, sin dependencias. El deslizamiento táctil viene incluido. |
| Novedades | Los 10 productos con `id` más alto. Así los que crea el admin aparecen primero. |
| Más vendidos / Recomendados | Arrays de IDs en `src/data/featured.js`, copiados de `home.js`. Si falta un id (el admin lo borró), se omite. |
| Carrito | Uno por sesión de navegador. El carrito de invitado se conserva al iniciar sesión y se vacía al cerrar sesión. |
| Favoritos | Por usuario: `{ [userId]: number[] }`. Un invitado que pulsa ♥ ve un toast y es redirigido a `/login` (con enlace a registro). Tras el login vuelve a la página de origen. |
| Sesión | `authStore` guarda solo `currentUserId`. El usuario se obtiene de `usersStore`, así un cambio de rol hecho por el admin se aplica al instante. La contraseña nunca se guarda en la sesión. |
| Lenguaje | Se mantiene JavaScript (JSX), igual que el esqueleto actual. |

**Nota:** las contraseñas quedan en texto plano en `users.json` y `sessionStorage`. Es aceptable solo porque es una simulación sin backend.

## Paleta y diseño

El texto blanco sobre `#4FB59B` tiene un contraste de ~2.5:1, que **no cumple WCAG AA**. Por eso se define una escala:
- `brand-500 #4FB59B`: rellenos, acentos, badges, iconos activos y texto oscuro encima.
- `brand-700 ≈ #2E7D69` (~4.9:1 sobre blanco): botones primarios con texto blanco, enlaces y estado activo de la navegación.
- `brand-50/100`: fondos suaves (hero, chips).

Se definen en `src/style.css` con `@theme { --color-brand-* }` de Tailwind v4. Fondo blanco, bordes `gray-200`, sombras suaves, `rounded-xl` y tipografía sans del sistema.

## Estructura de archivos

```
index.html                 # lang="es", un solo favicon, quitar <link> a style.css
src/
  main.jsx                 # import './style.css'; <RouterProvider router={router} />
  router.jsx               # definición de rutas (admin con lazy)
  style.css                # @import "tailwindcss"; @theme brand
  data/featured.js         # bestsellerIds, recommendedIds
  lib/
    storage.js             # sessionStorage para persist()
    format.js              # formatPrice (Intl USD), formatDate (es)
    search.js              # normalize() sin tildes, matchProduct(q) título/autor/ISBN
    validation.js          # email, password ≥ 8, ISBN 10/13, precio > 0, requeridos
  stores/
    productsStore.js       # products + add/update/delete (id = max+1)
    usersStore.js          # users + register/add/update/delete (username/email únicos)
    authStore.js           # currentUserId, login(identifier, pass), logout
    cartStore.js           # items [{productId, quantity}], add/setQuantity/remove/clear
    favoritesStore.js      # byUser, toggle(userId, productId)
    toastStore.js          # sin persistencia
  hooks/
    useCurrentUser.js      # { user, isAdmin, isLoggedIn }
    useProductModal.js     # open(id) / close() vía useSearchParams
    useFavorite.js         # { isFavorite, toggle } + redirección de invitados
    useCartSummary.js      # count, total; ignora productos borrados
  components/
    icons/index.jsx        # User, Heart, Cart, CartAdd, Search, Logout, Shield, Menu, X, Chevron
    layout/RootLayout.jsx  # Header + <Outlet/> + Footer + ProductDetailModal + Toaster + ScrollRestoration
    layout/Header.jsx
    layout/Footer.jsx
    product/ProductCard.jsx, ProductCarousel.jsx, ProductGrid.jsx,
            ProductDetailModal.jsx, FavoriteButton.jsx, AddToCartButton.jsx, Cover.jsx
    search/SearchBar.jsx
    ui/Modal.jsx (<dialog>), Button.jsx, Badge.jsx, Toaster.jsx, EmptyState.jsx, ConfirmDialog.jsx
    auth/RequireAuth.jsx, RequireAdmin.jsx, GuestOnly.jsx
  pages/
    HomePage.jsx, CatalogPage.jsx, FavoritesPage.jsx, CartPage.jsx,
    LoginPage.jsx, RegisterPage.jsx, NotFoundPage.jsx
    admin/AdminLayout.jsx, AdminProductsPage.jsx, AdminUsersPage.jsx,
          ProductForm.jsx, UserForm.jsx
```

`src/App.jsx` se elimina porque lo reemplaza `router.jsx`.

## Rutas

```
/                → HomePage
/productos       → CatalogPage (todos; admite ?q=&categoria=&orden=)
/libros          → CatalogPage type="BOOK"
/mangas          → CatalogPage type="MANGA"
/comics          → CatalogPage type="COMIC"
/carrito         → CartPage (pública)
/favoritos       → RequireAuth → FavoritesPage
/login, /registro→ GuestOnly → LoginPage / RegisterPage
/admin           → RequireAdmin → AdminLayout (lazy)
   index → redirige a productos; /admin/productos; /admin/usuarios
*                → NotFoundPage
```

Los guards son componentes que devuelven `<Navigate to="/login" state={{ from: location }} replace />` y reaccionan al store. Así, cerrar sesión estando en `/admin` expulsa al usuario de inmediato.

## Componentes principales

**Header** (sticky, blanco, `border-b`)
- Izquierda: logo `/favicon.svg` + "Mangateca".
- Centro: `NavLink` a Productos, Libros, Mangas y Comics, con el activo en `brand-700`.
- Derecha: tres botones solo con icono SVG y `aria-label`:
  - Usuario: si es invitado, va a `/login`. Si hay sesión, abre un menú con el nombre, "Panel de administración" (solo admin) y "Cerrar sesión".
  - Favoritos: con badge de cantidad.
  - Carrito: con badge que suma las cantidades.
- En móvil: botón hamburguesa con un panel de navegación.

**Footer**: cuatro columnas.
- Marca: logo + lema.
- Explorar: Productos, Libros, Mangas, Comics.
- Mi cuenta: Iniciar sesión, Favoritos, Carrito.
- Contacto: email, teléfono y dirección simulados, más iconos de redes.

Abajo, una franja con "© 2026 Mangateca".

**SearchBar** (en el hero de Home)
- Input controlado. El filtrado usa `useDeferredValue(query)` para que la escritura siga fluida.
- Busca con `matchProduct` en título, autor e ISBN, sin distinguir tildes ni mayúsculas.
- Debajo despliega un panel con hasta 6 resultados (portada mini, título, autor, precio) y un enlace "Ver todos" a `/productos?q=...`.
- Si no hay resultados, muestra "No se encontraron productos".
- Accesibilidad: patrón combobox ARIA (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, `listbox`/`option`). ↑/↓ navegan, Enter abre el modal y Esc cierra.
- Se cierra al hacer clic fuera y se reabre al enfocar el input si hay texto.

**ProductCarousel** `({ title, products })`
- Encabezado con título y botones ‹ ›, que hacen `scrollBy` del ancho visible.
- Pista `flex overflow-x-auto snap-x snap-mandatory` con la scrollbar oculta.
- Las tarjetas tienen ancho fijo responsive.
- Los botones se desactivan en los extremos (escuchando `scroll`).

**ProductCard**
- Portada con proporción 2/3, badge del tipo, título en 2 líneas, autor y precio.
- `FavoriteButton` superpuesto y botón rápido de carrito.
- Al hacer clic se abre el modal.

**Cover**
- Atributos `loading="lazy"`, `decoding="async"` y `referrerPolicy="no-referrer"` (el CDN de myanimelist puede bloquear hotlinking por referer).
- `onError`: muestra un placeholder con el título.

**ProductDetailModal**
- Contenido: portada, chips de categorías (`categoryIds` → nombres), título, autor, precio y sinopsis (`description`).
- Bloque "Detalles": ISBN, publicación formateada y disponibilidad ("Disponible" / "Agotado").
- Acciones:
  - Selector de cantidad + "Agregar al carrito" (desactivado si `available === false`).
  - `FavoriteButton` con texto.
- Usa `<dialog>.showModal()`: el foco queda atrapado, Esc cierra (evento `cancel`) y un clic en el backdrop cierra. Al cerrarse se quita `?producto`.
- Si el id no existe, el modal no se abre.

**CatalogPage**
- Título según el tipo, chips de categorías presentes en ese tipo y un select de orden (destacados, precio ↑/↓, título, fecha).
- Los filtros viven en `useSearchParams`.
- `ProductGrid` responsive (2/3/4/5 columnas) y `EmptyState` si no hay resultados.

**CartPage**
- Cada línea muestra portada, título, precio unitario, stepper (1–10), subtotal y botón quitar.
- Resumen con número de artículos y total.
- "Finalizar compra" abre una confirmación de compra simulada; al confirmarla se vacía el carrito y aparece un toast de éxito.
- Si el carrito está vacío: `EmptyState` + enlace a productos.

**FavoritesPage**: grid de favoritos del usuario actual + `EmptyState`.

**Login / Registro**
- Formularios con `useActionState` de React 19 (form actions) y `useId` para los labels.
- Login acepta usuario o email. Ante un error muestra un mensaje genérico ("Usuario o contraseña incorrectos").
- Registro valida: username y email únicos, formato de email, contraseña ≥ 8 caracteres y confirmación de contraseña.
- El registro crea el usuario con `role: "client"` e inicia sesión automáticamente.
- Tras el éxito redirige a `location.state.from` o a `/`.

**Admin** (cargado con `lazy` → bundle aparte)
- `AdminLayout`: pestañas Productos / Usuarios.
- Productos:
  - Tabla (mini portada, título, tipo, autor, precio, disponible, acciones) con un buscador que reutiliza `matchProduct`.
  - "Nuevo producto" y "Editar" abren `ProductForm` en un `Modal`. Campos: título, tipo, autor, sinopsis, ISBN, fecha, categorías (checkboxes desde `categories.json`), precio, disponible e imageUrl con preview.
  - "Eliminar" pide confirmación con `ConfirmDialog`.
- Usuarios:
  - Tabla (usuario, email, rol, fecha de alta) con crear, editar y eliminar mediante `UserForm`. Al editar, la contraseña es opcional.
  - Reglas: no se puede eliminar al propio usuario y no se puede eliminar ni degradar al último admin.

## Buenas prácticas a seguir

- **Selectores de zustand v5:** devolver primitivos o usar `useShallow`. Derivar arrays con `useMemo` para evitar renders en bucle. Los productos borrados se filtran al hidratar el carrito y los favoritos.
- **Tablas del admin:** `key` estable (`product.id`).
- **React 19:**
  - `<title>` dentro de cada página (React 19 lo sube al `<head>`).
  - `ref` como prop, sin `forwardRef`.
  - `useActionState` en los formularios y `useDeferredValue` en la búsqueda.
- **Accesibilidad:** HTML semántico (`header`, `nav`, `main`, `footer`, `section` con `aria-labelledby`), `focus-visible:ring-brand-500` y `aria-label` en todos los botones que solo tienen icono.
- **Persistencia:** `version` en cada `persist()` para poder migrar el esquema más adelante.

## Orden de implementación

1. **Base:**
   - `npm i react-router zustand`.
   - Limpiar `index.html` (`lang="es"`, quitar el favicon duplicado y el `<link>` a CSS) e importar el CSS en `main.jsx`.
   - Tokens `@theme` en `style.css`.
   - `router.jsx`, `RootLayout`, `Header`, `Footer` e iconos.
2. **Datos:** `lib/*` y los seis stores con semillas de `db/`, más `data/featured.js`.
3. **Catálogo:** `Cover`, `ProductCard`, `ProductCarousel`, `ProductGrid`, `HomePage` (hero + 3 carruseles) y `CatalogPage`.
4. **Detalle:** `useProductModal`, `Modal`, `ProductDetailModal`, `AddToCartButton`, `FavoriteButton`, `useFavorite` y `Toaster`.
5. **Buscador:** `SearchBar` con dropdown y navegación por teclado.
6. **Auth:** `LoginPage`, `RegisterPage` y los guards. Menú de usuario en el header.
7. **Carrito y favoritos:** `CartPage` (compra simulada) y `FavoritesPage`.
8. **Admin:** layout, CRUD de productos y CRUD de usuarios con sus reglas.
9. **Pulido:** 404, estados vacíos, revisión responsive (390px / 768px / 1280px), `npm run lint` y `npm run build`.

## Verificación

1. `npm run lint` y `npm run build` sin errores. El chunk de admin debe salir separado.
2. `npm run dev`, recorriendo los flujos en el navegador (con la skill `run` / Chrome si está disponible):
   - **Home:** tres carruseles con desplazamiento por botones y por swipe; en Novedades aparecen los ids más altos.
   - **Buscador:**
     - Escribir "berserk" muestra resultados en vivo. "garcia" encuentra "García Márquez" (sin tildes).
     - ↑/↓/Enter abren el modal y Esc cierra. Hacer clic fuera cierra el panel.
   - **Detalle:**
     - Abrir desde un carrusel; la URL muestra `?producto=3`. Recargar con la URL mantiene el modal abierto y el botón Atrás lo cierra.
     - Comprobar todos los campos.
   - **Invitado:**
     - Puede agregar al carrito y cambiar cantidades; el badge se actualiza.
     - Al pulsar ♥ ve un toast y va a `/login`. Entrar a `/favoritos` o `/admin` también redirige a `/login`.
   - **Registro:**
     - Crear un usuario nuevo inicia sesión automáticamente y ya puede usar favoritos.
     - Intentar registrar un username o email duplicado muestra un error.
   - **Persistencia:**
     - Recargar mantiene la sesión, el carrito, los favoritos y los cambios del admin.
     - Al cerrar la pestaña y abrir una nueva, todo vuelve a la semilla (comportamiento de `sessionStorage`).
   - **Cliente** (`cliente` / `Cliente_Manga2026!`): favoritos funcionan, pero no ve el enlace al panel y `/admin` redirige.
   - **Admin** (`admin` / `Admin_Manga2026!`):
     - Crear un producto hace que aparezca en Novedades y en el buscador. Editar el precio se refleja en carrito y modal. Al eliminarlo desaparece del carrito y de los favoritos.
     - En el CRUD de usuarios, eliminarse a sí mismo o al último admin está bloqueado.
   - **Cerrar sesión:** estando en `/admin` el usuario es expulsado y el carrito se vacía.
   - **Responsive:** el menú hamburguesa funciona en móvil y no hay scroll horizontal.

---

## Notas de implementación

Esta sección se añadió después de implementar el plan. El plan de arriba se conserva tal como se aprobó; aquí se registran las diferencias con el código final.

### Cambios de nombres y archivos

| En el plan | En el código |
|---|---|
| `hooks/useCartSummary.js` | `hooks/useCart.js` |
| `hooks/useFavorite.js` | `hooks/useFavorites.js` (exporta `useFavorite` y `useFavoriteProducts`) |
| `auth/RequireAuth.jsx`, `RequireAdmin.jsx`, `GuestOnly.jsx` | Los tres en `components/auth/Guards.jsx` |
| `ui/Badge.jsx` | No se creó: el contador del Header está dentro de `Header.jsx` |

### Archivos añadidos que no estaban en el plan

- `data/catalog.js`: tipos de producto y nombres de categorías.
- `data/navigation.js`: enlaces del menú, compartidos por Header y Footer.
- `lib/cn.js`: utilidad para unir clases CSS.
- `hooks/useDismiss.js`: cierra menús y paneles al hacer clic fuera o pulsar Esc.
- `components/auth/AuthCard.jsx`: marco común de login y registro.
- `components/layout/Container.jsx`, `PageLoader.jsx` y `RouteError.jsx`.
- `components/ui/FormFields.jsx`, `QuantityStepper.jsx` y `buttonStyles.js`.

### Ajustes técnicos

- **React Router 8:** `RouterProvider` se importa de `react-router/dom` (cambio de la versión 8).
- **Color coral** (`#E85D5D`, tomado del logo) para el corazón de favoritos.
- **Notificaciones como `popover`:** así aparecen por encima del modal de detalle abierto.
- **Corrección del cierre de sesión:** al cerrar sesión desde `/favoritos` o `/admin`, el guard redirigía a `/login` en vez de a la portada. Ahora se navega primero con `navigate('/', { flushSync: true })` y después se ejecuta `logout()`.
- **`README.md`:** se reemplazó la plantilla de Vite por la documentación completa del sistema.

### Verificación realizada

- `npm run lint` y `npm run build` sin errores. El panel de admin se genera en chunks separados.
- Recorrido automatizado en Chrome headless con 95 comprobaciones de los flujos de la sección **Verificación**: todas pasaron y no hubo errores de consola. El script de prueba quedó fuera del repositorio.
