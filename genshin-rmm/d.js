import fs from "fs";

const data = JSON.parse(fs.readFileSync("./musictable-v2.json", "utf-8"));
const newcomers = Object.entries(data).slice(102);

for (const song of newcomers){
  console.log(song[1].title.ja_jp);
  // continue;

  const levelData = {
    title: {
      "zh_cn": song[1].title["zh_cn"] || "",
      "zh_tw": song[1].title["zh_tw"] || "",
      "en_us": song[1].title["en_us"] || "",
      "ko_kr": song[1].title["ko_kr"] || "",
      "ja_jp": song[1].title["ja_jp"] || "",
      "es_es": song[1].title["es_es"] || "",
      "fr_fr": song[1].title["fr_fr"] || "",
      "ru_ru": song[1].title["ru_ru"] || "",
      "th_th": song[1].title["th_th"] || "",
      "vi_vn": song[1].title["vi_vn"] || "",
      "de_de": song[1].title["de_de"] || "",
      "id_id": song[1].title["id_id"] || "",
      "pt_pt": song[1].title["pt_pt"] || "",
      "tr_tr": song[1].title["tr_tr"] || "",
      "it_it": song[1].title["it_it"] || ""
    },
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
  fs.writeFileSync("./music/" + song[0] + ".3.json", JSON.stringify(levelData, null, "  "), "utf-8");
}