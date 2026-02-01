const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./genshin-rmm/musictable-v2.json", "utf-8"));
const newcomers = Object.entries(data).slice(84);

for (const song of newcomers){
  const levelData = {
    title: song[1].title,
    country: {  "zh_cn": "",  "zh_tw": "",  "en_us": "",  "ko_kr": "",  "ja_jp": "",  "es_es": "",  "fr_fr": "",  "ru_ru": "",  "th_th": "",  "vi_vn": "",  "de_de": "",  "id_id": "",  "pt_pt": "",  "tr_tr": "",  "it_it": ""},
    album: {  "zh_cn": "",  "zh_tw": "",  "en_us": "",  "ko_kr": "",  "ja_jp": "",  "es_es": "",  "fr_fr": "",  "ru_ru": "",  "th_th": "",  "vi_vn": "",  "de_de": "",  "id_id": "",  "pt_pt": "",  "tr_tr": "",  "it_it": ""},
    link_ytmusic: "",
    duration: song[1].duration,
    bpm: song[1].bpm,
    level: song[1].score.l_level,
    score: [],
    measure: {},
    bpm_act: {}
  };
  fs.writeFileSync("./genshin-rmm/music/" + song[0] + ".3.json", JSON.stringify(levelData, null, "  "), "utf-8");
}