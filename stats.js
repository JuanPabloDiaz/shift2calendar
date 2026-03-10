// Configuration (same as main app)
const GOOGLE_CLIENT_ID = "19286324149-5oje1gclta6vpgs88rogvcp33h1pno0r.apps.googleusercontent.com";
const SHEET_ID = "1nozoAVbXK3qoahczhQnOonOE4EQj3OA5vjmUf-5itKY";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
const HOURLY_RATE = 20;
const SUNDAY_RATE = 30;

let accessToken = null;
let chartInstances = {};
let lang = "en";
let theme = localStorage.getItem("theme") || "light";

// ── TRANSLATIONS ──────────────────────────────────────────────────────
const T = {
  es: {
    title: "Tus Estadísticas de Trabajo",
    subtitle: "Datos históricos e información de tu horario",
    back: "Volver al Horario",
    signout: "Cerrar sesión",
    authTitle: "Inicia sesión para ver tus estadísticas",
    authDesc: "Inicia sesión con tu cuenta de Google para acceder a tus estadísticas de trabajo",
    authBtn: "Iniciar sesión con Google",
    totalHours: "Horas Totales Trabajadas",
    totalEarnings: "Ganancias Totales",
    avgHours: "Promedio Horas/Semana",
    sundayPremium: "Prima Dominical",
    sickTime: "Tiempo de Enfermedad Acumulado",
    raiseProgress: "Progreso para Aumento",
    hoursUnit: "horas",
    hrsWkUnit: "hrs/sem",
    sickUnit: "horas",
    chartHours: "Horas Trabajadas en el Tiempo",
    chartEarnings: "Ganancias en el Tiempo",
    chartSunday: "Horas Dominicales vs Regulares",
    chartWeekly: "Desglose Semanal",
  },
  en: {
    title: "Your Work Statistics",
    subtitle: "Historical data and insights from your schedule",
    back: "Back to Schedule",
    signout: "Sign Out",
    authTitle: "Sign in to view your stats",
    authDesc: "Sign in with your Google account to access your work statistics",
    authBtn: "Sign In with Google",
    totalHours: "Total Hours Worked",
    totalEarnings: "Total Earnings",
    avgHours: "Avg Hours/Week",
    sundayPremium: "Sunday Premium",
    sickTime: "Sick Time Earned",
    raiseProgress: "Progress to Raise",
    hoursUnit: "hours",
    hrsWkUnit: "hrs/wk",
    sickUnit: "hours",
    chartHours: "Hours Worked Over Time",
    chartEarnings: "Earnings Over Time",
    chartSunday: "Sunday vs Regular Hours",
    chartWeekly: "Weekly Breakdown",
  },
};

// ── GOOGLE AUTH ────────────────────────────────────────────────────────

// Save token to localStorage with expiry timestamp
function saveToken(token) {
  const expiryTime = Date.now() + 3600000; // 1 hour from now
  localStorage.setItem('googleAccessToken', token);
  localStorage.setItem('tokenExpiry', expiryTime.toString());
  console.log('Token saved, expires at:', new Date(expiryTime).toLocaleTimeString());
}

// Load token from localStorage if valid
function loadSavedToken() {
  const savedToken = localStorage.getItem('googleAccessToken');
  const expiry = localStorage.getItem('tokenExpiry');

  if (!savedToken || !expiry) {
    return null;
  }

  // Check if token is expired
  if (Date.now() >= parseInt(expiry)) {
    console.log('Saved token expired, clearing...');
    clearSavedToken();
    return null;
  }

  const remainingMinutes = Math.floor((parseInt(expiry) - Date.now()) / 60000);
  console.log(`Token loaded, ${remainingMinutes} minutes remaining`);
  return savedToken;
}

// Clear saved token
function clearSavedToken() {
  localStorage.removeItem('googleAccessToken');
  localStorage.removeItem('tokenExpiry');
}

