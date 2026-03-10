// ── CONFIG ────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  "19286324149-5oje1gclta6vpgs88rogvcp33h1pno0r.apps.googleusercontent.com";
const SHEET_ID = "1nozoAVbXK3qoahczhQnOonOE4EQj3OA5vjmUf-5itKY";
const SCOPES =
  "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/spreadsheets";
const OWNER_NAME = "Diaz, Juan";
const OWNER_ALLOWED_EMAILS = ["juan.diaz.rodriguez93@gmail.com"];
const REMINDER_FIXED = 30; // always-on reminder in minutes
const LUNCH_THRESHOLD_HOURS = 5; // only generate lunch reminder above this
const LUNCH_NOTICE_BEFORE_MINUTES = 30; // warn this many minutes before hour 5
const LUNCH_EVENT_DURATION_MINUTES = 5;
const PAID_BREAK_DEDUCTION_HOURS = 0.5; // allow paid-hours inputs (meal deducted)
const PAID_BREAK_MIN_SHIFT_HOURS = 5.5; // minimum shift length where deduction can apply

// ── PAY RATES (update here if your wage changes) ──────────────────────
const HOURLY_RATE = 20; // regular hourly rate (USD)
const SUNDAY_RATE = HOURLY_RATE * 1.5; // time and a half
const PAY_PERIOD_ANCHOR_START = "2026-02-16"; // paystub period start
const PAY_PERIOD_LENGTH_DAYS = 14; // biweekly

// ── TRANSLATIONS ──────────────────────────────────────────────────────
const T = {
  es: {
    subtitle: "Convierte tu horario en eventos de calendario",
    step1Title: "Tipo de imagen",
    step1Desc: "¿Qué tipo de imagen vas a usar?",
    imgModePrinted: "Horario impreso",
    imgModeKronos: "App Kronos",
    step2Title: "Tu nombre en el horario",
    step2Desc: "Escribe tu nombre exactamente como aparece en la imagen",
    nameLabel: "Nombre (Apellido, Nombre)",
    step3Title: "Copia el prompt",
    step3Desc: "Ábrelo en ChatGPT o Claude y adjunta la foto del horario",
    copyBtn: "Copiar prompt",
    copiedBtn: "¡Copiado!",
    step4Title: "Pega el JSON aquí",
    step4Desc: "Copia la respuesta de AI y pégala abajo",
    fixJsonBtn: "Corregir errores",
    jsonWarnTitle: "Revisión de JSON",
    jsonErrPrefix: "Corrige esto antes de continuar:",
    jsonErrBadDate: "Turno en {date}: formato de fecha inválido.",
    jsonErrBadTime: "Turno en {date}: hora inválida.",
    jsonErrEndBeforeStart:
      "Turno en {date}: la hora de fin es antes del inicio.",
    jsonErrNegativeHours: "Turno en {date}: horas negativas.",
    jsonErrMismatchHours:
      "Turno en {date}: horas no coinciden (JSON {jsonHours} vs calculado {calcHours}).",
    jsonErrOverlap:
      "Turno en {date}: se sobrepone con otro turno del mismo día.",
    jsonFixNoInput: "Pega JSON primero.",
    jsonFixInvalid: "No se pudo corregir: JSON inválido.",
    jsonFixDone: "JSON corregido. Cambios:",
    jsonFixNoChanges: "No encontré correcciones automáticas.",
    step5Title: "Personaliza los eventos",
    step5Desc: "Información adicional para cada evento",
    optLocationLabel: "Ubicación",
    optReminder1Label: "Recordatorio fijo",
    optReminder2Label: "Recordatorio adicional",
    optReminderNone: "Sin recordatorio",
    optWeeklyLabel: "Total de horas en descripción",
    optLunchLabel: "Recordatorio de lunch",

    generateBtn: "Generar y descargar .ics",
    previewTitle: "Turnos detectados:",
    weeklyLabel: "Total semana:",
    errEmpty: "Pega el JSON de AI primero.",
    errJson: "JSON inválido: ",
    errJsonHint: ". Asegúrate de copiar el bloque completo.",
    errNoShifts: "No se encontraron turnos en el JSON.",
    successMsg: "Descargado: ",
    clearBtn: "Limpiar turnos",
    descShift: "Turno Costco",
    descHours: "Horas hoy",
    descWeekTotal: "Total semana",
    descWeekDays: "días esta semana",
    descLunchTitle: "Recordatorio de lunch",
    descLunchNote: "Toma el lunch antes de cumplir 5 horas",
    juanDivider: "Solo para Juan Diaz",
    openSheet: "Abrir Sheet",
    googleSignin: "Conectar Google",
    signout: "Cerrar sesión",
    sendCalendar: "Calendar",
    sendSheets: "Sheets",
    sendBoth: "Ambos",
    googleLoading: "Procesando...",
    googleCalOk: "Eventos creados en Google Calendar",
    googleSheetsOk: "Datos guardados en Google Sheets",
    googleBothOk: "Calendar y Sheets actualizados",
    googleErr: "Error: ",
    sheetsDupTitle: "Semana existente",
    sheetsDupMsg: "Esta semana ya existe en el Sheet. ¿Sobreescribir?",
    sheetsDupYes: "Sobreescribir",
    sheetsDupNo: "Cancelar",
    calSkipped: " — duplicados omitidos.",
    cancelled: "Cancelado.",
    autoConnecting: "Conectando...",
  },
  en: {
    subtitle: "Convert your schedule into calendar events",
    step1Title: "Image type",
    step1Desc: "What type of image are you using?",
    imgModePrinted: "Printed schedule",
    imgModeKronos: "Kronos app",
    step2Title: "Your name on the schedule",
    step2Desc: "Type your name exactly as it appears in the image",
    nameLabel: "Name (Last, First)",
    step3Title: "Copy the prompt",
    step3Desc: "Open ChatGPT or Claude, paste this prompt and attach the photo",
    copyBtn: "Copy prompt",
    copiedBtn: "Copied!",
    step4Title: "Paste the JSON here",
    step4Desc: "Copy AI's response and paste it below",
    fixJsonBtn: "Fix Errors",
    jsonWarnTitle: "JSON checks",
    jsonErrPrefix: "Fix this before continuing:",
    jsonErrBadDate: "Shift on {date}: wrong date format.",
    jsonErrBadTime: "Shift on {date}: invalid time format.",
    jsonErrEndBeforeStart: "Shift on {date}: end is before start.",
    jsonErrNegativeHours: "Shift on {date}: negative hours.",
    jsonErrMismatchHours:
      "Shift on {date}: hours mismatch (JSON {jsonHours} vs calculated {calcHours}).",
    jsonErrOverlap:
      "Shift on {date}: overlaps with another shift on the same day.",
    jsonFixNoInput: "Paste JSON first.",
    jsonFixInvalid: "Could not fix: invalid JSON.",
    jsonFixDone: "JSON fixed. Changes:",
    jsonFixNoChanges: "No automatic fixes were needed.",
    step5Title: "Customize events",
    step5Desc: "Additional info for each calendar event",
    optLocationLabel: "Location",
    optReminder1Label: "Fixed reminder",
    optReminder2Label: "Additional reminder",
    optReminderNone: "No reminder",
    optWeeklyLabel: "Weekly hours total in description",
    optLunchLabel: "Lunch reminder",

    generateBtn: "Generate & download .ics",
    previewTitle: "Detected shifts:",
    weeklyLabel: "Week total:",
    errEmpty: "Paste AI's JSON first.",
    errJson: "Invalid JSON: ",
    errJsonHint: ". Make sure you copied the full block.",
    errNoShifts: "No shifts found in the JSON.",
    successMsg: "Downloaded: ",
    clearBtn: "Clear shifts",
    descShift: "Costco Shift",
    descHours: "Hours today",
    descWeekTotal: "Week total",
    descWeekDays: "days this week",
    descLunchTitle: "Lunch",
    descLunchNote: "Take lunch before reaching 5 hours",
    juanDivider: "Juan Diaz only",
    openSheet: "Open Sheet",
    googleSignin: "Connect Google",
    signout: "Sign out",
    sendCalendar: "Calendar",
    sendSheets: "Sheets",
    sendBoth: "Both",
    googleLoading: "Processing...",
    googleCalOk: "Events created in Google Calendar",
    googleSheetsOk: "Data saved to Google Sheets",
    googleBothOk: "Calendar and Sheets updated",
    googleErr: "Error: ",
    sheetsDupTitle: "Week already exists",
    sheetsDupMsg: "This week already exists in the Sheet. Overwrite?",
    sheetsDupYes: "Overwrite",
    sheetsDupNo: "Cancel",
    calSkipped: " — duplicates skipped.",
    cancelled: "Cancelled.",
    autoConnecting: "Connecting...",
  },
};

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let lang = "en";
let theme = localStorage.getItem("theme") || "light";
let inputMode = "json";
let imageMode = "printed";
let manualShifts = [];
let accessToken = null;
let tokenClient = null;
let signedInUserEmail = "";

// ── SILENT SIGN-IN / AUTO RECONNECT ──────────────────────────────────
// We wait for the GSI library to load, then attempt silent sign-in
// if the user has previously authorized.
window.addEventListener("load", () => {
  // Give GSI library time to initialize
  const tryAutoConnect = () => {
    if (typeof google === "undefined" || !google.accounts) {
      setTimeout(tryAutoConnect, 300);
      return;
    }
    initTokenClient();
    // If previously connected, attempt silent token refresh
    if (localStorage.getItem("gsi_connected") === "1" && isJuan()) {
      showGoogleStatus("loading", T[lang].autoConnecting);
      tokenClient.requestAccessToken({ prompt: "" }); // empty prompt = silent
    }
  };
  tryAutoConnect();
});

function initTokenClient() {
  if (tokenClient) return;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: async (response) => {
      if (response.error) {
        // Silent auth failed — clear stored state and show sign-in button
        localStorage.removeItem("gsi_connected");
        signedInUserEmail = "";
        updateOwnerSheetButton();
        document.getElementById("googleStatus").style.display = "none";
        return;
      }
      accessToken = response.access_token;
      localStorage.setItem("gsi_connected", "1");
      const info = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: "Bearer " + accessToken },
        },
      )
        .then((r) => r.json())
        .catch(() => ({}));
      signedInUserEmail = (info.email || "").toLowerCase();
      document.getElementById("signedInEmail").textContent =
        info.email || "Connected";
      document.getElementById("googleSignedOut").style.display = "none";
      document.getElementById("googleSignedIn").style.display = "block";
      updateOwnerSheetButton();
      document.getElementById("googleStatus").style.display = "none";
    },
  });
}

