const https = require('https');
https.get('https://retrotimeco.in/admin', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /\/_next\/static\/chunks\/[^"']+\.js/g;
    const matches = [...new Set(data.match(regex))];
    let found = 0;
    
    matches.forEach(chunk => {
      https.get('https://retrotimeco.in' + chunk, jsRes => {
        let jsData = '';
        jsRes.on('data', d => jsData += d);
        jsRes.on('end', () => {
          if (jsData.includes('http://localhost:9000/api')) {
            console.log('FOUND localhost in', chunk);
            found++;
          }
          if (jsData.includes('API_BASE')) {
            const idx = jsData.indexOf('API_BASE');
            console.log('API_BASE found in', chunk, 'Context:', jsData.substring(idx - 20, idx + 80));
          }
        });
      });
    });
    
    setTimeout(() => { if(found===0) console.log('No localhost:9000 found in any chunk!') }, 5000);
  });
});
