// Configuration (same as main app)
const GOOGLE_CLIENT_ID = "19286324149-5oje1gclta6vpgs88rogvcp33h1pno0r.apps.googleusercontent.com";
const SHEET_ID = "1nozoAVbXK3qoahczhQnOonOE4EQj3OA5vjmUf-5itKY";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
const HOURLY_RATE = 20;
const SUNDAY_RATE = 30;

let accessToken = null;
let chartInstances = {};

// ── GOOGLE AUTH ────────────────────────────────────────────────────────
function handleCredentialResponse(response) {
  const credential = response.credential;
  // Decode JWT to get user info
  const payload = JSON.parse(atob(credential.split('.')[1]));
  console.log('Signed in as:', payload.email);

  // Request access token for Sheets API
  requestAccessToken();
}

function requestAccessToken() {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        console.error('OAuth error:', response);
        showError('Failed to get access token. Please check popup blockers and try again.');
        return;
      }
      if (response.access_token) {
        accessToken = response.access_token;
        showStatsContent();
        loadData();
      }
    },
  });

  try {
    client.requestAccessToken({ prompt: 'consent' });
  } catch (error) {
    console.error('Token request error:', error);
    showError('Please allow popups for this site and try again.');
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
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('statsContent').style.display = 'none';
  google.accounts.id.disableAutoSelect();
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
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const rows = data.values || [];

    // Process data
    const processedData = processSheetData(rows);

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
    if (!row || row.length < 5) continue;

    const day = row[1];

    // Detect summary rows
    if (day && day.includes('WEEK SUMMARY')) {
      weekSummaries.push({
        label: day.replace('WEEK SUMMARY ', ''),
        hours: parseFloat(row[4]) || 0,
        pay: parseFloat(row[5]) || 0,
      });
      continue;
    }

    if (day && day.includes('BIWEEKLY TOTAL')) {
      biweeklySummaries.push({
        label: day.replace('BIWEEKLY TOTAL ', ''),
        hours: parseFloat(row[4]) || 0,
        pay: parseFloat(row[5]) || 0,
      });
      continue;
    }

    // Regular shift row
    if (row[0] && row[4]) {
      shifts.push({
        date: row[0],
        day: row[1],
        start: row[2],
        end: row[3],
        hours: parseFloat(row[4]) || 0,
        pay: parseFloat(row[5]) || 0,
        isSunday: row[1] && row[1].includes('Sun'),
      });
    }
  }

  // Calculate totals
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
  const totalPay = shifts.reduce((sum, s) => sum + s.pay, 0);
  const sundayHours = shifts.filter(s => s.isSunday).reduce((sum, s) => sum + s.hours, 0);
  const regularHours = totalHours - sundayHours;
  const sundayPremium = sundayHours * SUNDAY_RATE;

  return {
    shifts,
    weekSummaries,
    biweeklySummaries,
    totalHours,
    totalPay,
    sundayHours,
    regularHours,
    sundayPremium,
    weeksWorked: weekSummaries.length,
  };
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
function createCharts(data) {
  // Destroy existing charts
  Object.values(chartInstances).forEach(chart => chart.destroy());
  chartInstances = {};

  // Hours Over Time Chart
  chartInstances.hours = new Chart(document.getElementById('hoursChart'), {
    type: 'line',
    data: {
      labels: data.weekSummaries.map(w => w.label),
      datasets: [{
        label: 'Hours per Week',
        data: data.weekSummaries.map(w => w.hours),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y.toFixed(1)} hours`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value + ' hrs'
          }
        }
      }
    }
  });

  // Pay Over Time Chart
  chartInstances.pay = new Chart(document.getElementById('payChart'), {
    type: 'bar',
    data: {
      labels: data.weekSummaries.map(w => w.label),
      datasets: [{
        label: 'Pay per Week',
        data: data.weekSummaries.map(w => w.pay),
        backgroundColor: '#764ba2',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => '$' + context.parsed.y.toFixed(2)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => '$' + value
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
        backgroundColor: ['#667eea', '#ffd93d'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
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
  const last6Weeks = data.weekSummaries.slice(-6);
  chartInstances.weekly = new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {
      labels: last6Weeks.map(w => w.label),
      datasets: [
        {
          label: 'Hours',
          data: last6Weeks.map(w => w.hours),
          backgroundColor: '#667eea',
          yAxisID: 'y',
        },
        {
          label: 'Pay',
          data: last6Weeks.map(w => w.pay),
          backgroundColor: '#764ba2',
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
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
            callback: (value) => '$' + value
          }
        },
      }
    }
  });
}

// ── MANUAL TOKEN ───────────────────────────────────────────────────────
function useManualToken() {
  const token = document.getElementById('manualToken').value.trim();
  if (!token) {
    alert('Por favor pega un access token válido');
    return;
  }

  accessToken = token;
  showStatsContent();
  loadData();
}

// ── INITIALIZATION ─────────────────────────────────────────────────────
window.onload = function() {
  // Initialize Google Sign-In
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById('authButton'),
    { theme: 'filled_blue', size: 'large', text: 'signin_with' }
  );

  // Sign out button
  document.getElementById('signOutButton').addEventListener('click', signOut);

  // Manual token button
  document.getElementById('useManualToken').addEventListener('click', useManualToken);
};
