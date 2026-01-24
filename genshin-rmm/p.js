Object.keys(a).map(item => ["zh_cn", "zh_tw", "en_us", "ko_kr", "ja_jp", "es_es", "fr_fr", "ru_ru", "th_th", "vi_vn", "de_de", "id_id", "pt_pt", "tr_tr", "it_it"].map(lang => `  <url><loc>https://md-ndv356.github.io/genshin-rmm/detail/?${lang}/${item}/3</loc></url>`).join("\n")).join("\n")

all = {};
key = -1000;
(async () => {
  for (const lang of ["zh_cn", "zh_tw", "en_us", "ko_kr", "ja_jp", "es_es", "fr_fr", "ru_ru", "th_th", "vi_vn", "de_de", "id_id", "pt_pt", "tr_tr", "it_it"]){
    const data = await fetch("https://sg-hk4e-api.hoyoverse.com/event/musicugc/v1/second_page?key=Button_Nata2&is_from_button=true&page=1&page_size=30&lang=" + lang.replace("_", "-") + "&game_biz=hk4e_global&is_mobile=false&label_list=" + lang.replace("_", "-")).then(res => res.json());
    const list = data.data.slide.label_group_list[0].label_list;
    for (const item of list){
      if (!(item.unique_key in all)){
        all[item.unique_key] = {
          "region": "Natlan2",
          "bpm": 0,
          "duration": 0,
          "sortkey": (++key),
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
      }
      all[item.unique_key].title[lang] = item.value;
    }
  }
})();