function handleCredentialResponse(response) {
  const credential = response.credential;
  // Decode JWT to get user info
  const payload = JSON.parse(atob(credential.split('.')[1]));
  console.log('Signed in as:', payload.email);

  // Request access token for Sheets API
  requestAccessToken();
}

function requestAccessToken(useSilent = false) {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        console.error('OAuth error:', response);

        // If silent refresh failed, try with consent prompt
        if (useSilent) {
          console.log('Silent refresh failed, requesting consent...');
          requestAccessToken(false);
          return;
        }

        showError('Failed to get access token. Please check popup blockers and try again.');
        return;
      }
      if (response.access_token) {
        accessToken = response.access_token;
        saveToken(response.access_token); // Save to localStorage
        showStatsContent();
        loadData();
      }
    },
  });

  try {
    // Use silent refresh if requested (no popup), otherwise ask for consent
    const prompt = useSilent ? '' : 'consent';
    console.log('Requesting token with prompt:', prompt || 'silent');
    client.requestAccessToken({ prompt });
  } catch (error) {
    console.error('Token request error:', error);
    if (!useSilent) {
      showError('Please allow popups for this site and try again.');
    }
  }
}

function showError(message) {
  const authSection = document.getElementById('authSection');
  const existingError = authSection.querySelector('.error-message');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = 'background:#ff6b6b;color:white;padding:15px;border-radius:8px;margin-top:20px;';
  errorDiv.innerHTML = `
    <strong>⚠️ Error:</strong> ${message}<br><br>
    <strong>Soluciones:</strong><br>
    1. Permite popups en tu navegador para este sitio<br>
    2. Usa Chrome o Edge (mejor compatibilidad)<br>
    3. Abre desde <code>localhost</code> en lugar de <code>127.0.0.1</code>
  `;
  authSection.appendChild(errorDiv);
}

function showStatsContent() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('statsContent').style.display = 'block';
}

function signOut() {
  accessToken = null;
  clearSavedToken(); // Clear from localStorage
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('statsContent').style.display = 'none';
  document.getElementById('loadingMessage').style.display = 'block';
  document.getElementById('dataContent').style.display = 'none';
  google.accounts.id.disableAutoSelect();
  console.log('Signed out and cleared saved token');
}

