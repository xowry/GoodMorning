const http = require('http');
const https = require('https');

const ICS_URL = 'https://0380092u.index-education.net/pronote/ical/Edt_bugnonalexandre.ics?icalsecurise=1D398D4CD7EFE72BE078FCC71D5577FF6BC5AE899764C90D694E28A6E2065EF843B13A6D102CA3BE7BB71C78D394B481&version=2026.2.5.7&param=C96F40C77C638122BE110F0A28794C7A';

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
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Proxy ICS actif sur port ${PORT}`));
