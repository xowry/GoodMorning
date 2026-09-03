const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ICS_URL = 'https://0380092u.index-education.net/pronote/ical/Edt_bugnonalexandre.ics?icalsecurise=1D398D4CD7EFE72BE078FCC71D5577FF6BC5AE899764C90D694E28A6E2065EF843B13A6D102CA3BE7BB71C78D394B481&version=2026.2.5.7&param=C96F40C77C638122BE110F0A28794C7A';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/ics') {
    https.get(ICS_URL, (r) => {
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      r.pipe(res);
    }).on('error', (e) => {
      res.writeHead(500);
      res.end(e.message);
    });
    return;
  }

  // Servir les fichiers statiques
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.writeHead(200);
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur actif sur port ${PORT}`));