function signInWithGoogle() {
  initTokenClient();
  tokenClient.requestAccessToken({ prompt: "consent" });
}

function signOut() {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken, () => {});
    accessToken = null;
  }
  signedInUserEmail = "";
  localStorage.removeItem("gsi_connected");
  document.getElementById("googleSignedOut").style.display = "block";
  document.getElementById("googleSignedIn").style.display = "none";
  updateOwnerSheetButton();
  document.getElementById("googleStatus").style.display = "none";
}

function isJuan() {
  return document.getElementById("employeeName").value.trim() === OWNER_NAME;
}
function onNameInput() {
  updatePrompt();
  checkJuanSection();
}
function checkJuanSection() {
  document.getElementById("juanSection").style.display = isJuan()
    ? "block"
    : "none";
  updateOwnerSheetButton();
}
function canOpenOwnerSheet() {
  return (
    isJuan() &&
    !!signedInUserEmail &&
    OWNER_ALLOWED_EMAILS.map((e) => e.toLowerCase().trim()).includes(
      signedInUserEmail,
    )
  );
}
function updateOwnerSheetButton() {
  const btn = document.getElementById("txt-open-sheet");
  if (!btn) return;
  btn.style.display = canOpenOwnerSheet() ? "inline-flex" : "none";
}
function openOwnerSheet() {
  if (!canOpenOwnerSheet()) return;
  window.open(
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}`,
    "_blank",
    "noopener,noreferrer",
  );
}

// ── RESET / CLEAR ─────────────────────────────────────────────────────
function resetAfterAction() {
  document.getElementById("jsonInput").value = "";
  renderJsonValidation([]);
  manualShifts = [];
  renderManualShifts();
}

// ── PARSE SHIFTS ──────────────────────────────────────────────────────
function parseAndValidate() {
  const t = T[lang];
  let shifts, period;
  if (inputMode === "manual") {
    if (!manualShifts.length) {
      showError(t.errNoShifts);
      return null;
    }
    shifts = normalizeAndDedupeShifts(manualShifts);
    period = "costco";
  } else {
    const parsedJson = parseJsonInput();
    if (!parsedJson) {
      showError(t.errEmpty);
      return null;
    }
    const { data, error } = parsedJson;
    if (error) {
      showError(t.errJson + error + t.errJsonHint);
      return null;
    }
    if (Array.isArray(data)) {
      shifts = data;
      period = "costco";
    } else {
      shifts = data.shifts || [];
      period = data.period || "costco";
    }
    if (!shifts.length) {
      showError(t.errNoShifts);
      return null;
    }
    shifts = normalizeAndDedupeShifts(shifts);
    const issues = validateShiftData(shifts);
    renderJsonValidation(issues);
    if (issues.length) {
      showError(`${t.jsonErrPrefix} ${issues[0]}`);
      return null;
    }
  }
  return { shifts, period };
}

// ── REMINDER HELPERS ──────────────────────────────────────────────────
function getReminderOverrides() {
  const overrides = [
    { method: "popup", minutes: REMINDER_FIXED },
    { method: "email", minutes: REMINDER_FIXED },
  ];
  const extra = parseInt(document.getElementById("reminderSelect").value);
  if (extra > 0) {
    overrides.push({ method: "popup", minutes: extra });
    overrides.push({ method: "email", minutes: extra });
  }
  return overrides;
}

// ── GOOGLE CALENDAR ───────────────────────────────────────────────────
async function sendToGoogleCalendar() {
  const parsed = parseAndValidate();
  if (!parsed) return;
  const ok = await _doCalendar(parsed.shifts, parsed.period);
  if (ok !== false) {
    renderPreview(parsed.shifts);
    resetAfterAction();
  }
}

async function _doCalendar(shifts, period) {
  const t = T[lang];
  showGoogleStatus("loading", t.googleLoading);
  const merged = mergeShifts(shifts);
  const totalWeekHours = merged.reduce((a, s) => a + parseFloat(s.hours), 0);
  const totalWeekDays = merged.length;
  const location = document.getElementById("locationSelect").value;
  const includeWeekly = document.getElementById("weeklyToggle").checked;
  const includeLunch = document.getElementById("lunchToggle").checked;
  const locEl = document.getElementById("locationSelect");
  const locLabel = locEl.options[locEl.selectedIndex].text;
  const reminderOverrides = getReminderOverrides();

  let skipped = 0;
  for (const s of merged) {
    const dayStart = s.date + "T00:00:00-05:00";
    const dayEnd = s.date + "T23:59:59-05:00";
    const chk = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(dayStart)}&timeMax=${encodeURIComponent(dayEnd)}&q=Costco`,
      { headers: { Authorization: "Bearer " + accessToken } },
    ).then((r) => r.json());
    if (chk.items && chk.items.some((e) => e.summary === "Costco")) {
      skipped++;
      continue;
    }

    let description = `${t.descShift}\n⏱ ${t.descHours}: ${s.hours} hrs`;
    if (includeWeekly)
      description += `\n📅 ${t.descWeekTotal}: ${totalWeekHours.toFixed(2)} hrs (${totalWeekDays} ${t.descWeekDays})`;
    description += `\n📍 ${locLabel}\n📆 ${period}`;

    const event = {
      summary: "Costco",
      location,
      description,
      start: {
        dateTime: s.startDt.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: s.endDt.toISOString(),
        timeZone: "America/New_York",
      },
      colorId: "3",
      reminders: { useDefault: false, overrides: reminderOverrides },
    };

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );
    if (!res.ok) {
      const err = await res.json();
      showGoogleStatus(
        "error",
        t.googleErr + (err.error?.message || res.status),
      );
      return false;
    }

    const lunchReminderAt = includeLunch
      ? getLunchReminderDate(s.startDt, s.hours)
      : null;
    if (lunchReminderAt) {
      const lunchEnd = new Date(
        lunchReminderAt.getTime() + LUNCH_EVENT_DURATION_MINUTES * 60000,
      );
      const lunchEvent = {
        summary: t.descLunchTitle,
        location,
        description: `${t.descLunchNote}\n📆 ${period}`,
        start: {
          dateTime: lunchReminderAt.toISOString(),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: lunchEnd.toISOString(),
          timeZone: "America/New_York",
        },
        colorId: "11",
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 0 }],
        },
      };

      const lunchRes = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lunchEvent),
        },
      );
      if (!lunchRes.ok) {
        const err = await lunchRes.json();
        showGoogleStatus(
          "error",
          t.googleErr + (err.error?.message || lunchRes.status),
        );
        return false;
      }
    }
  }
  showGoogleStatus(
    "success",
    t.googleCalOk + (skipped > 0 ? t.calSkipped : ""),
  );
  return true;
}

// ── GOOGLE SHEETS ─────────────────────────────────────────────────────
async function sendToSheets() {
  const t = T[lang];

  // Check if input has multiple periods
  if (inputMode === "json") {
    const parsedJson = parseJsonInput();
    if (parsedJson && !parsedJson.error) {
      const data = parsedJson.data;
      // Multiple periods - process each separately
      if (Array.isArray(data) && data.length > 0 && data[0].period && data[0].shifts) {
        showGoogleStatus("loading", t.googleLoading);
        let successCount = 0;
        for (const periodData of data) {
          const ok = await _doSheets(periodData.shifts, periodData.period);
          if (ok !== false) successCount++;
        }
        if (successCount > 0) {
          showGoogleStatus("success", `${t.googleSheetsOk} (${successCount} period${successCount > 1 ? 's' : ''} added)`);
          renderPreview(data.flatMap(p => p.shifts));
          resetAfterAction();
        }
        return;
      }
    }
  }

  // Single period - original logic
  const parsed = parseAndValidate();
  if (!parsed) return;
  const ok = await _doSheets(parsed.shifts, parsed.period);
  if (ok !== false) {
    renderPreview(parsed.shifts);
    resetAfterAction();
  }
}

// ── PAY CALCULATOR ────────────────────────────────────────────────────
function calcPay(merged) {
  let regHrs = 0,
    sunHrs = 0;
  merged.forEach((s) => {
    const h = parseFloat(s.hours);
    if (new Date(s.date + "T00:00:00").getDay() === 0) sunHrs += h;
    else regHrs += h;
  });
  return {
    rate: HOURLY_RATE,
    sunRate: SUNDAY_RATE,
    regHrs,
    sunHrs,
    totalHrs: regHrs + sunHrs,
    regPay: regHrs * HOURLY_RATE,
    sunPay: sunHrs * SUNDAY_RATE,
    totalPay: regHrs * HOURLY_RATE + sunHrs * SUNDAY_RATE,
  };
}

// ── SHEETS: create/find tab ────────────────────────────────────────────
const SHEET_TAB_TITLE = "Schedule";
const SUMMARY_TAB_TITLE = "Summary";

async function getOrCreateTab(title) {
  const meta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`,
    { headers: { Authorization: "Bearer " + accessToken } },
  ).then((r) => r.json());
  const existing = meta.sheets.find((s) => s.properties.title === title);
  if (existing) return existing.properties.sheetId;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title } } }],
      }),
    },
  ).then((r) => r.json());
  return res.replies?.[0]?.addSheet?.properties?.sheetId ?? null;
}

async function getUsedRowCount(sheetName) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}!A1:H`,
    { headers: { Authorization: "Bearer " + accessToken } },
  ).then((r) => r.json());
  return res.values ? res.values.length : 0;
}

async function getSheetValues(sheetName) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}!A1:H`,
    { headers: { Authorization: "Bearer " + accessToken } },
  ).then((r) => r.json());
  return res.values || [];
}

async function clearTab(sheetName) {
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}!A1:Z200:clear`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    },
  );
}

