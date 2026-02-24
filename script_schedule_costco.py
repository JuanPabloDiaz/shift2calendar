#!/usr/bin/env python3
"""
Costco Schedule -> Google Calendar
==================================
1. Sube tu foto del schedule a Claude.ai y pidele el JSON
2. Pega el JSON cuando el script te lo pida
3. Se genera un archivo .ics en la misma carpeta del script
4. Se abre Google Calendar para importarlo
"""

import json
import uuid
import webbrowser
import time
from datetime import datetime, date, timedelta
from collections import defaultdict
import sys
import os

# helpers

def parse_time(time_str: str, ref_date: date) -> datetime:
    time_str = time_str.strip().upper()
    am_pm = time_str[-1]
    time_part = time_str[:-1]

    if ':' in time_part:
        hour, minute = map(int, time_part.split(':'))
    else:
        hour, minute = int(time_part), 0

    if am_pm == 'P' and hour != 12:
        hour += 12
    elif am_pm == 'A' and hour == 12:
        hour = 0

    return datetime(ref_date.year, ref_date.month, ref_date.day, hour, minute)

def to_ics_dt(dt: datetime) -> str:
    return dt.strftime('%Y%m%dT%H%M%S')

def make_event(shift: dict) -> str:
    ref_date = datetime.strptime(shift['date'], '%Y-%m-%d').date()
    start_dt = parse_time(shift['start'], ref_date)
    end_dt   = parse_time(shift['end'],   ref_date)
    uid = str(uuid.uuid4())
    now = datetime.now().strftime('%Y%m%dT%H%M%SZ')

    return (
        "BEGIN:VEVENT\n"
        f"UID:{uid}\n"
        f"DTSTAMP:{now}\n"
        f"DTSTART:{to_ics_dt(start_dt)}\n"
        f"DTEND:{to_ics_dt(end_dt)}\n"
        "SUMMARY:Costco\n"
        "COLOR:grape\n"
        f"DESCRIPTION:Turno Costco - {shift.get('hours', '')} hrs\n"
        "END:VEVENT\n"
    )

def merge_shifts(shifts: list) -> list:
    by_date = defaultdict(list)
    for s in shifts:
        by_date[s['date']].append(s)

    merged = []
    for day, day_shifts in sorted(by_date.items()):
        ref = datetime.strptime(day, '%Y-%m-%d').date()
        starts = [parse_time(s['start'], ref) for s in day_shifts]
        ends   = [parse_time(s['end'],   ref) for s in day_shifts]

        fixed_ends = []
        for st, en in zip(starts, ends):
            if en <= st:
                en += timedelta(days=1)
            fixed_ends.append(en)

        earliest_start = min(starts)
        latest_end     = max(fixed_ends)
        total_hours    = sum(float(s['hours']) for s in day_shifts)

        merged.append({
            'date':  day,
            'start': earliest_start.strftime('%-I:%M') + ('A' if earliest_start.hour < 12 else 'P'),
            'end':   latest_end.strftime('%-I:%M')     + ('A' if latest_end.hour < 12 else 'P'),
            'hours': f'{total_hours:.2f}'
        })
    return merged

def build_ics(shifts: list) -> str:
    shifts = merge_shifts(shifts)
    events = ''.join(make_event(s) for s in shifts)
    return (
        "BEGIN:VCALENDAR\n"
        "VERSION:2.0\n"
        "PRODID:-//CostcoSchedule//ES//\n"
        "CALSCALE:GREGORIAN\n"
        "METHOD:PUBLISH\n"
        + events +
        "END:VCALENDAR"
    )

def period_to_filename(period: str) -> str:
    """Convierte '3/02/2026 - 3/08/2026' en 'costco_3-02-26_3-08-26.ics'"""
    clean = period.replace('/', '-').replace(' - ', '_')
    return f"costco_{clean}.ics"

# main

PROMPT_FOR_CLAUDE = """
=========================================================
COPIA Y PEGA ESTO EN CLAUDE.AI junto con la foto:
=========================================================

Analiza esta imagen de un horario de Costco y extrae SOLO los turnos de "Diaz, Juan".
Devuélveme UNICAMENTE un JSON valido con este formato exacto, sin explicacion ni texto extra:

{
  "period": "M/DD/YY - M/DD/YY",
  "shifts": [
    {"date": "YYYY-MM-DD", "start": "H:MMX", "end": "H:MMX", "hours": "N.NN"},
    ...
  ]
}

Donde X es A (AM) o P (PM). El campo "period" es el Time Period que aparece en la parte superior de la imagen (ejemplo: "3/02/26 - 3/08/26").
Incluye TODOS los turnos de la semana para ese empleado.
Si un dia tiene dos bloques de horario (por ejemplo turno + MerchNights), incluyelos como entradas separadas.

=========================================================
"""

def main():
    print("\nCostco Schedule -> Google Calendar (.ics)")
    print("=" * 50)
    print(PROMPT_FOR_CLAUDE)

    print("\nPega el JSON que te dio Claude.ai aqui abajo.")
    print("(Cuando termines, escribe FIN en una linea nueva y presiona Enter)\n")

    lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line.strip().upper() == 'FIN':
            break
        lines.append(line)

    raw = json_extract = "\n".join(lines).strip()
    # Extraer solo el bloque JSON por si hay texto extra antes o despues
    import re
    match = re.search(r"(\{.*\}|\[.*\])", raw, re.DOTALL)
    raw = match.group(0) if match else raw

    if not raw:
        print("\nERROR: No pegaste nada. Copia el JSON de Claude.ai y vuelve a correr el script.")
        sys.exit(1)

    try:
        data = json.loads(raw)
        # Soporta tanto el nuevo formato {period, shifts} como el viejo formato lista directa
        if isinstance(data, list):
            shifts = data
            period = "costco"
        else:
            shifts = data['shifts']
            period = data.get('period', 'costco')
        assert isinstance(shifts, list) and len(shifts) > 0
    except Exception:
        print("\nERROR: El JSON no es valido. Revisa que copiaste todo el bloque correctamente.")
        sys.exit(1)

    ics_content = build_ics(shifts)

    # Nombre del archivo basado en el period
    filename = period_to_filename(period)

    # Guardar en la misma carpeta donde esta el script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, filename)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ics_content)

    print(f"\nArchivo creado: {output_path}")
    print(f"{len(shifts)} turno(s) encontrados.\n")
    print("Abriendo Google Calendar y resaltando el archivo en Finder...")
    webbrowser.open('https://calendar.google.com/calendar/r/settings/export')
    time.sleep(0.5)
    os.system(f'open -R "{output_path}"')
    print("\nEn Google Calendar: Import & Export -> Import -> selecciona el archivo .ics\n")

if __name__ == '__main__':
    main()