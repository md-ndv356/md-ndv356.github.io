const countries = ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"];
const album = {}
for (const item of countries) album[item] = {};
const languages = ["zh_cn","zh_tw","en_us","ko_kr","ja_jp","es_es","fr_fr","ru_ru","th_th","vi_vn","de_de","id_id","pt_pt","tr_tr","it_it"];
(async () => {
  for (const lang of languages){
    const data = await fetch("https://sg-hk4e-api.hoyoverse.com/event/musicugc/v2/index?lang=" + lang.replaceAll("_", "-") + "&game_biz=hk4e_global&is_mobile=false").then(res => res.json())
    const label = data.data.slide[0].video_slide.small_tab[0].label_list
    for (const idx in label){
      album[countries[idx]][lang] = label[idx].value;
    }
  }
})()