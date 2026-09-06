# En memoria de Iván

Blog conmemorativo. La gente puede leer las entradas, ver las fotos y dejar un
recuerdo sin registrarse.

Hecho con Next.js 16 (App Router) y Tailwind v4. **No usa base de datos**: los
recuerdos se guardan en archivos JSON en el disco del servidor.

---

## Para trabajar en local

```bash
npm install
npm run dev      # http://localhost:3000
```

---

## Cómo cambiar el contenido

Todo el texto y las fotos salen de dos archivos. No hace falta tocar el diseño.

| Qué quieres cambiar | Archivo |
| --- | --- |
| Nombre, años, frase de la portada, menú | `content/site.ts` |
| Las entradas del blog y sus fotos | `content/posts.ts` |
| El texto de la portada (presentación y mini-biografía) | `app/page.tsx` |
| La página «Sobre él» | `app/sobre-el/page.tsx` |

### Publicar una entrada nueva

1. Guarda las fotos en `public/img/` (por ejemplo `public/img/oaxaca-01.jpg`).
2. En `content/posts.ts`, copia una de las entradas que ya están y cambia:
   - `slug`: la parte final de la dirección (`/historias/mi-entrada`). Único, en
     minúsculas, sin acentos ni espacios.
   - `title`, `date` (formato `AAAA-MM-DD`), `place`, `excerpt`.
   - `body`: un texto por párrafo.
   - `cover` y `gallery`: la ruta de cada foto y su `alt` (la descripción para
     quien no puede ver la imagen — escríbela siempre).
3. Guarda y vuelve a compilar. La entrada aparece sola en la portada, en
   `/historias` y en `/galeria`, y trae su propio espacio de recuerdos.

### Las fotos de muestra

Las imágenes de `public/img/*.svg` son paisajes generados, marcadores de
posición. Se pueden volver a generar con:

```bash
node scripts/generate-placeholders.mjs
```

Cuando entren las fotos reales (JPG o WebP), Next las optimiza solo: el código
que las sirve ya distingue entre SVG y foto.

Si el sitio va a tener muchas fotos reales, conviene instalar `sharp` en el
servidor para que la optimización sea más rápida:

```bash
npm install sharp
```

---

## Los recuerdos (comentarios)

- Se guardan en `DATA_DIR/comentarios/<slug>.json`, un archivo por entrada.
- Si no se define `DATA_DIR`, se usa la carpeta `data/` del proyecto.
- El archivo se escribe primero en un temporal y luego se renombra, para que un
  corte a medias no lo deje truncado.
- Los envíos simultáneos se encolan por entrada, así que dos personas comentando
  al mismo tiempo no se pisan.

**Para borrar un recuerdo** (por si alguien escribe algo fuera de lugar): abre
el archivo JSON de esa entrada, quita el bloque `{ ... }` correspondiente,
guarda y reinicia la aplicación.

### Contra el spam

Como cualquiera puede comentar sin registrarse, hay tres filtros, en
`lib/actions.ts`:

- **Campo trampa**: un campo oculto que sólo llenan los bots.
- **Sin enlaces**: se rechaza cualquier mensaje que contenga una dirección web.
- **Límite por IP**: 4 recuerdos cada 10 minutos.

Los tres se pueden ajustar en las constantes `LIMITS`, `LINK_PATTERN` y
`RATE_LIMIT` de ese mismo archivo.

---

## Subir a Hostinger (plan de Node.js)

1. **Sube el código** al repositorio que tengas conectado, o por Git desde el
   panel de Hostinger.
2. **Comandos de la aplicación** (son los que ya trae `package.json`):
   - Build: `npm run build`
   - Start: `npm run start`
3. **Variable de entorno**, en el panel de la aplicación:

   ```
   DATA_DIR=/home/TU_USUARIO/datos-ivan
   ```

   Apúntala a una carpeta **fuera** del proyecto. Así los recuerdos sobreviven
   a cualquier despliegue nuevo. Crea la carpeta antes del primer despliegue.
4. **Respaldos**: copia esa carpeta de vez en cuando. Es todo lo que la gente
   escribió, y no está en ningún otro lado.

> El único punto delicado del montaje es ese: los recuerdos viven en el disco
> del servidor. Si algún día el sitio se mueve a otro hosting, hay que llevarse
> la carpeta `DATA_DIR` a mano.

---

## Notas de diseño

- **Sólo tema claro**, a propósito. La idea es papel, luz y aire; una versión
  oscura rompería ese tono.
- **Tipografías**: Fraunces para los títulos, Newsreader para el texto corrido.
- **Movimiento**: transiciones largas y lentas. Quien tenga activada la opción
  del sistema de «reducir movimiento» no ve ninguna animación.
- Los colores, tamaños y estilos compartidos están todos en `app/globals.css`.

## Estructura

```
app/
  page.tsx                  portada
  historias/page.tsx        índice de entradas
  historias/[slug]/page.tsx una entrada + sus recuerdos
  galeria/page.tsx          todas las fotos
  sobre-el/page.tsx         biografía
  globals.css               paleta, tipografía y estilos compartidos
components/
  comments/                 formulario y lista de recuerdos
  gallery-grid.tsx          mosaico con vista ampliada
  hero-sky.tsx              el cielo de la portada
content/
  site.ts                   datos del sitio
  posts.ts                  las entradas
lib/
  comments.ts               guardado en disco
  actions.ts                validación y anti-spam del formulario
scripts/
  generate-placeholders.mjs genera las imágenes de muestra
```
