const http = require('http');
const loginData = JSON.stringify({ username: 'admin@businessflow.cl', password: 'demo123' });
const loginOptions = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  },
};

const loginReq = http.request(loginOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('LOGIN_STATUS', res.statusCode);
    console.log('LOGIN_BODY', body);
    if (res.statusCode === 200) {
      const token = JSON.parse(body).token;
      const custOptions = {
        hostname: 'localhost',
        port: 8090,
        path: '/api/customers',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const custReq = http.request(custOptions, (custRes) => {
        let custBody = '';
        custRes.on('data', (chunk) => (custBody += chunk));
        custRes.on('end', () => {
          console.log('CUSTOMERS_STATUS', custRes.statusCode);
          console.log('CUSTOMERS_BODY', custBody);
        });
      });
      custReq.on('error', (e) => console.error('CUSTOMERS_ERROR', e));
      custReq.end();
    }
  });
});

loginReq.on('error', (e) => console.error('LOGIN_ERROR', e));
loginReq.write(loginData);
loginReq.end();
