# Tribooh Go! — Ruleta de premios

Web simple en HTML + CSS + JS (sin frameworks, sin backend) para girar una ruleta y descargar un premio en JPG.

## Estructura del proyecto

```
tribooh-go/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── logo.png, ruleta.png, flecha.png, boton-girar.png, ganaste.png, click-aqui.png
    └── premios/
        ├── btn-*.png   → el "botón" con el nombre de cada premio (pantalla de resultado)
        └── jpg-*.jpg   → el archivo que se descarga al hacer click
```

## ⚠️ Pendiente: premio "Rompecabezas"

Falta el arte final de este premio. Por ahora, **tanto el botón con el nombre
como el JPG descargable de "Rompecabezas" son una copia de los de "Diploma"**
(`btn-rompecabezas.png` y `jpg-rompecabezas.jpg`). La ruleta sigue siendo
justa (1/6 de probabilidad cada premio), solo que si cae en ese gajo, por
ahora premia con el diploma duplicado.

Cuando tengas el arte definitivo, simplemente reemplazá esos dos archivos
(mismo nombre, misma carpeta) y no hay que tocar nada de código.

## Cómo probarlo en VSCode

Abrir `index.html` haciendo doble click (protocolo `file://`) **funciona para
ver el diseño**, pero el botón de descarga puede no funcionar bien por
restricciones del navegador con archivos locales. Para probarlo como si fuera
la web real, usá un servidor local:

1. Instalá la extensión **Live Server** en VSCode.
2. Click derecho sobre `index.html` → **"Open with Live Server"**.
3. Se abre solo en el navegador y el botón de descarga funciona perfecto.

(Alternativa sin extensión: `python3 -m http.server 8000` parado en la carpeta
del proyecto, y entrar a `http://localhost:8000`.)

## Cómo publicarlo en GitHub Pages

1. Creá un repo nuevo en GitHub (puede ser público o privado, GitHub Pages
   funciona en ambos casos si tenés cuenta Pro; en cuenta free tiene que ser
   público).
2. Subí estos archivos a la rama `main`, manteniendo la estructura de
   carpetas tal cual está.
3. En el repo: **Settings → Pages → Build and deployment → Source: "Deploy
   from a branch"** → Branch: `main`, carpeta `/ (root)` → **Save**.
4. Esperá 1-2 minutos. La URL queda en la misma pantalla, con el formato:
   `https://tu-usuario.github.io/nombre-del-repo/`

## Cosas que podés ajustar fácilmente

- **Colores / fondo**: variables CSS al principio de `css/style.css`
  (`--azul-fondo`, `--crema`, `--rosa`).
- **Velocidad del giro**: en `js/script.js`, constante `DURACION_GIRO_MS`
  (también hay que actualizar `transition-duration` en `.ruleta.girando`
  dentro de `css/style.css` para que coincidan).
- **Cantidad de vueltas antes de frenar**: constante `VUELTAS_MINIMAS` en
  `js/script.js` (es solo estético, no afecta el resultado).
- **Probabilidades**: hoy los 6 premios tienen la misma chance (1/6). Si en
  algún momento querés que alguno salga menos seguido, hay que cambiar la
  función `elegirPremioRandom()` en `js/script.js` por una versión con pesos.
- **Texto "Girar de nuevo"**: lo agregué yo como mejora de UX (no estaba en
  el Figma) para que se pueda volver a jugar sin recargar la página. Si no lo
  querés, se borra el botón en `index.html` (`#btn-otra-vez`) y su línea
  correspondiente en `js/script.js`.

## Notas técnicas

- La tipografía **Fredoka One** se carga desde Google Fonts en el `<head>`
  del HTML. Como todo el texto visible ya viene "horneado" en las imágenes
  PNG, hoy esa fuente no se ve en ningún lado — la dejé cargada por si en el
  futuro agregás texto real (por ejemplo, un campo para que el chico escriba
  su nombre en el diploma).
- Los PNG de la carpeta `assets/` fueron recortados y comprimidos respecto a
  los originales de Figma (que traían mucho margen transparente y pesaban
  4-5x más) para que la web cargue más rápido. Los JPG de `assets/premios/`
  (los que se descargan) se dejaron en su resolución original para que se
  vean bien si alguien los imprime.
