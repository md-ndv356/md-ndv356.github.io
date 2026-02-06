import fs from "fs";
import path from "path";
import { gzipSync } from "zlib";

// Import JSON Data Files
import i18n from "./genshin-rmm/i18n-v2.json" with { type: "json" };
import history from "./genshin-rmm/history.json" with { type: "json" };
import scoreList from "./genshin-rmm/scorelist-v2.json" with { type: "json" };
import albumList from "./genshin-rmm/albumlist.json" with { type: "json" };
import musicTable from "./genshin-rmm/musictable-v2.json" with { type: "json" };
// import levelData from "./genshin-rmm/music/_GMusic1.3.json" with { type: "json" }; // Example

const langcodes = ["zh_cn","zh_tw","en_us","ko_kr","ja_jp","es_es","fr_fr","ru_ru","th_th","vi_vn","de_de","id_id","pt_pt","tr_tr","it_it"];

const promises = fs.promises;
(async () => {
  if (fs.existsSync("./dist") && (await promises.stat("./dist")).isDirectory()){
    await promises.rm("./dist", { recursive: true });
  }
  await promises.mkdir("./dist");

  const sitemap = [];

  fs.cpSync("./bm2dx", "./dist/bm2dx", { recursive: true });
  fs.cpSync("./ndv-tickers", "./dist/ndv-tickers", { recursive: true });
  fs.cpSync("./quakemap-v2", "./dist/quakemap-v2", { recursive: true });
  fs.cpSync("./taiko", "./dist/taiko", { recursive: true });
  fs.cpSync("./library", "./dist/library", { recursive: true });
  fs.cpSync("./index.html", "./dist/index.html");
  fs.cpSync("./googlee229be2cbc95c49b.html", "./dist/googlee229be2cbc95c49b.html");

  sitemap.push({
    loc: "https://md-ndv356.github.io/taiko/battle-no1/",
    lastmod: fs.statSync("./taiko/battle-no1/index.html").mtime
  });
  sitemap.push({
    loc: "https://md-ndv356.github.io/bm2dx/ffmpeg/convert.html",
    lastmod: fs.statSync("./bm2dx/ffmpeg/convert.html").mtime
  });

  // ===== Genshin Impact - Repertoire of Myriad Melodies ======
  fs.cpSync("./genshin-rmm/image/", "./dist/genshin-rmm/image/", { recursive: true });
  fs.cpSync("./genshin-rmm/fonts/", "./dist/genshin-rmm/fonts/", { recursive: true });
  fs.cpSync("./genshin-rmm/common.css", "./dist/genshin-rmm/common.css");
  fs.cpSync("./genshin-rmm/index.html", "./dist/genshin-rmm/index.html");
  fs.cpSync("./genshin-rmm/detail.html", "./dist/genshin-rmm/detail/index.html");

  // Top Page
  const topPageTemplate = await promises.readFile("./genshin-rmm/template/index.html", "utf-8");
  for (const langText of langcodes){
    const pageText = translateTemplate(
      contentReplacement(
      contentReplacement(
      contentReplacement(
      contentReplacement(
      contentReplacement(
        topPageTemplate, "history-content", history.history.sort((a, b) => b.id - a.id).slice(0, 2).map(item => {
          return `<div style="color: #ccc; margin: 14px 4px 6px; font-size: 15px;">${item.postedDate}${langText !== "ja_jp" ? " (yyyy/mm/dd)" : ""}</div><div>${item.content[langText].replace(/\n/g, "<br>")}</div>`;
        }).join("\n")
      ), "alternate-links", langcodes.map(langCode => {
        const link = `https://md-ndv356.github.io/genshin-rmm/${langCode}/`;
        sitemap.push({
          loc: link,
          lastmod: fs.statSync("./genshin-rmm/index.html").mtime
        });
        return `<link rel="alternate" hreflang="${langCode.replace(/_/g, "-")}" href="${link}">`;
      }).join("\n")
      ), "musictable-gzip-b64", encodeBase64GzipUnicode(JSON.stringify(musicTable))
      ), "scorelist-gzip-b64", encodeBase64GzipUnicode(JSON.stringify(scoreList))
      ), "albumlist-gzip-b64", encodeBase64GzipUnicode(JSON.stringify(albumList))
      ), langText
    );
    await promises.mkdir(`./dist/genshin-rmm/${langText}`);
    await promises.writeFile(`./dist/genshin-rmm/${langText}/index.html`, pageText, "utf-8");
  }

  // Score Detail Page
  const difficultyId = ["easy", "normal", "hard", "legend"];
  const langShort = {
    "zh_cn": "CN",
    "zh_tw": "TW",
    "en_us": "EN",
    "ko_kr": "KR",
    "ja_jp": "JP",
    "es_es": "ES",
    "fr_fr": "FR",
    "ru_ru": "RU",
    "th_th": "TH",
    "vi_vn": "VI",
    "de_de": "DE",
    "id_id": "ID",
    "pt_pt": "PT",
    "tr_tr": "TR",
    "it_it": "IT"
  };

  const scoreDetailTemplate = await promises.readFile("./genshin-rmm/template/songdetail/difficulty/index.html", "utf-8");
  for (const musicId in musicTable){
    const langTranslationMap = {};

    for (let i = 0; i < 4; i++){
      if (!scoreList[musicId]?.[i]) continue;
      const levelData = JSON.parse(fs.readFileSync(`./genshin-rmm/music/${musicId}.${i}.json`, "utf-8"));

      for (const langCode of Object.keys(langShort)){
        // To distinguish between JA, ZH-CN, and ZH-TW which may have the same characters but different fonts, we add zero-width spaces.
        const key = levelData.title[langCode] + ("zh_cn" === langCode ? "\u200c" : "") + ("zh_tw" === langCode ? "\u200c\u200c" : "");
        if (!langTranslationMap[key]) langTranslationMap[key] = [];
        langTranslationMap[key].push(langCode);
      }

      for (const langCode of langcodes){
        try {
          const dir = `./dist/genshin-rmm/${langCode}/${musicId}/${difficultyId[i]}/`;
          await promises.mkdir(dir, { recursive: true });

          const bpmList = levelData.bpm_act ? Object.values(levelData.bpm_act) : [];
          const bpm_act = bpmList.length > 1 ? levelData.bpm_act : {};

          const pageText = translateTemplate(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            contentReplacement(
            scoreDetailTemplate, "songid", musicId
            ), "difficulty-index", i + ""
            ), "difficulty-id", difficultyId[i]
            ), "difficulty-text", `{[{level-${i}:str}]}`
            ), "level-stars", "★".repeat(levelData.level)
            ), "bpm", levelData.bpm + ""
            ), "bpm-minmax", (() => {
              if (bpmList.length === 0){
                return "";
              } else if (bpmList.length === 1){
                return "(" + bpmList[0] + ")";
              } else {
                return "(" + Math.min(...bpmList) + "-" + Math.max(...bpmList) + ")";
              }
            })()
            ), "bpm-changes", bpmList.join(" - ")
            ), "bpm-notice-style", bpmList.length > 1 ? `style="display: block;"` : `style="display: none;"`
            ), "duration", Math.floor(levelData.duration / 60) + ":" + ("0" +(levelData.duration % 60)).slice(-2)
            ), "album", levelData.country[langCode] + " - " + levelData.album[langCode]
            ), "songtitle", levelData.title[langCode]
            ), "songtitle-with-link", (() => {
              if (levelData.link_ytmusic){
                return `<a href="https://youtu.be/${levelData.link_ytmusic}" target="_blank" rel="noopener noreferrer">${levelData.title[langCode]}</a>`;
              } else {
                return levelData.title[langCode];
              }
            })()
            ), "songtitle_multilang", (() => {
              const titles = [];
              for (const translationEntry of Object.entries(langTranslationMap)){
                const cached = [...translationEntry[1]];
                if (cached.includes(langCode)){
                  cached.splice(cached.indexOf(langCode), 1);
                }
                if (!cached.length) continue;
                const languages = cached.map(c => "[" + langShort[c] + "]").join("");
                titles.push(`<div><span class="titlesublang">${languages}</span><br><span class="titlesub lang-${translationEntry[1][0]}">${translationEntry[0]}</span></div>`);
              }
              return titles.join("\n");
            })()
            ), "score-gzip-b64", encodeBase64GzipUnicode(JSON.stringify(levelData.score))
            ), "measure-gzip-b64", encodeBase64GzipUnicode(JSON.stringify(levelData.measure ?? null))
            ), "bpm-changes-gzip-b64", encodeBase64GzipUnicode(JSON.stringify(bpm_act))
            ), "alternate-links", langcodes.map(otherLangCode => {
              const link = `https://md-ndv356.github.io/genshin-rmm/${otherLangCode}/${musicId}/${difficultyId[i]}/`;
              sitemap.push({
                loc: link,
                lastmod: fs.statSync(`./genshin-rmm/music/${musicId}.${i}.json`).mtime
              });
              return `<link rel="alternate" hreflang="${otherLangCode.replace(/_/g, "-")}" href="${link}">`;
            }).join("\n")
          ), langCode);
          await promises.writeFile(path.join(dir, "index.html"), pageText, "utf-8");
        } catch (e) {
          console.error(`Error processing music ID ${musicId}, difficulty index ${i}, language code ${langCode}`);
          throw e;
        }
      }
    }
  }

  // about-bpmchange.html
  const aboutBpmChangeTemplate = await promises.readFile("./genshin-rmm/template/about-bpmchange.html", "utf-8");
  for (const langText of langcodes){
    const pageText = translateTemplate(
      contentReplacement(
        aboutBpmChangeTemplate,
        "alternate-links",
        langcodes.map(langCode => {
          const link = `https://md-ndv356.github.io/genshin-rmm/${langCode}/about-bpmchange.html`;
          sitemap.push({
            loc: link,
            lastmod: fs.statSync("./genshin-rmm/template/about-bpmchange.html").mtime
          });
          return `<link rel="alternate" hreflang="${langCode.replace(/_/g, "-")}" href="${link}">`;
        }).join("\n")
      ), langText
    );
    await promises.writeFile(path.join("./dist/genshin-rmm", langText, "about-bpmchange.html"), pageText, "utf-8");
  }

  // Generate sitemap.xml
  const sitemapXmlText = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemap.map(item => {
      return `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod.toISOString()}</lastmod>\n  </url>`;
    }).join("\n") +
    `\n</urlset>`;
  await promises.writeFile("./dist/sitemap.xml", sitemapXmlText, "utf-8");

  const testSitemapXmlText = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemap.slice(0, 20).map(item => {
      return `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod.toISOString()}</lastmod>\n  </url>`;
    }).join("\n") +
    `\n</urlset>`;
  await promises.writeFile("./dist/sitemap2.xml", testSitemapXmlText, "utf-8");

  const robots = `User-agent: *
Allow: /

Sitemap: https://md-ndv356.github.io/sitemap.xml
Sitemap: https://md-ndv356.github.io/sitemap2.xml
`;
  await promises.writeFile("./dist/robots.txt", robots, "utf-8");
})();