async function checkTabHasData(sheetName) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}!A2`,
    { headers: { Authorization: "Bearer " + accessToken } },
  ).then((r) => r.json());
  return !!(res.values && res.values.length);
}

async function ensureSummaryCharts(summaryTabId) {
  const meta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`,
    { headers: { Authorization: "Bearer " + accessToken } },
  ).then((r) => r.json());
  const summarySheet = (meta.sheets || []).find(
    (s) => s.properties?.sheetId === summaryTabId,
  );
  const existingCharts = summarySheet?.charts || [];
  if (existingCharts.length >= 3) return true;

  const chartRange = (colStart, colEnd) => ({
    sourceRange: {
      sources: [
        {
          sheetId: summaryTabId,
          startRowIndex: 10,
          endRowIndex: 220,
          startColumnIndex: colStart,
          endColumnIndex: colEnd,
        },
      ],
    },
  });

  const requests = [
    {
      addChart: {
        chart: {
          spec: {
            title: "Hours by Month",
            basicChart: {
              chartType: "COLUMN",
              legendPosition: "NO_LEGEND",
              axis: [
                { position: "BOTTOM_AXIS", title: "Month" },
                { position: "LEFT_AXIS", title: "Hours" },
              ],
              domains: [{ domain: chartRange(0, 1) }],
              series: [{ series: chartRange(1, 2), targetAxis: "LEFT_AXIS" }],
              headerCount: 1,
            },
          },
          position: {
            overlayPosition: {
              anchorCell: {
                sheetId: summaryTabId,
                rowIndex: 1,
                columnIndex: 3,
              },
              offsetXPixels: 0,
              offsetYPixels: 0,
              widthPixels: 520,
              heightPixels: 260,
            },
          },
        },
      },
    },
    {
      addChart: {
        chart: {
          spec: {
            title: "Pay by Month",
            basicChart: {
              chartType: "LINE",
              legendPosition: "NO_LEGEND",
              axis: [
                { position: "BOTTOM_AXIS", title: "Month" },
                { position: "LEFT_AXIS", title: "Pay" },
              ],
              domains: [{ domain: chartRange(0, 1) }],
              series: [{ series: chartRange(2, 3), targetAxis: "LEFT_AXIS" }],
              headerCount: 1,
            },
          },
          position: {
            overlayPosition: {
              anchorCell: {
                sheetId: summaryTabId,
                rowIndex: 15,
                columnIndex: 3,
              },
              offsetXPixels: 0,
              offsetYPixels: 0,
              widthPixels: 520,
              heightPixels: 260,
            },
          },
        },
      },
    },
    {
      addChart: {
        chart: {
          spec: {
            title: "Sundays by Month",
            basicChart: {
              chartType: "COLUMN",
              legendPosition: "NO_LEGEND",
              axis: [
                { position: "BOTTOM_AXIS", title: "Month" },
                { position: "LEFT_AXIS", title: "Sundays" },
              ],
              domains: [{ domain: chartRange(4, 5) }],
              series: [{ series: chartRange(5, 6), targetAxis: "LEFT_AXIS" }],
              headerCount: 1,
            },
          },
          position: {
            overlayPosition: {
              anchorCell: {
                sheetId: summaryTabId,
                rowIndex: 29,
                columnIndex: 3,
              },
              offsetXPixels: 0,
              offsetYPixels: 0,
              widthPixels: 520,
              heightPixels: 260,
            },
          },
        },
      },
    },
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    },
  );
  return true;
}

async function updateSummaryTab() {
  const summaryTabId = await getOrCreateTab(SUMMARY_TAB_TITLE);
  if (summaryTabId === null) return false;

  const values = [
    ["Schedule Summary"],
    [""],
    [
      "This week hours",
      '=SUMPRODUCT((IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)>=TODAY()-WEEKDAY(TODAY(),2)+1)*(IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)<=TODAY()-WEEKDAY(TODAY(),2)+7)*N(Schedule!E2:E))',
    ],
    [
      "Last week hours",
      '=SUMPRODUCT((IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)>=TODAY()-WEEKDAY(TODAY(),2)-6)*(IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)<=TODAY()-WEEKDAY(TODAY(),2))*N(Schedule!E2:E))',
    ],
    ["Week-over-week delta", "=B3-B4"],
    [
      "Year to date hours",
      '=SUMPRODUCT((IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)>=DATE(YEAR(TODAY()),1,1))*(IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)<=TODAY())*N(Schedule!E2:E))',
    ],
    [
      "Avg weekly hours (last 4 weeks)",
      '=SUMPRODUCT((IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)>=TODAY()-28)*(IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)<=TODAY())*N(Schedule!E2:E))/4',
    ],
    [
      "Projected monthly pay",
      '=SUMPRODUCT((IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)>=TODAY()-28)*(IFERROR(IF(ISNUMBER(Schedule!A2:A),Schedule!A2:A,DATE(VALUE(LEFT(Schedule!A2:A&"",4)),VALUE(MID(Schedule!A2:A&"",6,2)),VALUE(MID(Schedule!A2:A&"",9,2)))),0)<=TODAY())*N(Schedule!F2:F))/4*4.345',
    ],
    ["Avg Sundays per month", '=IFERROR(AVERAGE(FILTER(F12:F,F12:F<>"")),0)'],
    [""],
    [
      '=ARRAYFORMULA(QUERY({TEXT(Schedule!A2:A,"yyyy-mm"),Schedule!E2:E,Schedule!F2:F},"select Col1,sum(Col2),sum(Col3) where Col1<>\'\' and Col2 is not null group by Col1 order by Col1 label Col1 \'Month\', sum(Col2) \'Hours\', sum(Col3) \'Pay\'",0))',
      "",
      "",
      "",
      '=ARRAYFORMULA(QUERY({TEXT(Schedule!A2:A,"yyyy-mm"),WEEKDAY(Schedule!A2:A)},"select Col1,count(Col2) where Col1<>\'\' and Col2=1 group by Col1 order by Col1 label Col1 \'Month\', count(Col2) \'Sundays\'",0))',
    ],
  ];

  const enc = encodeURIComponent(SUMMARY_TAB_TITLE);
  const write = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${enc}!A1:F40?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    },
  );
  if (!write.ok) return false;

  const requests = [
    {
      repeatCell: {
        range: {
          sheetId: summaryTabId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: 2,
        },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true, fontSize: 16 },
            horizontalAlignment: "LEFT",
          },
        },
        fields: "userEnteredFormat",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId: summaryTabId,
          startRowIndex: 2,
          endRowIndex: 9,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: { type: "NUMBER", pattern: "0.00" },
            horizontalAlignment: "RIGHT",
          },
        },
        fields: "userEnteredFormat",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId: summaryTabId,
          startRowIndex: 7,
          endRowIndex: 8,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: { type: "CURRENCY", pattern: "$#,##0.00" },
          },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: summaryTabId,
          dimension: "COLUMNS",
          startIndex: 0,
          endIndex: 1,
        },
        properties: { pixelSize: 260 },
        fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: summaryTabId,
          dimension: "COLUMNS",
          startIndex: 1,
          endIndex: 2,
        },
        properties: { pixelSize: 170 },
        fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: summaryTabId,
          dimension: "COLUMNS",
          startIndex: 4,
          endIndex: 6,
        },
        properties: { pixelSize: 150 },
        fields: "pixelSize",
      },
    },
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    },
  );
  await ensureSummaryCharts(summaryTabId);
  return true;
}

