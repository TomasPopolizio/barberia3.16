# Barbería 3:16 — rediseño web

Rediseño conceptual del sitio de **Barbería 3:16** (Dr. Ramón Carrillo 2322, San Martín, Buenos Aires).
Hoy el local solo tiene la página estándar de AgendaPro. Esta propuesta le da identidad propia y simplifica la reserva.

## Qué resuelve

| Problema en la página actual | Cómo lo resuelve esta versión |
|---|---|
| No hay botón de reserva visible al entrar; arriba solo dice "Iniciar sesión" | "Reservar turno" en el header, en el hero y fijo abajo en el celular |
| El formulario obliga a cargar email, teléfono, fecha de nacimiento, edad y género | Solo nombre y WhatsApp |
| Servicios ordenados por precio: primero aparecen Cejas y Línea ($1.000) | Agrupados en Cortes, Barba y Combos; cejas y diseño como extras que se suman |
| Descripciones vacías o incorrectas ("." o "Corte de cabello + Barba" en otro servicio) | Nombres y notas claras, duración y precio a la vista |
| El local figura de 9 a 20, pero los barberos atienden hasta las 18 | Horarios reales por barbero; los turnos se generan con esos horarios |
| Colores genéricos (azul, verde, rojo) que no tienen nada que ver con el logo | Identidad tomada del local: pared blanca, letra pintada a mano, ladrillo y bronce |
| Se muestran 47 reseñas internas | Se destaca el 5,0 con 148 reseñas de Google |
| Barberos con el apellido cortado y sin info | Ficha de cada barbero con horario y botón "Reservar con…" |

## Flujo de reserva

1. **Servicio** (+ extras opcionales)
2. **Barbero** (Agustín, Enzo o "el primero libre")
3. **Día y hora** (próximos 12 días, turnos cada 30 min según el horario de cada barbero y la duración del servicio)
4. **Tus datos** (nombre y WhatsApp)

Al final se arma un mensaje de WhatsApp con todo el pedido.

> **Reserva:** el botón final abre WhatsApp con el pedido listo para mandar al local (11 2193-3162). Para probar sin escribirle al local, poné `CONFIG.DEMO` en `true` en `app.js`: así el mensaje se abre sin destinatario. También hay un enlace a la agenda online de AgendaPro.
>
> Los horarios disponibles salen del horario de atención, no de la agenda real. El turno queda confirmado cuando el local responde por WhatsApp.

## Estructura

```
index.html   página
styles.css   estilos (tema claro y oscuro)
app.js       datos del local, reseñas y lógica de reserva
img/         logo y fotos del local
```

Sin dependencias ni build: abrí `index.html` en el navegador.

## Publicarlo con GitHub Pages

El código está en la rama `main` de este repositorio. Para publicarlo gratis:

1. En el repo, entrá a **Settings → Pages**.
2. En **Source** elegí **Deploy from a branch**, rama **main**, carpeta **/ (root)**, y guardá.
3. En uno o dos minutos queda en `https://tomaspopolizio.github.io/barberia3.16/`.

## Datos

Servicios, precios, duraciones, barberos, horarios, dirección y reseñas tomados de la agenda online pública del local (octubre 2026). Las fotos de los barberos se cargan desde los servidores de AgendaPro; el resto está en `img/`. Las reseñas son de Google Maps y de la agenda online, con la ortografía corregida.
