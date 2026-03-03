/**
 * Push URLs to Baidu & Bing Webmaster
 * Run: node scripts/push-urls.js <urls-comma-separated>
 */
const https = require('https');

const baiduToken = process.env.BAIDU_PUSH_TOKEN;
const bingToken = process.env.BING_PUSH_TOKEN;
const siteUrl = 'https://liuhedev.github.io';

const urls = process.argv[2] ? process.argv[2].split(',') : [];

if (!urls.length) {
  console.error('Please provide URLs to push. Example: node push-urls.js https://liuhedev.github.io/posts/xxx');
  process.exit(1);
}

const urlData = urls.join('\n');

// 百度普通收录推送
if (baiduToken) {
  const req = https.request({
    hostname: 'data.zz.baidu.com',
    port: 443,
    path: `/urls?site=${siteUrl}&token=${baiduToken}`,
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(urlData)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log(`[Baidu] Status: ${res.statusCode}, Response: ${data}`);
    });
  });

  req.on('error', (e) => {
    console.error(`[Baidu] Error: ${e.message}`);
  });

  req.write(urlData);
  req.end();
} else {
  console.log('[Baidu] BAIDU_PUSH_TOKEN not found, skipping.');
}

// Bing Indexing API
if (bingToken) {
  const bingData = JSON.stringify({
    siteUrl: siteUrl,
    urlList: urls
  });

  const req = https.request({
    hostname: 'ssl.bing.com',
    port: 443,
    path: `/webmaster/api.svc/json/SubmitUrlbatch?apikey=${bingToken}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bingData)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log(`[Bing] Status: ${res.statusCode}, Response: ${data}`);
    });
  });

  req.on('error', (e) => {
    console.error(`[Bing] Error: ${e.message}`);
  });

  req.write(bingData);
  req.end();
} else {
  console.log('[Bing] BING_PUSH_TOKEN not found, skipping.');
}