// ── SHEETS: write data + formatting ───────────────────────────────────
async function _doSheets(shifts, period) {
  const t = T[lang];
  const DAYS = lang === "es" ? DAYS_ES : DAYS_EN;
  const MONTHS = lang === "es" ? MONTHS_ES : MONTHS_EN;
  const fmtT = (dt) => {
    let h = dt.getHours(),
      m = dt.getMinutes(),
      ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ap}`;
  };

  showGoogleStatus("loading", t.googleLoading);

  // Merge shifts by day (consolidate multiple shifts on same day)
  const merged = mergeShifts(shifts);
  const pay = calcPay(merged);
  const weekStart = merged[0]?.date;
  const weekEnd = merged[merged.length - 1]?.date;
  const biweekly = getBiweeklyWindow(weekStart);
  const closesPayPeriod = weekEnd === biweekly.end;

  // Get/create single tab
  const tabId = await getOrCreateTab(SHEET_TAB_TITLE);
  if (tabId === null) {
    showGoogleStatus("error", t.googleErr + "Tab error");
    return false;
  }

  const usedRows = await getUsedRowCount(SHEET_TAB_TITLE);
  const existingValues = await getSheetValues(SHEET_TAB_TITLE);
  const isFirstBlock = usedRows === 0;

  // Check for duplicates by date and total hours
  const existingDays = existingValues
    .slice(1) // Skip header
    .filter((row) => row[0] && row[4]) // Must have date and hours
    .map((row) => ({
      date: row[0],
      hours: parseFloat(row[4]) || 0,
    }));

  const isDuplicate = (shift) => {
    return existingDays.some(
      (existing) =>
        existing.date === shift.date &&
        Math.abs(existing.hours - parseFloat(shift.hours)) < 0.01, // Allow small rounding differences
    );
  };

  const newShifts = merged.filter((s) => !isDuplicate(s));
  const duplicateCount = merged.length - newShifts.length;

  if (newShifts.length === 0) {
    showGoogleStatus(
      "error",
      duplicateCount > 0
        ? `All ${duplicateCount} day${duplicateCount > 1 ? "s" : ""} already exist in the sheet.`
        : "No shifts to add.",
    );
    return false;
  }

  // Use only new shifts for the rest of the process
  const filteredShifts = newShifts;
  const filteredPay = calcPay(filteredShifts);

  // Build values: optional header + shift rows + summary row
  const header = [["Date", "Day", "Start", "End", "Hours", "Pay", "", ""]];

  const shiftRows = filteredShifts.map((s) => {
    const d = new Date(s.date + "T00:00:00");
    const isSun = d.getDay() === 0;
    const hrs = s.hours;
    const dayRate = isSun ? filteredPay.sunRate : filteredPay.rate;
    const dayPay = hrs * dayRate;
    const dayLabel = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    // Format hours: show as integer if whole number, otherwise 1 decimal
    const hrsFormatted = hrs % 1 === 0 ? hrs : parseFloat(hrs.toFixed(1));
    return [
      s.date,
      dayLabel,
      fmtT(s.startDt),
      fmtT(s.endDt),
      hrsFormatted,
      dayPay,
      isSun ? "Sunday hrs ★" : "",
      isSun ? `$${filteredPay.sunRate.toFixed(2)}/hr` : "",
    ];
  });

  const summaryRows = [
    [
      `WEEK SUMMARY ${period}`,
      "",
      "",
      "Total hours",
      filteredPay.totalHrs,
      filteredPay.totalPay,
      "Pay period",
      `${biweekly.start} - ${biweekly.end}`,
    ],
  ];

  let biweeklyRows = [];
  if (closesPayPeriod) {
    const existingBiweekly = sumExistingBiweekly(existingValues, biweekly);
    const currentBiweeklyHrs = filteredShifts
      .filter((s) => s.date >= biweekly.start && s.date <= biweekly.end)
      .reduce((a, s) => a + s.hours, 0);
    const currentBiweeklyPay = filteredShifts
      .filter((s) => s.date >= biweekly.start && s.date <= biweekly.end)
      .reduce((a, s) => {
        const d = new Date(s.date + "T00:00:00");
        const isSun = d.getDay() === 0;
        return a + s.hours * (isSun ? filteredPay.sunRate : filteredPay.rate);
      }, 0);

    biweeklyRows = [
      [
        `BIWEEKLY TOTAL ${biweekly.start} - ${biweekly.end}`,
        "",
        "",
        "Total hours",
        existingBiweekly.hours + currentBiweeklyHrs,
        existingBiweekly.pay + currentBiweeklyPay,
        "Pay date",
        biweekly.payDate,
      ],
    ];
  }

  const spacerRows = [["", "", "", "", "", "", "", ""]];

  const allValues = [
    ...(isFirstBlock ? header : []),
    ...shiftRows,
    ...summaryRows,
    ...biweeklyRows,
    ...spacerRows,
  ];

  // Write values
  const startRow = usedRows + 1;
  const endRow = usedRows + allValues.length;
  const enc = encodeURIComponent(SHEET_TAB_TITLE);
  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${enc}!A${startRow}:H${endRow}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: allValues }),
    },
  );
  if (!writeRes.ok) {
    const err = await writeRes.json();
    showGoogleStatus(
      "error",
      t.googleErr + (err.error?.message || writeRes.status),
    );
    return false;
  }

  // ── FORMATTING via batchUpdate ─────────────────────────────────────
  const nShifts = shiftRows.length;
  const base = usedRows; // row index 0-based
  const headerRow = base;
  const firstShift = base + (isFirstBlock ? 1 : 0);
  const lastShift = firstShift + nShifts - 1; // inclusive index
  const summaryRow = lastShift + 1;
  const biweeklyRow = closesPayPeriod ? summaryRow + 1 : null;
  const spacerRow = (biweeklyRow ?? summaryRow) + 1;

  // Modern color palette
  const BASE_BG = { red: 1.0, green: 1.0, blue: 1.0 }; // white
  const ALT_BG = { red: 0.98, green: 0.98, blue: 0.99 }; // very light blue
  const HOURS_BG = { red: 0.93, green: 0.95, blue: 0.98 }; // light blue
  const HEADER_BG = { red: 0.26, green: 0.47, blue: 0.8 }; // modern blue
  const HEADER_FG = { red: 1.0, green: 1.0, blue: 1.0 };
  const SUN_BG = { red: 1.0, green: 0.95, blue: 0.8 }; // warm yellow
  const SUMM_BG = { red: 0.95, green: 0.95, blue: 0.97 }; // light gray
  const GREEN = { red: 0.13, green: 0.55, blue: 0.13 };
  const BLUE_GRID = { red: 0.26, green: 0.47, blue: 0.8 };
  const GRID = { red: 0.85, green: 0.85, blue: 0.88 };

  const cell = (r, c) => ({
    sheetId: tabId,
    startRowIndex: r,
    endRowIndex: r + 1,
    startColumnIndex: c,
    endColumnIndex: c + 1,
  });
  const row = (r, c1 = 0, c2 = 8) => ({
    sheetId: tabId,
    startRowIndex: r,
    endRowIndex: r + 1,
    startColumnIndex: c1,
    endColumnIndex: c2,
  });

  const requests = [];

  // Header row style
  if (isFirstBlock) {
    requests.push({
      repeatCell: {
        range: row(headerRow, 0, 6),
        cell: {
          userEnteredFormat: {
            backgroundColor: HEADER_BG,
            textFormat: {
              foregroundColor: HEADER_FG,
              bold: true,
              fontSize: 12,
              fontFamily: "Arial",
            },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            borders: {
              top: { style: "SOLID_MEDIUM", color: BLUE_GRID },
              bottom: { style: "SOLID_MEDIUM", color: BLUE_GRID },
              left: { style: "SOLID", color: BLUE_GRID },
              right: { style: "SOLID", color: BLUE_GRID },
            },
          },
        },
        fields: "userEnteredFormat",
      },
    });
  }

  // Shift rows
  filteredShifts.forEach((s, i) => {
    const r = firstShift + i;
    const isSun = new Date(s.date + "T00:00:00").getDay() === 0;
    const bg = isSun ? SUN_BG : i % 2 === 0 ? BASE_BG : ALT_BG;

    requests.push({
      repeatCell: {
        range: row(r, 0, 6),
        cell: {
          userEnteredFormat: {
            backgroundColor: bg,
            textFormat: { fontSize: 11, fontFamily: "Arial" },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "CLIP",
            borders: {
              bottom: { style: "SOLID", color: GRID },
              left: { style: "SOLID", color: GRID },
              right: { style: "SOLID", color: GRID },
            },
          },
        },
        fields: "userEnteredFormat",
      },
    });

    // Hours column has dedicated blue tint
    requests.push({
      repeatCell: {
        range: cell(r, 4),
        cell: {
          userEnteredFormat: { backgroundColor: HOURS_BG },
        },
        fields: "userEnteredFormat.backgroundColor",
      },
    });

    // Date + Day
    requests.push({
      repeatCell: {
        range: cell(r, 0),
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER",
            textFormat: { fontSize: 12 },
            numberFormat: { type: "DATE", pattern: "yyyy-mm-dd" },
          },
        },
        fields: "userEnteredFormat",
      },
    });
    requests.push({
      repeatCell: {
        range: cell(r, 1),
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER",
            textFormat: { fontSize: 12 },
            numberFormat: { type: "TEXT", pattern: "@" },
          },
        },
        fields: "userEnteredFormat",
      },
    });

    // Time columns centered
    [2, 3].forEach((c) => {
      requests.push({
        repeatCell: {
          range: cell(r, c),
          cell: {
            userEnteredFormat: {
              horizontalAlignment: "CENTER",
              numberFormat: { type: "TIME", pattern: "h:mm AM/PM" },
            },
          },
          fields: "userEnteredFormat",
        },
      });
    });

    requests.push({
      repeatCell: {
        range: cell(r, 4),
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER",
            textFormat: { bold: true, fontSize: 12 },
            numberFormat: { type: "NUMBER", pattern: "0.##" },
          },
        },
        fields: "userEnteredFormat",
      },
    });

    // Pay column green + currency
    requests.push({
      repeatCell: {
        range: cell(r, 5),
        cell: {
          userEnteredFormat: {
            textFormat: {
              foregroundColor: GREEN,
              bold: true,
              fontSize: 12,
            },
            numberFormat: { type: "CURRENCY", pattern: "$#,##0.00" },
            horizontalAlignment: "RIGHT",
          },
        },
        fields: "userEnteredFormat",
      },
    });

    // Sunday note columns G/H
    if (isSun) {
      [6, 7].forEach((c) => {
        requests.push({
          repeatCell: {
            range: cell(r, c),
            cell: {
              userEnteredFormat: {
                backgroundColor: BASE_BG,
                textFormat: {
                  fontSize: 11,
                  foregroundColor: { red: 0.3, green: 0.3, blue: 0.3 },
                },
                horizontalAlignment: "LEFT",
              },
            },
            fields: "userEnteredFormat",
          },
        });
      });
    }
  });

  // Summary row
  requests.push({
    repeatCell: {
      range: row(summaryRow, 0, 8),
      cell: {
        userEnteredFormat: {
          backgroundColor: SUMM_BG,
          textFormat: { fontSize: 11, bold: true, fontFamily: "Arial" },
          verticalAlignment: "MIDDLE",
          wrapStrategy: "CLIP",
          borders: {
            top: { style: "SOLID_MEDIUM", color: BLUE_GRID },
            bottom: { style: "SOLID_MEDIUM", color: BLUE_GRID },
            left: { style: "SOLID", color: GRID },
            right: { style: "SOLID", color: GRID },
          },
        },
      },
      fields: "userEnteredFormat",
    },
  });

  requests.push({
    repeatCell: {
      range: cell(summaryRow, 0),
      cell: {
        userEnteredFormat: {
          textFormat: { bold: true, fontSize: 13 },
          horizontalAlignment: "LEFT",
        },
      },
      fields: "userEnteredFormat",
    },
  });

  requests.push({
    repeatCell: {
      range: cell(summaryRow, 3),
      cell: {
        userEnteredFormat: {
          horizontalAlignment: "CENTER",
          textFormat: { fontSize: 12 },
        },
      },
      fields: "userEnteredFormat",
    },
  });

  requests.push({
    repeatCell: {
      range: cell(summaryRow, 4),
      cell: {
        userEnteredFormat: {
          horizontalAlignment: "CENTER",
          textFormat: { bold: true, fontSize: 13 },
        },
      },
      fields: "userEnteredFormat",
    },
  });

  requests.push({
    repeatCell: {
      range: cell(summaryRow, 5),
      cell: {
        userEnteredFormat: {
          numberFormat: { type: "CURRENCY", pattern: "$#,##0.00" },
          textFormat: {
            bold: true,
            fontSize: 14,
          },
          horizontalAlignment: "RIGHT",
        },
      },
      fields: "userEnteredFormat",
    },
  });

  // Keep G/H info readable but not heavy
  [6, 7].forEach((c) => {
    requests.push({
      repeatCell: {
        range: cell(summaryRow, c),
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "LEFT",
            textFormat: {
              bold: c === 7,
              fontSize: 11,
              foregroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
            },
          },
        },
        fields: "userEnteredFormat",
      },
    });
  });

  requests.push({
    mergeCells: {
      range: {
        sheetId: tabId,
        startRowIndex: summaryRow,
        endRowIndex: summaryRow + 1,
        startColumnIndex: 0,
        endColumnIndex: 3,
      },
      mergeType: "MERGE_ALL",
    },
  });

  // Biweekly summary row (only on pay-period close week)
  if (biweeklyRow !== null) {
    requests.push({
      repeatCell: {
        range: row(biweeklyRow, 0, 8),
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.86, green: 0.9, blue: 0.96 },
            textFormat: { bold: true, fontSize: 11 },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "CLIP",
          },
        },
        fields: "userEnteredFormat",
      },
    });

    requests.push({
      repeatCell: {
        range: cell(biweeklyRow, 0),
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "LEFT",
            textFormat: { bold: true, fontSize: 13 },
          },
        },
        fields: "userEnteredFormat",
      },
    });

    requests.push({
      repeatCell: {
        range: cell(biweeklyRow, 4),
        cell: {
          userEnteredFormat: {
            horizontalAlignment: "CENTER",
            textFormat: { bold: true, fontSize: 12 },
          },
        },
        fields: "userEnteredFormat",
      },
    });

    requests.push({
      repeatCell: {
        range: cell(biweeklyRow, 5),
        cell: {
          userEnteredFormat: {
            numberFormat: { type: "CURRENCY", pattern: "$#,##0.00" },
            horizontalAlignment: "RIGHT",
            textFormat: { bold: true, fontSize: 13 },
          },
        },
        fields: "userEnteredFormat",
      },
    });

    [6, 7].forEach((c) => {
      requests.push({
        repeatCell: {
          range: cell(biweeklyRow, c),
          cell: {
            userEnteredFormat: {
              horizontalAlignment: "LEFT",
              textFormat: {
                bold: c === 7,
                fontSize: 11,
                foregroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
              },
            },
          },
          fields: "userEnteredFormat",
        },
      });
    });

    requests.push({
      mergeCells: {
        range: {
          sheetId: tabId,
          startRowIndex: biweeklyRow,
          endRowIndex: biweeklyRow + 1,
          startColumnIndex: 0,
          endColumnIndex: 3,
        },
        mergeType: "MERGE_ALL",
      },
    });
  }

  // Column widths
  const colWidths = [128, 168, 122, 122, 84, 148, 150, 122];
  colWidths.forEach((px, i) => {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId: tabId,
          dimension: "COLUMNS",
          startIndex: i,
          endIndex: i + 1,
        },
        properties: { pixelSize: px },
        fields: "pixelSize",
      },
    });
  });

  // Row heights
  if (isFirstBlock) {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId: tabId,
          dimension: "ROWS",
          startIndex: headerRow,
          endIndex: headerRow + 1,
        },
        properties: { pixelSize: 38 },
        fields: "pixelSize",
      },
    });
  }
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId: tabId,
        dimension: "ROWS",
        startIndex: firstShift,
        endIndex: lastShift + 1,
      },
      properties: { pixelSize: 34 },
      fields: "pixelSize",
    },
  });
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId: tabId,
        dimension: "ROWS",
        startIndex: summaryRow,
        endIndex: summaryRow + 1,
      },
      properties: { pixelSize: 38 },
      fields: "pixelSize",
    },
  });
  if (biweeklyRow !== null) {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId: tabId,
          dimension: "ROWS",
          startIndex: biweeklyRow,
          endIndex: biweeklyRow + 1,
        },
        properties: { pixelSize: 40 },
        fields: "pixelSize",
      },
    });
  }
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId: tabId,
        dimension: "ROWS",
        startIndex: spacerRow,
        endIndex: spacerRow + 1,
      },
      properties: { pixelSize: 12 },
      fields: "pixelSize",
    },
  });

  // Borders for current block
  requests.push({
    updateBorders: {
      range: row(summaryRow, 0, 6),
      top: { style: "SOLID_MEDIUM", color: GRID },
    },
  });
  if (biweeklyRow !== null) {
    requests.push({
      updateBorders: {
        range: row(biweeklyRow, 0, 6),
        top: { style: "SOLID_MEDIUM", color: BLUE_GRID },
      },
    });
  }

  const tableRange = {
    sheetId: tabId,
    startRowIndex: isFirstBlock ? headerRow : firstShift,
    endRowIndex: (biweeklyRow ?? summaryRow) + 1,
    startColumnIndex: 0,
    endColumnIndex: 6,
  };
  requests.push({
    updateBorders: {
      range: tableRange,
      top: { style: "SOLID", color: GRID },
      bottom: { style: "SOLID", color: GRID },
      left: { style: "SOLID", color: GRID },
      right: { style: "SOLID", color: BLUE_GRID },
      innerHorizontal: { style: "SOLID", color: GRID },
      innerVertical: { style: "SOLID", color: GRID },
    },
  });

  // Strong blue divider at right side of Pay column (F)
  requests.push({
    updateBorders: {
      range: {
        sheetId: tabId,
        startRowIndex: isFirstBlock ? headerRow : firstShift,
        endRowIndex: (biweeklyRow ?? summaryRow) + 1,
        startColumnIndex: 5,
        endColumnIndex: 6,
      },
      right: { style: "SOLID_MEDIUM", color: BLUE_GRID },
    },
  });

  // Freeze header row
  if (isFirstBlock) {
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: tabId,
          gridProperties: { frozenRowCount: 1 },
        },
        fields: "gridProperties.frozenRowCount",
      },
    });
  }

  // Execute formatting
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    },
  );

  await updateSummaryTab();

  let successMsg = t.googleSheetsOk;
  if (duplicateCount > 0) {
    successMsg += ` (${newShifts.length} added, ${duplicateCount} duplicate${duplicateCount > 1 ? "s" : ""} skipped)`;
  }
  showGoogleStatus("success", successMsg);
  return true;
}

function getBiweeklyWindow(dateStr) {
  const base = new Date(PAY_PERIOD_ANCHOR_START + "T12:00:00");
  const d = new Date(dateStr + "T12:00:00");
  const msDay = 86400000;
  const diffDays = Math.floor((d - base) / msDay);
  const bucket = Math.floor(diffDays / PAY_PERIOD_LENGTH_DAYS);
  const start = new Date(
    base.getTime() + bucket * PAY_PERIOD_LENGTH_DAYS * msDay,
  );
  const end = new Date(start.getTime() + (PAY_PERIOD_LENGTH_DAYS - 1) * msDay);
  const payDate = new Date(end.getTime() + 5 * msDay); // Costco example: Friday after period close
  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
    payDate: toUsDate(payDate),
  };
}

function groupShiftsByPayPeriod(shifts) {
  // Sort shifts chronologically first
  const sorted = [...shifts].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.start || "").localeCompare(b.start || "");
  });

  // Group by biweekly pay period
  const byPeriod = {};
  sorted.forEach((shift) => {
    const biweekly = getBiweeklyWindow(shift.date);
    const key = `${biweekly.start}_${biweekly.end}`;
    if (!byPeriod[key]) {
      byPeriod[key] = {
        period: `${biweekly.start.replace(/-/g, "/")} - ${biweekly.end.replace(/-/g, "/")}`,
        shifts: [],
      };
    }
    byPeriod[key].shifts.push(shift);
  });

  // Convert to array and sort by start date
  return Object.values(byPeriod).sort((a, b) => {
    const dateA = a.shifts[0]?.date || "";
    const dateB = b.shifts[0]?.date || "";
    return dateA.localeCompare(dateB);
  });
}

function sumExistingBiweekly(values, biweekly) {
  let hours = 0;
  let pay = 0;
  values.forEach((r, idx) => {
    // Skip header row and summary rows
    if (idx === 0) return;
    const date = (r[0] || "").trim();
    // Only process valid date rows (yyyy-mm-dd format)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    // Skip rows outside the biweekly period
    if (date < biweekly.start || date > biweekly.end) return;
    // Must have Start and End times to be a valid shift row (not a summary)
    if (!r[2] || !r[3]) return;

    const hrs = parseFloat((r[4] || "").toString().replace(/,/g, ""));
    const payVal = parseFloat(
      (r[5] || "").toString().replace(/\$/g, "").replace(/,/g, ""),
    );
    if (!Number.isNaN(hrs)) hours += hrs;
    if (!Number.isNaN(payVal)) pay += payVal;
  });
  return { hours, pay };
}

function toIsoDate(dt) {
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

function toUsDate(dt) {
  const p = (n) => String(n).padStart(2, "0");
  return `${p(dt.getMonth() + 1)}/${p(dt.getDate())}/${dt.getFullYear()}`;
}

function confirmDuplicate() {
  const t = T[lang],
    el = document.getElementById("googleStatus");
  return new Promise((resolve) => {
    el.style.display = "block";
    el.className = "google-status warning";
    el.innerHTML = `<div style="margin-bottom:6px;font-weight:600">${t.sheetsDupTitle}</div><div style="font-size:.85rem;margin-bottom:10px">${t.sheetsDupMsg}</div><div style="display:flex;gap:8px"><button class="dup-yes-btn" id="dupYes">${t.sheetsDupYes}</button><button class="dup-no-btn" id="dupNo">${t.sheetsDupNo}</button></div>`;
    document.getElementById("dupYes").onclick = () => resolve(true);
    document.getElementById("dupNo").onclick = () => resolve(false);
  });
}

async function sendToBoth() {
  const parsed = parseAndValidate();
  if (!parsed) return;
  const calOk = await _doCalendar(parsed.shifts, parsed.period);
  if (calOk === false) return;
  const shtOk = await _doSheets(parsed.shifts, parsed.period);
  if (shtOk === false) return;
  showGoogleStatus("success", T[lang].googleBothOk);
  renderPreview(parsed.shifts);
  resetAfterAction();
}

function showGoogleStatus(type, msg) {
  const el = document.getElementById("googleStatus");
  el.style.display = "block";
  el.className = "google-status " + type;
  el.textContent = msg;
}

// ── ICS (everyone) ────────────────────────────────────────────────────
function generate() {
  const t = T[lang];
  document.getElementById("errorBox").style.display = "none";
  document.getElementById("successBox").style.display = "none";
  document.getElementById("preview").style.display = "none";
  const parsed = parseAndValidate();
  if (!parsed) return;

  const blob = new Blob([buildIcs(parsed.shifts)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = periodToFilename(parsed.period);
  a.click();
  URL.revokeObjectURL(url);
  showSuccess(t.successMsg + periodToFilename(parsed.period));
  renderPreview(parsed.shifts);
  resetAfterAction();
}

function renderPreview(shifts) {
  const t = T[lang];
  const DAYS = lang === "es" ? DAYS_ES : DAYS_EN;
  const MONTHS = lang === "es" ? MONTHS_ES : MONTHS_EN;
  const merged = mergeShifts(shifts);
  const total = merged.reduce((a, s) => a + parseFloat(s.hours), 0);
  document.getElementById("weeklySummary").textContent =
    `${t.weeklyLabel} ${total.toFixed(2)} hrs`;
  const fmt = (dt) => {
    let h = dt.getHours(),
      m = dt.getMinutes(),
      ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ap}`;
  };
  document.getElementById("shiftList").innerHTML = merged
    .map((s) => {
      const d = new Date(s.date + "T00:00:00");
      return `<div class="shift-item"><span class="shift-day">${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}</span><span class="shift-time">${fmt(s.startDt)} &ndash; ${fmt(s.endDt)}</span><span class="shift-hrs">${s.hours}h</span></div>`;
    })
    .join("");
  document.getElementById("preview").style.display = "block";
}

