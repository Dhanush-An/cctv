const dns = require('dns');

const hostname = '_mongodb._tcp.cluster0.j4aoj4o.mongodb.net';

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS SRV resolution failed:', err);
        console.log('\nTip: Your current DNS server might not support SRV records required for MongoDB Atlas.');
        console.log('Try changing your DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1).');
    } else {
        console.log('DNS SRV resolution successful:', addresses);
    }
});