// ── DATA FETCHING ──────────────────────────────────────────────────────
async function loadData() {
  try {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('dataContent').style.display = 'none';

    // Fetch data from Schedule tab
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Schedule!A:H`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!response.ok) {
      // If unauthorized, token might be invalid/expired
      if (response.status === 401) {
        console.error('Token expired or invalid');
        clearSavedToken();
        accessToken = null;
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('statsContent').style.display = 'none';
        showError('Session expired. Please sign in again.');
        return;
      }
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const rows = data.values || [];

    // Process data
    const processedData = processSheetData(rows);

    // Save data globally for theme updates
    window.lastProcessedData = processedData;

    // Update UI
    updateSummaryStats(processedData);
    createCharts(processedData);

    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('dataContent').style.display = 'block';
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('loadingMessage').innerHTML =
      '<div class="error">Error loading data. Please try again.</div>';
  }
}

// ── DATA PROCESSING ────────────────────────────────────────────────────
function processSheetData(rows) {
  const shifts = [];
  const weekSummaries = [];
  const biweeklySummaries = [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const date = row[0] || '';
    const day = row[1] || '';

    // Debug log for first few rows
    if (i <= 5) {
      console.log(`Row ${i}:`, { date, day, hours: row[4], pay: row[5] });
    }

    // Detect and extract WEEK SUMMARY rows for charts
    if (day.includes('WEEK SUMM')) {
      const weekData = {
        label: day.replace('WEEK SUMMARY ', '').replace('WEEK SUMM ', ''),
        hours: parseFloat(row[4]) || 0,
        pay: parseFloat(row[5]) || 0,
      };
      console.log('Week summary found:', weekData);
      weekSummaries.push(weekData);
      continue; // Skip to next row
    }

    // Detect BIWEEKLY TOTAL rows
    if (day.includes('BIWEEKLY')) {
      biweeklySummaries.push({
        label: day.replace('BIWEEKLY TOTAL ', ''),
        hours: parseFloat(row[4]) || 0,
        pay: parseFloat(row[5]) || 0,
      });
      continue; // Skip to next row
    }

    // Skip other summary rows
    if (day.includes('Total hours') || day.includes('Pay period')) {
      continue;
    }

    // Only count regular shift rows (must have a date AND be a weekday/Sunday)
    if (date && day && row[4] && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(day)) {
      const hours = parseFloat(row[4]) || 0;
      const pay = parseFloat(row[5]) || 0;

      shifts.push({
        date: date,
        day: day,
        start: row[2] || '',
        end: row[3] || '',
        hours: hours,
        pay: pay,
        isSunday: day.includes('Sun'),
      });
    }
  }

  console.log('Total shifts found:', shifts.length);
  console.log('Week summaries found:', weekSummaries.length);
  console.log('Sample shift:', shifts[0]);

  // Calculate totals
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
  const totalPayFromShifts = shifts.reduce((sum, s) => sum + s.pay, 0);
  const sundayHours = shifts.filter(s => s.isSunday).reduce((sum, s) => sum + s.hours, 0);
  const regularHours = totalHours - sundayHours;
  const sundayPremium = sundayHours * SUNDAY_RATE;
  const regularPay = regularHours * HOURLY_RATE;

  // Use calculated pay if shift pay is 0 (means pay column is empty)
  const totalPay = totalPayFromShifts > 0 ? totalPayFromShifts : (regularPay + sundayPremium);

  // Estimate weeks from date range if no week summaries found
  let weeksWorked = weekSummaries.length;
  if (weeksWorked === 0 && shifts.length > 0) {
    // Estimate from date range
    const dates = shifts.map(s => new Date(s.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
    weeksWorked = Math.max(1, Math.ceil(daysDiff / 7));
  }

  console.log('Calculated totals:', {
    totalHours,
    totalPayFromShifts,
    totalPay,
    sundayHours,
    regularHours,
    sundayPremium,
    regularPay,
    weeksWorked
  });

  return {
    shifts,
    weekSummaries,
    biweeklySummaries,
    totalHours,
    totalPay,
    sundayHours,
    regularHours,
    sundayPremium,
    weeksWorked,
  };
}

// ── GROUP SHIFTS BY WEEK (fallback) ────────────────────────────────────
function groupShiftsByWeek(shifts) {
  const byWeek = {};

  shifts.forEach(shift => {
    const date = new Date(shift.date);
    // Get Monday of the week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0];

    if (!byWeek[weekKey]) {
      byWeek[weekKey] = {
        label: weekKey,
        hours: 0,
        pay: 0,
      };
    }

    byWeek[weekKey].hours += shift.hours;
    byWeek[weekKey].pay += shift.pay || (shift.hours * (shift.isSunday ? SUNDAY_RATE : HOURLY_RATE));
  });

  return Object.values(byWeek).sort((a, b) => a.label.localeCompare(b.label));
}

// ── UPDATE SUMMARY STATS ───────────────────────────────────────────────
function updateSummaryStats(data) {
  document.getElementById('totalHours').textContent = data.totalHours.toFixed(1);
  document.getElementById('totalPay').textContent = '$' + data.totalPay.toFixed(0);

  const avgHoursWeek = data.weeksWorked > 0 ? data.totalHours / data.weeksWorked : 0;
  document.getElementById('avgHoursWeek').textContent = avgHoursWeek.toFixed(1);

  document.getElementById('sundayPremium').textContent = '$' + data.sundayPremium.toFixed(0);

  const sickTime = data.totalHours / 30;
  document.getElementById('sickTime').textContent = sickTime.toFixed(1);

  const raiseProgress = (data.totalHours % 1000) / 1000 * 100;
  document.getElementById('raiseProgress').textContent = raiseProgress.toFixed(1) + '%';
  document.getElementById('raiseProgressBar').style.width = raiseProgress + '%';
  document.getElementById('raiseProgressBar').textContent = raiseProgress.toFixed(1) + '%';
}

// ── CREATE CHARTS ──────────────────────────────────────────────────────

// Get CSS theme colors for charts
function getChartColors() {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    accent: computedStyle.getPropertyValue('--accent').trim(),
    accentHover: computedStyle.getPropertyValue('--accent-hover').trim(),
    text: computedStyle.getPropertyValue('--text').trim(),
    textSecondary: computedStyle.getPropertyValue('--text-secondary').trim(),
    border: computedStyle.getPropertyValue('--border').trim(),
  };
}

function createCharts(data) {
  // Destroy existing charts
  Object.values(chartInstances).forEach(chart => chart.destroy());
  chartInstances = {};

  // Get theme colors
  const colors = getChartColors();

  // Use week summaries if available, otherwise group shifts by week
  let weekData = data.weekSummaries;
  if (weekData.length === 0 && data.shifts.length > 0) {
    // Group shifts by week programmatically
    weekData = groupShiftsByWeek(data.shifts);
    console.log('Created week data from shifts:', weekData);
  }

  // Hours Over Time Chart
  chartInstances.hours = new Chart(document.getElementById('hoursChart'), {
    type: 'line',
    data: {
      labels: weekData.map(w => w.label),
      datasets: [{
        label: 'Hours per Week',
        data: weekData.map(w => w.hours),
        borderColor: colors.accent,
        backgroundColor: colors.accent + '20',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: colors.accent,
        pointBorderColor: colors.accent,
        pointHoverBackgroundColor: colors.accentHover,
        pointHoverBorderColor: colors.accentHover,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.accent,
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: (context) => `${context.parsed.y.toFixed(1)} hours`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: colors.border,
          },
          ticks: {
            color: colors.textSecondary,
            callback: (value) => value + ' hrs'
          }
        },
        x: {
          grid: {
            color: colors.border,
          },
          ticks: {
            color: colors.textSecondary,
          }
        }
      }
    }
  });

  // Pay Over Time Chart
  chartInstances.pay = new Chart(document.getElementById('payChart'), {
    type: 'bar',
    data: {
      labels: weekData.map(w => w.label),
      datasets: [{
        label: 'Pay per Week',
        data: weekData.map(w => w.pay),
        backgroundColor: colors.accent,
        hoverBackgroundColor: colors.accentHover,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.accent,
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: (context) => '$' + context.parsed.y.toFixed(2)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: colors.border,
          },
          ticks: {
            color: colors.textSecondary,
            callback: (value) => '$' + value
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: colors.textSecondary,
          }
        }
      }
    }
  });

  // Sunday vs Regular Hours
  chartInstances.sunday = new Chart(document.getElementById('sundayChart'), {
    type: 'doughnut',
    data: {
      labels: ['Regular Hours', 'Sunday Hours'],
      datasets: [{
        data: [data.regularHours, data.sundayHours],
        backgroundColor: [colors.accent, colors.accentHover],
        borderColor: colors.border,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text,
            padding: 15,
            font: {
              size: 12,
            }
          }
        },
        tooltip: {
          backgroundColor: colors.accent,
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = data.totalHours;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toFixed(1)} hrs (${percentage}%)`;
            }
          }
        }
      }
    }
  });

  // Weekly Breakdown (last 6 weeks)
  const last6Weeks = weekData.slice(-6);
  chartInstances.weekly = new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {
      labels: last6Weeks.map(w => w.label),
      datasets: [
        {
          label: 'Hours',
          data: last6Weeks.map(w => w.hours),
          backgroundColor: colors.accent,
          hoverBackgroundColor: colors.accentHover,
          yAxisID: 'y',
          borderRadius: 6,
        },
        {
          label: 'Pay',
          data: last6Weeks.map(w => w.pay),
          backgroundColor: colors.accentHover,
          hoverBackgroundColor: colors.accent,
          yAxisID: 'y1',
          borderRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: colors.text,
            padding: 15,
            font: {
              size: 12,
            }
          }
        },
        tooltip: {
          backgroundColor: colors.accent,
          titleColor: '#fff',
          bodyColor: '#fff',
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            color: colors.border,
          },
          ticks: {
            color: colors.textSecondary,
            callback: (value) => value + ' hrs'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: colors.textSecondary,
            callback: (value) => '$' + value
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: colors.textSecondary,
          }
        }
      }
    }
  });
}

