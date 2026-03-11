# Schedule to Calendar

Convierte una imagen de tu horario en eventos de calendario (.ics) para importar a Google Calendar.

## Características

### Core Features

- 🌙 **Modo oscuro/claro** - Diseño adaptable con colores optimizados para ambos temas
- 🌐 **Soporte español e inglés** - Interfaz completamente bilingüe
- 📅 **Exporta a formato .ics** - Compatible con Google Calendar, Apple Calendar, Outlook
- 📱 **Diseño responsivo** - Funciona perfectamente en móvil, tablet y escritorio
- ⌨️ **Entrada manual** - No requiere AI si prefieres ingresar turnos manualmente

### Smart Features

- 🔔 **Recordatorios inteligentes**:
  - Recordatorio fijo de 30 minutos antes de cada turno
  - Recordatorio adicional configurable (15 min, 1h, 2h, 3h, 1 día)
- 🍽️ **Recordatorio automático de lunch** - Para turnos >5 horas, avisa 30 min antes de cumplir 5 horas
- 📆 **Resumen semanal** - Muestra total de horas y días trabajados en la descripción del evento
- 👁️ **Preview automático** - Visualiza todos los turnos detectados ANTES de generar/enviar
- ⚠️ **Validación anticipada** (Solo Juan Diaz) - Detecta semanas ya existentes en Sheets antes de enviar

### Google Integration (Juan Diaz)

- ✅ **Google Calendar** - Crea eventos directamente sin descargar .ics
- 📊 **Google Sheets** - Guarda automáticamente horas y pago estimado
- 📈 **Dashboard de estadísticas** - Visualiza horas trabajadas, ganancias, progreso a siguiente aumento
- 💰 **Cálculo automático** - Horas regulares, premium dominical, sick time acumulado

## Cómo usar

### Opción 1: Entrada Manual

1. Abre `index.html` en tu navegador
2. Selecciona el tipo de imagen (Horario impreso / App Kronos)
3. Ingresa tu nombre exactamente como aparece en el horario
4. En el paso 4, haz clic en **"Manual"**
5. Ingresa fecha, hora de inicio y hora de fin
6. Haz clic en **"+"** para agregar el turno
7. Repite para cada turno
8. **📋 Preview automático** - Verás todos los turnos detectados agrupados por semana
9. Revisa que la información sea correcta
10. Haz clic en **"Generar y descargar .ics"**
11. Importa el archivo a Google Calendar

### Opción 2: Con AI (Recomendado)

