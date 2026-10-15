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

> **Modo demo:** en `app.js`, `CONFIG.DEMO` está en `true`, así el mensaje se abre en WhatsApp sin destinatario y no le llega al local. Ponelo en `false` para usar el número real.
>
> Los horarios disponibles salen del horario de atención, no de la agenda real. En una versión productiva se conectaría con la API de AgendaPro o se usaría su enlace de reserva.

## Estructura

```
index.html   página
styles.css   estilos (tema claro y oscuro)
app.js       datos del local y lógica de reserva
```

Sin dependencias ni build: abrí `index.html` en el navegador.

## Subirlo a GitHub

```bash
# 1. Creá un repositorio vacío en github.com (por ejemplo: barberia-316)
# 2. Desde esta carpeta:
git remote add origin https://github.com/TU-USUARIO/barberia-316.git
git push -u origin main
```

Para publicarlo gratis: en el repo, **Settings → Pages → Branch: main / root**. En un minuto queda en `https://TU-USUARIO.github.io/barberia-316/`.

## Datos

Servicios, precios, duraciones, barberos, horarios, dirección y reseñas tomados de la agenda online pública del local (octubre 2026). Las fotos se cargan desde los servidores de AgendaPro.
