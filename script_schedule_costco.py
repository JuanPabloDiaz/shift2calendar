#!/usr/bin/env python3
"""
Costco Schedule -> Google Calendar
==================================
1. Sube tu foto del schedule a Claude.ai y pidele el JSON
2. Pega el JSON cuando el script te lo pida
3. Se genera un archivo .ics en la misma carpeta del script
4. Se abre Google Calendar para importarlo
"""

import json, uuid, webbrowser, re, time, sys, os
from datetime import datetime, date, timedelta
from collections import defaultdict

def parse_time(time_str, ref_date):
    time_str = time_str.strip().upper()
    am_pm = time_str[-1]
    time_part = time_str[:-1]
    hour, minute = (map(int, time_part.split(':'))) if ':' in time_part else (int(time_part), 0)
    if am_pm == 'P' and hour != 12:
        hour += 12
    elif am_pm == 'A' and hour == 12:
        hour = 0
    return datetime(ref_date.year, ref_date.month, ref_date.day, hour, minute)

def to_ics_dt(dt):
    return dt.strftime('%Y%m%dT%H%M%S')

def make_event(shift):
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

def merge_shifts(shifts):
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

def build_ics(shifts):
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

def period_to_filename(period):
    clean = period.strip().replace('/', '-').replace(' - ', '_')
    return f"costco_{clean}.ics"

PROMPT_FOR_CLAUDE = """
=========================================================
COPIA Y PEGA ESTO EN CLAUDE.AI junto con la foto:
=========================================================

Analiza esta imagen de un horario de Costco y extrae SOLO los turnos de "Diaz, Juan".
Devuelveme UNICAMENTE un JSON valido con este formato exacto, sin explicacion ni texto extra:

{
  "period": "M/DD/YY - M/DD/YY",
  "shifts": [
    {"date": "YYYY-MM-DD", "start": "H:MMX", "end": "H:MMX", "hours": "N.NN"}
  ]
}

Donde X es A o P. El campo "period" es el Time Period de la parte superior (ej: "3/02/26 - 3/08/26").
Si un dia tiene dos bloques de horario incluyelos como entradas separadas en shifts.

=========================================================
"""

def main():
    print("\nCostco Schedule -> Google Calendar (.ics)")
    print("=" * 50)
    print(PROMPT_FOR_CLAUDE)
    print("Pega el JSON aqui abajo y escribe FIN (o fin) cuando termines:\n")

    lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line.strip().lower() == 'fin':
            break
        lines.append(line)

    raw = "\n".join(lines).strip()

    if not raw:
        print("\nERROR: No pegaste nada.")
        sys.exit(1)

    # Extraer bloque JSON aunque haya texto extra alrededor
    match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', raw)
    if match:
        raw = match.group(0)

    # Intentar parsear
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"\nERROR parseando JSON: {e}")
        print("Asegurate de copiar el bloque completo desde { hasta }")
        sys.exit(1)

    # Extraer shifts y period
    if isinstance(data, list):
        shifts = data
        period = "costco"
    elif isinstance(data, dict):
        shifts = data.get('shifts', [])
        period = data.get('period', 'costco')
    else:
        print("\nERROR: Formato inesperado.")
        sys.exit(1)

    if not shifts:
        print("\nERROR: No se encontraron turnos en el JSON.")
        sys.exit(1)

    ics_content = build_ics(shifts)
    filename = period_to_filename(period)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, filename)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ics_content)

    print(f"\nArchivo creado: {output_path}")
    print(f"{len(shifts)} turno(s) procesados -> {len(merge_shifts(shifts))} dia(s) en el calendario\n")
    print("Abriendo Google Calendar y resaltando el archivo en Finder...")
    webbrowser.open('https://calendar.google.com/calendar/r/settings/export')
    time.sleep(0.5)
    os.system(f'open -R "{output_path}"')
    print("\nEn Google Calendar: Import & Export -> Import -> selecciona el archivo .ics\n")

if __name__ == '__main__':
    main()