function buildIcs(shifts) {
  const t = T[lang];
  const merged = mergeShifts(shifts);
  const now = toIcsDt(new Date()).replace(/T/, "") + "Z";
  const totalWeekHours = merged.reduce((a, s) => a + parseFloat(s.hours), 0);
  const totalWeekDays = merged.length;
  const location = document.getElementById("locationSelect").value;
  const extraMins = parseInt(document.getElementById("reminderSelect").value);
  const includeWeekly = document.getElementById("weeklyToggle").checked;
  const includeLunch = document.getElementById("lunchToggle").checked;

  let events = "";
  for (const s of merged) {
    const uid = "costco-" + s.date + "-" + Math.random().toString(36).slice(2);
    let desc = `${t.descShift}\\n⏱ ${t.descHours}: ${s.hours} hrs`;
    if (includeWeekly)
      desc += `\\n📅 ${t.descWeekTotal}: ${totalWeekHours.toFixed(2)} hrs (${totalWeekDays} ${t.descWeekDays})`;
    const lines = [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${toIcsDt(s.startDt)}`,
      `DTEND:${toIcsDt(s.endDt)}`,
      "SUMMARY:Costco",
      "COLOR:grape",
      "X-APPLE-CALENDAR-COLOR:#8B008B",
      `DESCRIPTION:${desc}`,
    ];
    if (location) lines.push(`LOCATION:${location}`);
    // Fixed 30-min reminder
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${t.descShift}`,
      "TRIGGER:-PT30M",
      "END:VALARM",
    );
    // Extra reminder if set
    if (extraMins > 0) {
      const th = extraMins / 60;
      const tr = Number.isInteger(th) ? `-PT${th}H` : `-PT${extraMins}M`;
      lines.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${t.descShift}`,
        `TRIGGER:${tr}`,
        "END:VALARM",
      );
    }
    lines.push("END:VEVENT");
    events += lines.join("\r\n") + "\r\n";

    const lunchReminderAt = includeLunch
      ? getLunchReminderDate(s.startDt, s.hours)
      : null;
    if (lunchReminderAt) {
      const lunchEnd = new Date(
        lunchReminderAt.getTime() + LUNCH_EVENT_DURATION_MINUTES * 60000,
      );
      const lunchUid =
        "costco-lunch-" + s.date + "-" + Math.random().toString(36).slice(2);
      const lunchLines = [
        "BEGIN:VEVENT",
        `UID:${lunchUid}`,
        `DTSTAMP:${now}`,
        `DTSTART:${toIcsDt(lunchReminderAt)}`,
        `DTEND:${toIcsDt(lunchEnd)}`,
        `SUMMARY:${t.descLunchTitle}`,
        `DESCRIPTION:${t.descLunchNote}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${t.descLunchTitle}`,
        "TRIGGER:PT0M",
        "END:VALARM",
        "END:VEVENT",
      ];
      if (location) lunchLines.splice(7, 0, `LOCATION:${location}`);
      events += lunchLines.join("\r\n") + "\r\n";
    }
  }
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CostcoSchedule//EN//",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events.trim(),
    "END:VCALENDAR",
  ].join("\r\n");
}

// ── HELPERS ───────────────────────────────────────────────────────────
function setImageMode(mode) {
  imageMode = mode;
  document
    .getElementById("imgmode-btn-printed")
    .classList.toggle("active", mode === "printed");
  document
    .getElementById("imgmode-btn-kronos")
    .classList.toggle("active", mode === "kronos");
  document.getElementById("nameStep").style.display =
    mode === "printed" ? "flex" : "none";
  document.getElementById("stepnum-prompt").textContent =
    mode === "printed" ? "3" : "2";
  document.getElementById("stepnum-json").textContent =
    mode === "printed" ? "4" : "3";
  document.getElementById("stepnum-options").textContent =
    mode === "printed" ? "5" : "4";
  updatePrompt();
}
function setInputMode(mode) {
  inputMode = mode;
  document
    .getElementById("btn-json")
    .classList.toggle("active", mode === "json");
  document
    .getElementById("btn-manual")
    .classList.toggle("active", mode === "manual");
  document.getElementById("jsonInput").style.display =
    mode === "json" ? "block" : "none";
  document.getElementById("fixJsonBtn").style.display = "none";
  document.getElementById("jsonValidation").style.display =
    mode === "json" ? "block" : "none";
  document.getElementById("manualInput").style.display =
    mode === "manual" ? "block" : "none";
  if (mode === "json") validateJsonInputLive();
}
function addShift() {
  const date = document.getElementById("manualDate").value,
    start = document.getElementById("manualStart").value,
    end = document.getElementById("manualEnd").value;
  if (!date || !start || !end) return;
  let hours =
    (new Date("2000-01-01T" + end) - new Date("2000-01-01T" + start)) / 3600000;
  if (hours <= 0) hours += 24;
  manualShifts.push({
    date,
    start: fmt12(start),
    end: fmt12(end),
    hours: hours.toFixed(2),
  });
  renderManualShifts();
  document.getElementById("manualDate").value =
    document.getElementById("manualStart").value =
    document.getElementById("manualEnd").value =
      "";
}
function fmt12(t24) {
  const [h, m] = t24.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m}${hr >= 12 ? "P" : "A"}`;
}
function removeShift(i) {
  manualShifts.splice(i, 1);
  renderManualShifts();
}
function clearManualShifts() {
  manualShifts = [];
  renderManualShifts();
}
function renderManualShifts() {
  const DAYS = lang === "es" ? DAYS_ES : DAYS_EN,
    MONTHS = lang === "es" ? MONTHS_ES : MONTHS_EN;
  document.getElementById("manualShiftsList").innerHTML = manualShifts
    .map((s, i) => {
      const d = new Date(s.date + "T00:00:00");
      return `<div class="manual-shift-item"><span>${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}</span><span>${s.start} - ${s.end}</span><button onclick="removeShift(${i})">×</button></div>`;
    })
    .join("");
}
function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon();
}
function updateThemeIcon() {
  document.getElementById("themeToggle").innerHTML =
    theme === "light"
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}
function setLang(l) {
  lang = l;
  document.getElementById("btn-es").classList.toggle("active", l === "es");
  document.getElementById("btn-en").classList.toggle("active", l === "en");
  applyTranslations();
  updatePrompt();
}
function applyTranslations() {
  const t = T[lang];
  const s = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  s("txt-subtitle", t.subtitle);
  s("txt-step1-title", t.step1Title);
  s("txt-step1-desc", t.step1Desc);
  s("txt-imgmode-printed", t.imgModePrinted);
  s("txt-imgmode-kronos", t.imgModeKronos);
  s("txt-step2-title", t.step2Title);
  s("txt-step2-desc", t.step2Desc);
  s("txt-name-label", t.nameLabel);
  s("txt-step3-title", t.step3Title);
  s("txt-step3-desc", t.step3Desc);
  s("copyPromptBtn", t.copyBtn);
  s("txt-step4-title", t.step4Title);
  s("txt-step4-desc", t.step4Desc);
  s("fixJsonBtn", t.fixJsonBtn);
  s("txt-step5-title", t.step5Title);
  s("txt-step5-desc", t.step5Desc);
  s("txt-opt-location-label", t.optLocationLabel);
  s("txt-opt-reminder1-label", t.optReminder1Label);
  s("txt-opt-reminder2-label", t.optReminder2Label);
  s("txt-opt-weekly-label", t.optWeeklyLabel);
  s("txt-opt-lunch-label", t.optLunchLabel);
  s("txt-generate-btn", t.generateBtn);
  s("txt-preview-title", t.previewTitle);
  s("txt-clear-btn", t.clearBtn);
  s("txt-juan-divider", t.juanDivider);
  s("txt-google-signin", t.googleSignin);
  s("txt-signout-btn", t.signout);
  const optNone = document.getElementById("opt-none");
  if (optNone) optNone.textContent = t.optReminderNone;
  const calBtn = document.getElementById("txt-send-calendar");
  if (calBtn) calBtn.querySelector("span").textContent = t.sendCalendar;
  const shtBtn = document.getElementById("txt-send-sheets");
  if (shtBtn) shtBtn.querySelector("span").textContent = t.sendSheets;
  const botBtn = document.getElementById("txt-send-both");
  if (botBtn) botBtn.querySelector("span").textContent = t.sendBoth;
  const openSheetBtn = document.getElementById("txt-open-sheet");
  if (openSheetBtn)
    openSheetBtn.querySelector("span").textContent = t.openSheet;
  renderManualShifts();
  validateJsonInputLive();
  updateOwnerSheetButton();
}
function getPromptText(name) {
  if (imageMode === "kronos") {
    return lang === "es"
      ? `Analiza esta(s) imagen(es) de la app Kronos que muestran mi horario de trabajo (puede ser 1 o varias).\nDevuelveme UNICAMENTE un JSON valido con este formato exacto, sin explicacion ni texto extra:\n\n{\n  "period": "M/DD/YY - M/DD/YY",\n  "shifts": [\n    {"date": "YYYY-MM-DD", "start": "H:MMX", "end": "H:MMX", "hours": "N.NN"}\n  ]\n}\n\nDonde X es A o P (AM/PM).\nReglas:\n- Incluye TODOS los turnos visibles en TODAS las imagenes.\n- Elimina turnos duplicados.\n- Ignora "System Calculation Only".\n- Devuelve "shifts" en orden cronologico (fecha y hora de inicio).\n\nAbre en: https://claude.ai`
      : `Analyze this/these Kronos schedule image(s) (one or multiple images).\nReturn ONLY a valid JSON in this exact format, no explanation or extra text:\n\n{\n  "period": "M/DD/YY - M/DD/YY",\n  "shifts": [\n    {"date": "YYYY-MM-DD", "start": "H:MMX", "end": "H:MMX", "hours": "N.NN"}\n  ]\n}\n\nWhere X is A or P.\nRules:\n- Include ALL visible shifts across ALL images.\n- Remove duplicate shifts.\n- Ignore "System Calculation Only".\n- Return "shifts" in chronological order (date + start time).\n\nOpen at: https://claude.ai`;
  }
  return lang === "es"
    ? `Analiza esta(s) imagen(es) de horario y extrae SOLO los turnos de "${name}" (puede ser 1 o varias imagenes).\nDevuelveme UNICAMENTE un JSON valido con este formato exacto, sin explicacion ni texto extra:\n\n{\n  "period": "M/DD/YY - M/DD/YY",\n  "shifts": [\n    {"date": "YYYY-MM-DD", "start": "H:MMX", "end": "H:MMX", "hours": "N.NN"}\n  ]\n}\n\nDonde X es A o P.\nReglas:\n- El campo "period" es el Time Period de la parte superior (ej: "3/02/26 - 3/08/26").\n- Incluye todos los turnos visibles en todas las imagenes.\n- Si un dia tiene dos bloques, incluyelos como entradas separadas.\n- Elimina turnos duplicados.\n- Devuelve "shifts" en orden cronologico (fecha y hora de inicio).\n\nAbre en: https://chatgpt.com o https://claude.ai`
    : `Analyze this/these schedule image(s) and extract ONLY the shifts for "${name}" (one or multiple images).\nReturn ONLY a valid JSON in this exact format, no explanation or extra text:\n\n{\n  "period": "M/DD/YY - M/DD/YY",\n  "shifts": [\n    {"date": "YYYY-MM-DD", "start": "H:MMX", "end": "H:MMX", "hours": "N.NN"}\n  ]\n}\n\nWhere X is A or P.\nRules:\n- The "period" field is the Time Period from the top (e.g. "3/02/26 - 3/08/26").\n- Include all visible shifts across all images.\n- If a day has two blocks, include them as separate entries.\n- Remove duplicate shifts.\n- Return "shifts" in chronological order (date + start time).\n\nOpen at: https://chatgpt.com or https://claude.ai`;
}
function updatePrompt() {
  document.getElementById("promptText").textContent = getPromptText(
    document.getElementById("employeeName").value.trim() || OWNER_NAME,
  );
}
function fixQuotes(s) {
  return s.replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, '"');
}
function parseJsonInput() {
  const rawInput = document.getElementById("jsonInput").value.trim();
  if (!rawInput) return null;
  let raw = fixQuotes(rawInput);
  const match = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) raw = match[0];
  try {
    return { data: JSON.parse(raw), raw };
  } catch (e) {
    return { data: null, raw, error: e.message };
  }
}
function replaceTpl(str, map) {
  return str.replace(/\{(\w+)\}/g, (_, key) => map[key] ?? "");
}
function normalizeShiftDate(value) {
  const original = (value || "").toString().trim();
  if (!original) return { value: original, valid: false };
  const iso = original.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const y = iso[1];
    const m = String(parseInt(iso[2], 10)).padStart(2, "0");
    const d = String(parseInt(iso[3], 10)).padStart(2, "0");
    const normalized = `${y}-${m}-${d}`;
    return {
      value: normalized,
      changed: normalized !== original,
      valid: true,
    };
  }
  const md = original.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!md) return { value: original, valid: false };
  let year = parseInt(md[3], 10);
  if (md[3].length === 2) year += 2000;
  const month = parseInt(md[1], 10);
  const day = parseInt(md[2], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { value: original, valid: false };
  }
  const normalized = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return {
    value: normalized,
    changed: normalized !== original,
    valid: true,
  };
}
function to12Hour(hour24, minute) {
  const ap = hour24 >= 12 ? "P" : "A";
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(minute).padStart(2, "0")}${ap}`;
}
function normalizeShiftTime(value) {
  const original = (value || "").toString().trim();
  if (!original) return { value: original, valid: false };
  const clean = original.toUpperCase().replace(/\./g, "").replace(/\s+/g, "");

  let m = clean.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m) {
    const normalized = to12Hour(parseInt(m[1], 10), parseInt(m[2], 10));
    return {
      value: normalized,
      changed: normalized !== original,
      valid: true,
    };
  }
  m = clean.match(/^([01]?\d|2[0-3])$/);
  if (m) {
    const normalized = to12Hour(parseInt(m[1], 10), 0);
    return {
      value: normalized,
      changed: normalized !== original,
      valid: true,
    };
  }
  m = clean.match(/^(\d{1,2})(?::([0-5]\d))?([AP])M?$/);
  if (m) {
    const hour = parseInt(m[1], 10);
    if (hour < 1 || hour > 12) return { value: original, valid: false };
    const normalized = `${hour}:${(m[2] || "00").padStart(2, "0")}${m[3]}`;
    return {
      value: normalized,
      changed: normalized !== original,
      valid: true,
    };
  }
  return { value: original, valid: false };
}
function calcHoursFromTimes(start, end, date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const ref = new Date(date + "T00:00:00");
  if (Number.isNaN(ref.getTime())) return null;
  const s = parseTime(start, ref);
  let e = parseTime(end, ref);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const crossedMidnight = e <= s;
  if (crossedMidnight) e = new Date(e.getTime() + 86400000);
  return {
    hours: (e - s) / 3600000,
    crossedMidnight,
    startDt: s,
    endDt: e,
  };
}
function getAcceptedHourValues(rawHours) {
  const values = [rawHours];
  if (rawHours >= PAID_BREAK_MIN_SHIFT_HOURS) {
    values.push(rawHours - PAID_BREAK_DEDUCTION_HOURS);
  }
  return values;
}
function hoursMatchesPolicy(inputHours, rawHours) {
  if (!Number.isFinite(inputHours)) return false;
  return getAcceptedHourValues(rawHours).some(
    (v) => Math.abs(inputHours - v) <= 0.11,
  );
}
function normalizeAndDedupeShifts(shifts) {
  const cleaned = shifts
    .map((s) => ({
      ...s,
      date:
        normalizeShiftDate(s.date).value || (s.date || "").toString().trim(),
      start:
        normalizeShiftTime(s.start).value || (s.start || "").toString().trim(),
      end: normalizeShiftTime(s.end).value || (s.end || "").toString().trim(),
    }))
    .filter((s) => s.date && s.start && s.end);

  const seen = new Set();
  const deduped = cleaned.filter((s) => {
    const key = `${s.date}|${s.start}|${s.end}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const timeRank = (date, time) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Number.MAX_SAFE_INTEGER;
    const ref = new Date(date + "T00:00:00");
    if (Number.isNaN(ref.getTime())) return Number.MAX_SAFE_INTEGER;
    const t = normalizeShiftTime(time);
    if (!t.valid) return Number.MAX_SAFE_INTEGER;
    return parseTime(t.value, ref).getTime();
  };

  return deduped.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return timeRank(a.date, a.start) - timeRank(b.date, b.start);
  });
}
function validateShiftData(shifts) {
  const t = T[lang];
  const issues = [];
  const byDate = {};

  shifts.forEach((shift, idx) => {
    const dateRaw = (shift.date || "").toString();
    const date = normalizeShiftDate(dateRaw);
    const safeDate = date.value || dateRaw || `#${idx + 1}`;
    if (!date.valid) {
      issues.push(replaceTpl(t.jsonErrBadDate, { date: safeDate }));
      return;
    }

    const start = normalizeShiftTime(shift.start);
    const end = normalizeShiftTime(shift.end);
    if (!start.valid || !end.valid) {
      issues.push(replaceTpl(t.jsonErrBadTime, { date: date.value }));
      return;
    }

    const calc = calcHoursFromTimes(start.value, end.value, date.value);
    if (!calc) {
      issues.push(replaceTpl(t.jsonErrBadTime, { date: date.value }));
      return;
    }
    if (calc.crossedMidnight) {
      issues.push(replaceTpl(t.jsonErrEndBeforeStart, { date: date.value }));
    }

    const h = parseFloat((shift.hours ?? "").toString());
    if (!Number.isFinite(h)) {
      issues.push(
        replaceTpl(t.jsonErrMismatchHours, {
          date: date.value,
          jsonHours: String(shift.hours ?? ""),
          calcHours: calc.hours.toFixed(2),
        }),
      );
    } else {
      if (h < 0)
        issues.push(replaceTpl(t.jsonErrNegativeHours, { date: date.value }));
      if (!hoursMatchesPolicy(h, calc.hours)) {
        issues.push(
          replaceTpl(t.jsonErrMismatchHours, {
            date: date.value,
            jsonHours: h.toFixed(2),
            calcHours: calc.hours.toFixed(2),
          }),
        );
      }
    }

    if (!byDate[date.value]) byDate[date.value] = [];
    byDate[date.value].push({
      startDt: calc.startDt,
      endDt: calc.endDt,
    });
  });

  Object.entries(byDate).forEach(([date, rows]) => {
    const sorted = [...rows].sort((a, b) => a.startDt - b.startDt);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].startDt < sorted[i - 1].endDt) {
        issues.push(replaceTpl(t.jsonErrOverlap, { date }));
      }
    }
  });

  return issues;
}
function renderJsonValidation(issues, infoLines = []) {
  const box = document.getElementById("jsonValidation");
  const fixBtn = document.getElementById("fixJsonBtn");
  if (inputMode !== "json") {
    box.style.display = "none";
    fixBtn.style.display = "none";
    return;
  }
  const t = T[lang];
  if (!issues.length && !infoLines.length) {
    box.style.display = "none";
    box.innerHTML = "";
    box.className = "json-validation";
    fixBtn.style.display = "none";
    return;
  }
  fixBtn.style.display = issues.length ? "block" : "none";
  const stateClass = issues.length ? "warning" : "ok";
  box.className = `json-validation ${stateClass}`;
  const lines = issues.length ? issues : infoLines;
  box.innerHTML = `<div class="json-validation-title">${t.jsonWarnTitle}</div><ul>${lines
    .map((msg) => `<li>${msg}</li>`)
    .join("")}</ul>`;
  box.style.display = "block";
}
function validateJsonInputLive() {
  if (inputMode !== "json") return;
  const t = T[lang];
  const parsed = parseJsonInput();
  if (!parsed) {
    renderJsonValidation([]);
    return;
  }
  if (parsed.error) {
    renderJsonValidation([t.jsonFixInvalid]);
    return;
  }

  const issues = [];
  let allShifts = [];

  // Check if it's an array of periods
  if (Array.isArray(parsed.data) && parsed.data.length > 0 && parsed.data[0].period && parsed.data[0].shifts) {
    // Validate each period doesn't span more than one pay week
    parsed.data.forEach((periodData, idx) => {
      const shifts = periodData.shifts || [];
      if (shifts.length === 0) return;

      allShifts.push(...shifts);

      // Get unique biweekly periods in this period's shifts
      const periods = new Set();
      shifts.forEach((shift) => {
        if (shift.date) {
          const biweekly = getBiweeklyWindow(shift.date);
          periods.add(`${biweekly.start}_${biweekly.end}`);
        }
      });

      if (periods.size > 1) {
        issues.push(
          `Period #${idx + 1} "${periodData.period || "unknown"}" spans multiple pay weeks (${periods.size} weeks detected). Each period must contain only one week.`
        );
      }
    });
  } else if (Array.isArray(parsed.data)) {
    allShifts = parsed.data;
  } else {
    allShifts = parsed.data?.shifts || [];
  }

  if (!allShifts.length) {
    renderJsonValidation([]);
    return;
  }

  // Also validate individual shifts
  const shiftIssues = validateShiftData(allShifts);
  renderJsonValidation([...issues, ...shiftIssues]);
}
function fixJsonInput() {
  const t = T[lang];
  const parsed = parseJsonInput();
  if (!parsed) {
    showError(t.jsonFixNoInput);
    return;
  }
  if (parsed.error) {
    showError(t.jsonFixInvalid);
    return;
  }

  const changes = [];
  let output;

  // Check if it's multiple periods
  if (Array.isArray(parsed.data) && parsed.data.length > 0 && parsed.data[0].period && parsed.data[0].shifts) {
    // Multiple periods - split any that span multiple weeks
    const fixedPeriods = [];

    parsed.data.forEach((periodData) => {
      const shifts = periodData.shifts || [];
      if (shifts.length === 0) {
        fixedPeriods.push(periodData);
        return;
      }

      // Group shifts by biweekly period
      const byWeek = {};
      shifts.forEach((shift) => {
        if (shift.date) {
          const biweekly = getBiweeklyWindow(shift.date);
          const key = `${biweekly.start}_${biweekly.end}`;
          if (!byWeek[key]) {
            byWeek[key] = { biweekly, shifts: [] };
          }
          byWeek[key].shifts.push(shift);
        }
      });

      const weeks = Object.values(byWeek);
      if (weeks.length > 1) {
        changes.push(`Split period "${periodData.period}" into ${weeks.length} separate weeks`);
      }

      // Create one period per week
      weeks.forEach((week) => {
        // Fix each shift
        week.shifts.forEach((shift) => {
          const dateNorm = normalizeShiftDate(shift.date);
          if (dateNorm.valid && dateNorm.changed) shift.date = dateNorm.value;

          const startNorm = normalizeShiftTime(shift.start);
          if (startNorm.valid && startNorm.changed) shift.start = startNorm.value;

          const endNorm = normalizeShiftTime(shift.end);
          if (endNorm.valid && endNorm.changed) shift.end = endNorm.value;

          const calc = calcHoursFromTimes(shift.start, shift.end, shift.date);
          const h = parseFloat((shift.hours ?? "").toString());
          if (calc && (!Number.isFinite(h) || h < 0 || !hoursMatchesPolicy(h, calc.hours))) {
            shift.hours = calc.hours.toFixed(2);
          }
        });

        // Sort shifts by date
        week.shifts.sort((a, b) => (a.date || "").localeCompare(b.date || ""));

        const startDate = week.shifts[0]?.date || week.biweekly.start;
        const endDate = week.shifts[week.shifts.length - 1]?.date || week.biweekly.end;

        fixedPeriods.push({
          period: `${startDate.replace(/-/g, "/")} - ${endDate.replace(/-/g, "/")}`,
          shifts: week.shifts,
        });
      });
    });

    output = fixedPeriods;
  } else {
    // Single period or array of shifts - original logic
    const isArray = Array.isArray(parsed.data);
    const payload = isArray ? { shifts: parsed.data } : parsed.data;
    const shifts = Array.isArray(payload.shifts) ? payload.shifts : [];

    shifts.forEach((shift, idx) => {
      const rowLabel = `#${idx + 1}`;
      const dateNorm = normalizeShiftDate(shift.date);
      if (dateNorm.valid && dateNorm.changed) {
        changes.push(`${rowLabel} date: "${shift.date}" -> "${dateNorm.value}"`);
        shift.date = dateNorm.value;
      }
      const startNorm = normalizeShiftTime(shift.start);
      if (startNorm.valid && startNorm.changed) {
        changes.push(`${rowLabel} start: "${shift.start}" -> "${startNorm.value}"`);
        shift.start = startNorm.value;
      }
      const endNorm = normalizeShiftTime(shift.end);
      if (endNorm.valid && endNorm.changed) {
        changes.push(`${rowLabel} end: "${shift.end}" -> "${endNorm.value}"`);
        shift.end = endNorm.value;
      }

      const calc = calcHoursFromTimes(shift.start, shift.end, shift.date);
      const h = parseFloat((shift.hours ?? "").toString());
      if (calc && (!Number.isFinite(h) || h < 0 || !hoursMatchesPolicy(h, calc.hours))) {
        const old = shift.hours;
        shift.hours = calc.hours.toFixed(2);
        changes.push(`${rowLabel} hours: "${old}" -> "${shift.hours}"`);
      }
    });

    output = isArray ? shifts : payload;
  }

  document.getElementById("jsonInput").value = JSON.stringify(output, null, 2);
  validateJsonInputLive();

  if (!changes.length) {
    showSuccess(t.jsonFixNoChanges);
    renderJsonValidation([], [t.jsonFixNoChanges]);
    return;
  }
  showSuccess(t.jsonFixDone);
  renderJsonValidation([], [`${t.jsonFixDone} ${changes.join(" | ")}`]);
}
function parseTime(str, refDate) {
  str = str.trim().toUpperCase();
  const ap = str.slice(-1),
    tp = str.slice(0, -1);
  let [h, m] = tp.includes(":") ? tp.split(":").map(Number) : [parseInt(tp), 0];
  if (ap === "P" && h !== 12) h += 12;
  if (ap === "A" && h === 12) h = 0;
  const d = new Date(refDate);
  d.setHours(h, m, 0, 0);
  return d;
}
function toIcsDt(dt) {
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}${p(dt.getMonth() + 1)}${p(dt.getDate())}T${p(dt.getHours())}${p(dt.getMinutes())}00`;
}
function mergeShifts(shifts) {
  const byDate = {};
  for (const s of shifts) {
    if (!byDate[s.date]) byDate[s.date] = [];
    byDate[s.date].push(s);
  }
  return Object.keys(byDate)
    .sort()
    .map((day) => {
      const ds = byDate[day],
        ref = new Date(day + "T00:00:00");
      const sts = ds.map((s) => parseTime(s.start, ref));
      const ens = ds.map((s, i) => {
        let e = parseTime(s.end, ref);
        if (e <= sts[i]) e = new Date(e.getTime() + 86400000);
        return e;
      });
      const totalHours = ds.reduce((a, s) => a + parseFloat(s.hours), 0);
      return {
        date: day,
        startDt: new Date(Math.min(...sts)),
        endDt: new Date(Math.max(...ens)),
        hours: totalHours, // Keep as number, not string
      };
    });
}
function getLunchReminderDate(startDt, hoursWorked) {
  if (parseFloat(hoursWorked) <= LUNCH_THRESHOLD_HOURS) return null;
  const minsAfterStart = 5 * 60 - LUNCH_NOTICE_BEFORE_MINUTES;
  return new Date(startDt.getTime() + minsAfterStart * 60000);
}
function periodToFilename(p) {
  return "costco_" + p.trim().replace(/\//g, "-").replace(" - ", "_") + ".ics";
}
function showError(msg) {
  const el = document.getElementById("errorBox");
  el.textContent = msg;
  el.style.display = "block";
  document.getElementById("successBox").style.display = "none";
  document.getElementById("preview").style.display = "none";
}
function showSuccess(msg) {
  const el = document.getElementById("successBox");
  el.textContent = msg;
  el.style.display = "block";
  document.getElementById("errorBox").style.display = "none";
}
function copyPrompt() {
  navigator.clipboard
    .writeText(document.getElementById("promptText").textContent)
    .then(() => {
      const btn = document.getElementById("copyPromptBtn");
      btn.textContent = T[lang].copiedBtn;
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = T[lang].copyBtn;
        btn.classList.remove("copied");
      }, 2000);
    });
}

// ── INIT ──────────────────────────────────────────────────────────────
document.documentElement.setAttribute("data-theme", theme);
updateThemeIcon();
applyTranslations();
updatePrompt();
checkJuanSection();
