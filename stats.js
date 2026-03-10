// Configuration (same as main app)
const GOOGLE_CLIENT_ID = "19286324149-5oje1gclta6vpgs88rogvcp33h1pno0r.apps.googleusercontent.com";
const SHEET_ID = "1nozoAVbXK3qoahczhQnOonOE4EQj3OA5vjmUf-5itKY";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
const HOURLY_RATE = 20;
const SUNDAY_RATE = 30;

let accessToken = null;
let chartInstances = {};

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
function createCharts(data) {
  // Destroy existing charts
  Object.values(chartInstances).forEach(chart => chart.destroy());
  chartInstances = {};

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
      labels: weekData.map(w => w.label),
      datasets: [{
        label: 'Pay per Week',
        data: weekData.map(w => w.pay),
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
  const last6Weeks = weekData.slice(-6);
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

// ── INITIALIZATION ─────────────────────────────────────────────────────
window.onload = function() {
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