1. Abre `index.html` en tu navegador
2. Selecciona el tipo de imagen (Horario impreso / App Kronos)
3. Ingresa tu nombre exactamente como aparece en el horario
4. Copia el prompt (botón **"Copy prompt"**)
5. Abre [ChatGPT](https://chatgpt.com), [Claude](https://claude.ai), o [Gemini](https://gemini.google.com)
6. Pega el prompt y adjunta la foto de tu horario
7. La AI te devolverá un JSON
8. Copia el JSON y pégalo en el campo de texto del paso 4
9. **📋 Preview automático** - Verás inmediatamente todos los turnos detectados
10. **⚠️ Validación** (Solo Juan Diaz autenticado) - Se marcan las semanas que ya existen en Sheets
11. Revisa que todo esté correcto
12. Haz clic en **"Generar y descargar .ics"** o envía directamente a Google

### Opción 3: Script de Python (sin navegador)

1. Ejecuta el script de Python del proyecto
2. El script te mostrará un prompt para usar en Claude.ai
3. Sube tu foto del schedule a Claude.ai y pídele el JSON
4. Pega el JSON cuando el script te lo pida
5. Escribe `fin` y presiona Enter
6. Se genera un archivo `.ics` en la misma carpeta
7. Se abre Google Calendar para importarlo

### Opción 4: Envío Directo a Google (Solo Juan Diaz)

1. Abre `index.html` en tu navegador
2. Asegúrate de que tu nombre sea **"Diaz, Juan"**
3. Genera los turnos con JSON o entrada manual
4. En la sección **"Solo para Juan Diaz"**, haz clic en **"Connect Google"**
5. Inicia sesión con tu cuenta de Google
6. **⚠️ Validación automática** - Las semanas existentes se marcan en el preview
7. Selecciona dónde enviar:
   - **Calendar** - Crea eventos en Google Calendar (omite duplicados)
   - **Sheets** - Guarda en Google Sheets (pregunta antes de sobreescribir)
   - **Both** - Envía a ambos
8. Opcionalmente:
   - **Open Sheet** - Abre tu hoja de cálculo en Google Sheets
   - **View Stats** - Ve tu dashboard de estadísticas

### Ver Estadísticas

1. Abre `stats.html` en tu navegador
2. Inicia sesión con tu cuenta de Google
3. Visualiza:
   - Total de horas trabajadas
   - Ganancias totales (regular + premium dominical)
   - Promedio de horas por semana
   - Sick time acumulado
   - Progreso hacia siguiente aumento (1000 horas)
   - Gráficas de horas y ganancias a lo largo del tiempo

## Notas Importantes

- **Recordatorios**: Cada turno incluye un recordatorio fijo de 30 minutos + uno adicional configurable
- **Lunch**: Para turnos >5 horas, se crea automáticamente un recordatorio de lunch 30 min antes de cumplir 5 horas
- **Validación**: El preview muestra todos los turnos ANTES de generar/enviar, permitiéndote revisar la información
- **Duplicados en Calendar**: Se omiten automáticamente
- **Duplicados en Sheets**: Te pregunta si quieres sobreescribir
- **Múltiples períodos**: Puedes pegar JSON con varias semanas y se procesarán todas automáticamente

## Formato del JSON

```json
{
  "period": "3/02/26 - 3/08/26",
  "shifts": [
    { "date": "2026-03-02", "start": "9:00A", "end": "5:00P", "hours": "8.00" }
  ]
}
```

| Campo    | Descripción                                   |
| -------- | --------------------------------------------- |
| `period` | Período del horario (ej: "3/02/26 - 3/08/26") |
| `shifts` | Array de turnos                               |
| `date`   | Fecha en formato YYYY-MM-DD                   |
| `start`  | Hora de inicio (ej: "9:00A", "1:00P")         |
| `end`    | Hora de fin (ej: "5:00P", "9:00P")            |
| `hours`  | Horas del turno (ej: "8.00")                  |

## Importar a Google Calendar

1. Descarga el archivo .ics
2. Ve a [Google Calendar](https://calendar.google.com)
3. Configuración > Importar y exportar > Importar

## Tecnologías

- **Frontend**: HTML5, CSS3 (CSS Variables para theming), JavaScript vanilla
- **APIs**: Google Calendar API, Google Sheets API, Google Identity Services
- **Charts**: Chart.js (solo en stats.html)
- **Icons**: Font Awesome (solo en stats.html)
- **Python**: Script CLI opcional (sin dependencias externas)
- **Sin frameworks**: No requiere Node.js, npm, ni build process

## Arquitectura

### Archivos Principales

- `index.html` - Aplicación principal para generar calendarios
- `stats.html` - Dashboard de estadísticas (requiere autenticación)
- `script.js` - Lógica principal (validación, ICS, Google APIs)
- `stats.js` - Lógica de estadísticas y gráficas
- `styles.css` - Estilos compartidos con theming

### Flujo de Datos

1. **Input**: JSON de AI o entrada manual → Validación en tiempo real
2. **Preview**: Agrupación por semanas → Detección de duplicados (si está autenticado)
3. **Output**:
   - Descarga .ics para importar
   - Envío directo a Google Calendar
   - Guardado en Google Sheets
   - Visualización en stats dashboard

### Características Técnicas

- **Theming dinámico**: CSS Variables que cambian según `data-theme`
- **Sin estado del servidor**: Todo el procesamiento en el cliente
- **Caché de tokens**: Google tokens guardados en localStorage
- **Validación en tiempo real**: JSON se valida mientras escribes
- **Preview reactivo**: Se actualiza automáticamente al pegar JSON o agregar shifts
- **Detección de duplicados**: Consulta a Sheets antes de mostrar preview (solo owner)

## Configuración (Solo para Juan Diaz)

Edita las constantes en `script.js` si cambian tus parámetros:

```javascript
const HOURLY_RATE = xx; // Tarifa por hora
const SUNDAY_RATE = HOURLY_RATE * 1.5; // Premium dominical
const HOURS_FOR_NEXT_RAISE = 1000; // Horas para siguiente aumento
const SICK_TIME_ACCRUAL_RATE = 1 / 30; // 1 hora sick time por 30 trabajadas
```

## Desarrollador

**Juan Diaz**

---

_No afiliado con ninguna empresa. Esta herramienta es un proyecto personal para facilitar la gestión de horarios._
