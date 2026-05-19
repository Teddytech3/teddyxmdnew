function checkPassword() {
    const pwd = document.getElementById('password').value;
    if (pwd === 'precious') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        fetchStats();
        setInterval(fetchStats, 10000);
    } else {
        document.getElementById('login-error').innerText = 'Wrong password!';
    }
}
async function fetchStats() {
    const res = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('session-count').innerText = data.sessions;
    document.getElementById('numbers-list').innerHTML = data.numbers.join(', ') || 'None';
    const uptimeSec = data.uptime;
    const hrs = Math.floor(uptimeSec / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    const secs = Math.floor(uptimeSec % 60);
    document.getElementById('uptime').innerText = `${hrs}h ${mins}m ${secs}s`;
}
async function getQR() {
    const number = document.getElementById('qr-number').value;
    if (!number) return alert('Enter number');
    const res = await fetch('/api/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number }) });
    const data = await res.json();
    if (data.error) alert(data.error);
    else document.getElementById('qr-code').innerHTML = `<img src="${data.qr}" alt="QR Code">`;
}
async function getPairCode() {
    const number = document.getElementById('pair-number').value;
    if (!number) return alert('Enter number');
    const res = await fetch('/api/pair', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number }) });
    const data = await res.json();
    if (data.error) alert(data.error);
    else document.getElementById('pair-result').innerHTML = `<strong>Pairing Code:</strong> ${data.code}`;
}