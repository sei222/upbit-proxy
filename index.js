const express = require('express');
const app = express();
app.use(express.json());

app.get('/ip', async (req, res) => {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    res.json(d);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.all('/upbit/*', async (req, res) => {
  try {
    const path = req.params[0];
    const query = Object.keys(req.query).length
      ? '?' + new URLSearchParams(req.query) : '';
    const url = 'https://api.upbit.com/v1/' + path + query;
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    const options = { method: req.method, headers };
    if (req.method !== 'GET') options.body = JSON.stringify(req.body);
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
