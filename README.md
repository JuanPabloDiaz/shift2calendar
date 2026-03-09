# Costco Schedule to Calendar

Convierte tu horario de Costco en eventos de calendario (.ics) para importar a Google Calendar.

## Características

- 🌙 Modo oscuro/claro
- 🌐 Soporte español e inglés
- 📅 Exporta a formato .ics
- 🔔 Recordatorio fijo de 30 min + recordatorio adicional configurable
- 🍽️ Recordatorio automático de lunch para turnos mayores a 5 horas (avisa antes de la 5ta hora)
- 📆 Resumen semanal de horas opcional en la descripción del evento
- ✅ Integración directa con Google Calendar (crear eventos)
- 📊 Integración con Google Sheets (guardar horas y pago estimado)
- 📱 Diseño responsivo
- ⌨️ Entrada manual sin necesidad de AI

## Cómo usar

### Opción 1: Página web - Entrada manual

1. Abre `index.html` en tu navegador
2. En el paso 3, haz clic en **"Manual"**
3. Selecciona la fecha, hora de inicio y hora de fin
4. Haz clic en **"+"** para agregar el turno
5. Repite para cada día
6. Haz clic en **"Generar y descargar .ics"**
7. Importa el archivo a Google Calendar

### Opción 2: Página web - Con AI

1. Abre `index.html` en tu navegador
2. En el paso 3, asegúrate de estar en **"JSON"**
3. Copia el prompt (botón **"Copy prompt"**)
4. Abre [ChatGPT](https://chatgpt.com) o [Claude](https://claude.ai) y pega el prompt
5. Adjunta la foto de tu horario de Costco
6. La AI te devolverá un JSON
7. Copia el JSON y pégalo en el campo de texto
8. Haz clic en **"Generar y descargar .ics"**
9. Importa el archivo a Google Calendar

### Opción 3: Script de Python (sin navegador)

1. Ejecuta el script: `python script_schedule_costco.py`
2. El script te mostrará un prompt para usar en Claude.ai
3. Sube tu foto del schedule a Claude.ai y pídele el JSON
4. Pega el JSON cuando el script te lo pida
5. Escribe `fin` y presiona Enter
6. Se genera un archivo `.ics` en la misma carpeta
7. Se abre Google Calendar para importarlo

### Opción 4: Envío directo a Google (Juan Diaz)

1. Abre `index.html` en tu navegador
2. Genera los turnos con JSON o entrada manual
3. En la sección **"Solo para Juan Diaz"**, haz clic en **"Connect Google"**
4. Usa **Calendar**, **Sheets** o **Both** para enviar los datos

Notas:
- Para cada turno se crea un recordatorio fijo de 30 minutos antes del inicio.
- Si el turno es mayor a 5 horas, se crea además un evento de aviso de lunch antes de cumplir 5 horas trabajadas.

## Formato del JSON

```json
{
  "period": "3/02/26 - 3/08/26",
  "shifts": [
    {"date": "2026-03-02", "start": "9:00A", "end": "5:00P", "hours": "8.00"}
  ]
}
```

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
3. Configuración > Importar y exportar > Importar

## Tecnologías

- HTML5
- CSS3 (CSS Variables para theming)
- JavaScript vanilla
- Python 3 (script CLI)
- Sin dependencias externas

## Desarrollador

Juan Diaz