/**
 * Translate template strings
 * @param {string} template Template string
 * @param {string} lang Language code (e.g., "en_us")
 * @returns
 */
function translateTemplate(template, lang){
  return template.replace(/\{\[\{(.*?):((?:html)|(?:str))\}\]\}/g, (_, id, type) => {
    const text = i18n[id]?.[lang] ?? `{[{${id}:${type}}]}`;
    if (i18n[id]?.[lang] === void 0) console.warn(`Missing translation for id "${id}" in language "${lang}"`);
    if (type === "html") {
      return text.replace(/\n/g, "<br>")
        .replace(/\u200b/g, "<wbr>")
        .replace(/&/g, "&amp;")
        .replace(/"/g, '&quot;')
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    } else {
      return text.replace(/\n/g, "\\n")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/`/g, "\\`")
        .replace(/\\/g, "\\\\");
    }
  });
}

/**
 * Replace content at given id with given text. (e.g., {{{id}}} → text)
 * @param {string} content
 * @param {string} id
 * @param {string} text
 */
function contentReplacement(content, id, text){
  return content.replaceAll(`{{{${id}}}}`, text);;
}

/**
 * Compress Unicode String to Base64 Gzipped String in Node.js
 * @param {string} unicodeString Unicode String
 * @returns {string} Base64 Gzipped String
 */
function encodeBase64GzipUnicode(unicodeString) {
  // 1. Encode the Unicode string to a Buffer
  const utf8Buffer = Buffer.from(unicodeString, "utf-8");

  // 2. Compress the Buffer using gzip
  const gzippedBuffer = gzipSync(utf8Buffer);

  // 3. Encode the gzipped Buffer to a Base64 string
  const base64GzippedString = gzippedBuffer.toString("base64");

  return base64GzippedString;
}