// Re-create charts when theme changes to update colors
function updateChartColors() {
  const data = window.lastProcessedData;
  if (data) {
    createCharts(data);
  }
}

// ── THEME & LANGUAGE ───────────────────────────────────────────────────
function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon();

  // Update chart colors when theme changes
  updateChartColors();
}

function updateThemeIcon() {
  const icon =
    theme === "light"
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  const btn1 = document.getElementById("themeToggle");
  const btn2 = document.getElementById("themeToggleAuth");
  if (btn1) btn1.innerHTML = icon;
  if (btn2) btn2.innerHTML = icon;
}

function setLang(l) {
  lang = l;
  document.getElementById("btn-es").classList.toggle("active", l === "es");
  document.getElementById("btn-en").classList.toggle("active", l === "en");
  document.getElementById("btn-es-auth").classList.toggle("active", l === "es");
  document.getElementById("btn-en-auth").classList.toggle("active", l === "en");
  applyTranslations();
}

function applyTranslations() {
  const t = T[lang];
  const s = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };

  // Main content
  s("txt-title", t.title);
  s("txt-subtitle", t.subtitle);
  s("txt-back", t.back);
  s("txt-signout", t.signout);

  // Auth section
  s("txt-auth-title", t.authTitle);
  s("txt-auth-desc", t.authDesc);
  s("txt-auth-btn", t.authBtn);

  // Stats cards
  s("txt-total-hours", t.totalHours);
  s("txt-total-earnings", t.totalEarnings);
  s("txt-avg-hours", t.avgHours);
  s("txt-sunday-premium", t.sundayPremium);
  s("txt-sick-time", t.sickTime);
  s("txt-raise-progress", t.raiseProgress);
  s("txt-hours-unit", t.hoursUnit);
  s("txt-hrs-wk-unit", t.hrsWkUnit);
  s("txt-sick-unit", t.sickUnit);

  // Charts
  s("txt-chart-hours", t.chartHours);
  s("txt-chart-earnings", t.chartEarnings);
  s("txt-chart-sunday", t.chartSunday);
  s("txt-chart-weekly", t.chartWeekly);
}

// ── INITIALIZATION ─────────────────────────────────────────────────────
window.onload = function() {
  // Apply theme and language
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon();
  applyTranslations();
  // Check for saved token first
  const savedToken = loadSavedToken();

  if (savedToken) {
    // Token is valid, use it directly
    console.log('Using saved token');
    accessToken = savedToken;
    showStatsContent();
    loadData();
  } else {
    // No valid token, try silent refresh
    console.log('No saved token, attempting silent refresh...');

    // Initialize Google Sign-In
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('authButton'),
      { theme: 'filled_blue', size: 'large', text: 'signin_with' }
    );

    // Try silent token refresh (if user was previously signed in)
    setTimeout(() => {
      requestAccessToken(true); // Silent attempt
    }, 500);
  }

  // Sign out button
  document.getElementById('signOutButton').addEventListener('click', signOut);
};
