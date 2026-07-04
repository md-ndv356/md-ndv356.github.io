async function getData (lang){
  const data = await fetch(`https://sg-hk4e-api.hoyoverse.com/event/musicugc/v1/second_page?key=GameHotSongs&is_from_button=false&page=3&page_size=30&lang=${lang.replaceAll("_", "-")}&game_biz=hk4e_global&is_mobile=false&badge_uid=892663327&badge_region=os_asia&sort_by=GET_WORK_LIST_SORT_BY_NEWEST_RELEASE`).then(res => res.json());
  for (const item of data.data.slide.work_list){
    if (item.attr_id < 127) continue;
    const id = `_GMusic${item.attr_id}`;
    if (!Object.hasOwn(musicList, id)) musicList[id] = {
      "album": "NodKrai3",
      "bpm": 0,
      "duration": 0,
      "bpm_min": 0,
      "bpm_max": 0,
      "ja_kana": "",
      "cn_pinyin": "",
      "tw_pinyin": "",
      "sortkey": -5000 + (item.attr_id - 126),
      "score": {
        "n_level": 0,
        "n_notes": 0,
        "h_level": 0,
        "h_notes": 0,
        "p_level": 0,
        "p_notes": 0,
        "l_level": 0,
        "l_notes": 0
      },
      "title": {}
    };
    musicList[id].title[lang] = item.title;
  }
}

(async () => {
  const languageList = ["zh_cn","zh_tw","en_us","ko_kr","ja_jp","es_es","fr_fr","ru_ru","th_th","vi_vn","de_de","id_id","pt_pt","tr_tr","it_it"];
//   const languageList = ["ja_jp"];
  for (const lang of languageList) await getData(lang);
})();