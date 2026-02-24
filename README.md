# Costco Schedule to Calendar

Convierte tu horario de Costco en eventos de calendario (.ics) para importar a Google Calendar.

## Características

- 🌙 Modo oscuro/claro
- 🌐 Soporte español e inglés
- 📅 Exporta a formato .ics
- 📱 Diseño responsivo
- ⌨️ Entrada manual sin necesidad de AI

## Cómo usar

### Opción 1: Entrada manual (más fácil)

1. Abre la página
2. En el paso 3, haz clic en "Manual"
3. Selecciona la fecha, hora de inicio y hora de fin
4. Haz clic en "+" para agregar el turno
5. Repite para cada día
6. Haz clic en "Generar y descargar .ics"
7. Importa el archivo a Google Calendar

### Opción 2: Con Claude AI

1. Abre la página
2. Ingresa tu nombre exactamente como aparece en el horario
3. Copia el prompt (botón "Copy prompt")
4. Abre [Claude](https://claude.ai) y pega el prompt
5. Adjunta la foto de tu horario de Costco
6. Claude te devolverá un JSON
7. Copia el JSON y pégalo en el campo de texto (asegúrate de estar en la pestaña "JSON")
8. Haz clic en "Generar y descargar .ics"
9. Importa el archivo a Google Calendar

### Opción 3: JSON personalizado

También puedes pegar tu propio JSON:

```json
{
  "period": "3/02/26 - 3/08/26",
  "shifts": [
    {"date": "2026-03-02", "start": "9:00A", "end": "5:00P", "hours": "8.00"},
    {"date": "2026-03-03", "start": "9:00A", "end": "5:00P", "hours": "8.00"}
  ]
}
```

## Formato del JSON

| Campo | Descripción |
|-------|-------------|
| `period` | Período del horario (ej: "3/02/26 - 3/08/26") |
| `shifts` | Array de turnos |
| `date` | Fecha en formato YYYY-MM-DD |
| `start` | Hora de inicio (ej: "9:00A", "1:00P") |
| `end` | Hora de fin (ej: "5:00P", "9:00P") |
| `hours` | Horas del turno (ej: "8.00") |

## Importar a Google Calendar

1. Descarga el archivo .ics
2. Ve a [Google Calendar](https://calendar.google.com)
3. Importa el archivo en Configuración > Importar y exportar

## Tecnologías

- HTML5
- CSS3 (CSS Variables para theming)
- JavaScript vanilla
- Sin dependencias externas

## Desarrollador

Juan Diaz
