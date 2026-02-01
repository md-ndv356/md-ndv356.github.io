import fs from 'fs';

const languages = ['zh-cn', 'zh-tw', 'en-us', 'ko-kr', 'ja-jp', 'es-es', 'fr-fr', 'ru-ru', 'th-th', 'de-de', 'tr-tr', 'it-it'];
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: node info.js <Info ID>');
  process.exit(1);
}

for (const item of languages){
  const url = `https://sg-public-api-static.hoyoverse.com/content_v2_user/app/a1b1f9d3315447cc/getContent?iAppId=32&iInfoId=${args[0]}&sLangKey=${item}&iAround=0`;
  const data = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15',
      'Origin': 'https://genshin.hoyoverse.com',
      'Referer': 'https://genshin.hoyoverse.com/',
    },
  }).then(res => res.json());

  if (data.retcode !== 0) continue;
  // console.log(data);
  const title = data.data.sTitle;
  console.log(`${item}: ${title}`);
}
