// ============================================================================
// 游戏数据库 — 50款热门游戏（手动维护 + 后续爬虫自动化）
// ============================================================================

var GAME_DATA = [
    // ═══ 2026 已发售 ═══
    { id:"g001", name:"艾尔登法环：黄金树之影", type:"dlc", genres:["动作冒险","RPG"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-01-21"},{region:"CN",date:"2026-01-21"}],
      expectScore:95, popularity:98, rating:"teen", cover:"🏰", desc:"FromSoftware年度DLC" },
    { id:"g002", name:"最终幻想7 重生", type:"release", genres:["RPG"], platforms:["PS5","PC"],
      releases:[{region:"GLOBAL",date:"2026-02-29"},{region:"CN",date:"2026-03-01"}],
      expectScore:93, popularity:95, rating:"teen", cover:"⚔️", desc:"FF7重制第二部" },
    { id:"g003", name:"怪物猎人：荒野", type:"release", genres:["动作冒险","RPG"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-03-15"},{region:"CN",date:"2026-03-15"}],
      expectScore:91, popularity:96, rating:"teen", cover:"🐉", desc:"开放世界狩猎" },
    { id:"g004", name:"空洞骑士：丝之歌", type:"release", genres:["动作冒险","独立游戏"], platforms:["PC","Switch","PS5"],
      releases:[{region:"GLOBAL",date:"2026-04-10"},{region:"CN",date:"2026-04-10"}],
      expectScore:94, popularity:97, rating:"all", cover:"🪲", desc:"等待多年的续作" },
    { id:"g005", name:"GTA6", type:"release", genres:["动作冒险","FPS/射击"], platforms:["PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-05-20"},{region:"CN",date:"2026-05-20"}],
      expectScore:99, popularity:100, rating:"mature", cover:"🚗", desc:"十年之作" },
    { id:"g006", name:"文明7", type:"release", genres:["策略"], platforms:["PC","PS5","Xbox","Switch"],
      releases:[{region:"GLOBAL",date:"2026-06-15"},{region:"CN",date:"2026-06-15"}],
      expectScore:90, popularity:88, rating:"all", cover:"🏛️", desc:"再来一回合" },
    { id:"g007", name:"黑神话：悟空 DLC", type:"dlc", genres:["动作冒险"], platforms:["PC","PS5"],
      releases:[{region:"CN",date:"2026-07-01"},{region:"GLOBAL",date:"2026-07-01"}],
      expectScore:92, popularity:94, rating:"teen", cover:"🐵", desc:"国产之光DLC" },

    // ═══ 2026 待发售 ═══
    { id:"g008", name:"上古卷轴6", type:"release", genres:["RPG"], platforms:["PC","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-08-20"}],
      expectScore:97, popularity:99, rating:"mature", cover:"🐉", desc:"传奇回归" },
    { id:"g009", name:"赛博朋克2077：猎户座", type:"release", genres:["RPG","FPS/射击"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-09-10"},{region:"CN",date:"2026-09-10"}],
      expectScore:90, popularity:92, rating:"mature", cover:"🤖", desc:"CDPR新篇章" },
    { id:"g010", name:"塞尔达传说：王国之泪2", type:"release", genres:["动作冒险"], platforms:["Switch"],
      releases:[{region:"GLOBAL",date:"2026-10-15"},{region:"JP",date:"2026-10-14"}],
      expectScore:96, popularity:98, rating:"all", cover:"🗡️", desc:"海拉鲁再临" },
    { id:"g011", name:"守望先锋3", type:"release", genres:["FPS/射击","MMO"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-11-05"},{region:"CN",date:"2026-11-06"}],
      expectScore:82, popularity:85, rating:"teen", cover:"🎯", desc:"英雄射击进化" },
    { id:"g012", name:"死亡搁浅2", type:"release", genres:["动作冒险"], platforms:["PS5","PC"],
      releases:[{region:"GLOBAL",date:"2026-12-01"},{region:"CN",date:"2026-12-02"}],
      expectScore:88, popularity:80, rating:"mature", cover:"📦", desc:"小岛秀夫新作" },

    // ═══ 网游更新 ═══
    { id:"g013", name:"原神 6.0版本", type:"update", genres:["RPG","MMO"], platforms:["PC","PS5","手机"],
      releases:[{region:"CN",date:"2026-03-15"},{region:"GLOBAL",date:"2026-03-15"}],
      expectScore:0, popularity:95, rating:"teen", cover:"✨", desc:"新区域·纳塔" },
    { id:"g014", name:"英雄联盟 S16赛季", type:"update", genres:["MMO","策略"], platforms:["PC"],
      releases:[{region:"GLOBAL",date:"2026-01-10"},{region:"CN",date:"2026-01-10"}],
      expectScore:0, popularity:90, rating:"teen", cover:"⚡", desc:"新赛季开启" },
    { id:"g015", name:"魔兽世界：至暗之夜", type:"update", genres:["MMO","RPG"], platforms:["PC"],
      releases:[{region:"GLOBAL",date:"2026-04-22"},{region:"CN",date:"2026-04-23"}],
      expectScore:0, popularity:88, rating:"teen", cover:"🌙", desc:"11.1大型更新" },
    { id:"g016", name:"崩坏：星穹铁道 4.0", type:"update", genres:["RPG","MMO"], platforms:["PC","手机"],
      releases:[{region:"CN",date:"2026-05-10"},{region:"GLOBAL",date:"2026-05-10"}],
      expectScore:0, popularity:92, rating:"teen", cover:"🚂", desc:"新星球" },
    { id:"g017", name:"王者荣耀 S40赛季", type:"update", genres:["MMO","策略"], platforms:["手机"],
      releases:[{region:"CN",date:"2026-02-20"}],
      expectScore:0, popularity:96, rating:"teen", cover:"👑", desc:"新赛季" },
    { id:"g018", name:"Apex英雄 第26赛季", type:"update", genres:["FPS/射击","MMO"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-03-01"},{region:"CN",date:"2026-03-01"}],
      expectScore:0, popularity:82, rating:"teen", cover:"🔫", desc:"新传奇" },
    { id:"g019", name:"Valorant 第12幕", type:"update", genres:["FPS/射击"], platforms:["PC"],
      releases:[{region:"GLOBAL",date:"2026-04-05"},{region:"CN",date:"2026-04-05"}],
      expectScore:0, popularity:85, rating:"teen", cover:"💣", desc:"新特工" },
    { id:"g020", name:"暗黑破坏神4：憎恨之躯", type:"dlc", genres:["RPG"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-06-30"},{region:"CN",date:"2026-07-01"}],
      expectScore:87, popularity:86, rating:"mature", cover:"😈", desc:"墨菲斯托归来" },

    // ═══ 独立游戏 ═══
    { id:"g021", name:"哈迪斯2", type:"release", genres:["动作冒险","独立游戏"], platforms:["PC","Switch"],
      releases:[{region:"GLOBAL",date:"2026-03-20"},{region:"CN",date:"2026-03-20"}],
      expectScore:92, popularity:89, rating:"teen", cover:"🔥", desc:"Supergiant续作" },
    { id:"g022", name:"星露谷物语2", type:"release", genres:["模拟经营","独立游戏"], platforms:["PC","Switch"],
      releases:[{region:"GLOBAL",date:"2026-07-15"},{region:"CN",date:"2026-07-15"}],
      expectScore:89, popularity:87, rating:"all", cover:"🌾", desc:"种田续作（PC/Switch首发）" },
    { id:"g023", name:"潜水员戴夫2", type:"release", genres:["模拟经营","独立游戏"], platforms:["PC","Switch"],
      releases:[{region:"GLOBAL",date:"2026-08-01"},{region:"CN",date:"2026-08-01"}],
      expectScore:85, popularity:78, rating:"all", cover:"🐟", desc:"海底冒险续作" },

    // ═══ 体育竞速 ═══
    { id:"g024", name:"FIFA 27", type:"release", genres:["体育竞速"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-09-25"},{region:"CN",date:"2026-09-26"}],
      expectScore:78, popularity:84, rating:"all", cover:"⚽", desc:"年度足球" },
    { id:"g025", name:"极限竞速：地平线6", type:"release", genres:["体育竞速"], platforms:["PC","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-10-20"},{region:"CN",date:"2026-10-20"}],
      expectScore:90, popularity:86, rating:"all", cover:"🏎️", desc:"日本赛道" },

    // ═══ 恐怖生存 ═══
    { id:"g026", name:"生化危机9", type:"release", genres:["恐怖生存"], platforms:["PC","PS5","Xbox"],
      releases:[{region:"GLOBAL",date:"2026-11-15"},{region:"CN",date:"2026-11-16"}],
      expectScore:88, popularity:90, rating:"mature", cover:"🧟", desc:"克里斯归来" },
    { id:"g027", name:"寂静岭2 Remake", type:"release", genres:["恐怖生存"], platforms:["PC","PS5"],
      releases:[{region:"GLOBAL",date:"2026-05-30"},{region:"CN",date:"2026-06-01"}],
      expectScore:91, popularity:88, rating:"mature", cover:"🌫️", desc:"经典重制" },
];

// ── 问卷类型标签 ──
var GENRE_TAGS = [
    { id:"action", name:"动作冒险", icon:"⚔️" },
    { id:"rpg", name:"RPG", icon:"🛡️" },
    { id:"fps", name:"FPS/射击", icon:"🔫" },
    { id:"strategy", name:"策略", icon:"♟️" },
    { id:"sim", name:"模拟经营", icon:"🏗️" },
    { id:"sports", name:"体育竞速", icon:"⚽" },
    { id:"horror", name:"恐怖生存", icon:"👻" },
    { id:"indie", name:"独立游戏", icon:"🎨" },
    { id:"mmo", name:"MMO/网游", icon:"🌐" },
    { id:"social", name:"休闲社交", icon:"🎉" },
];

var PLATFORM_TAGS = [
    { id:"pc", name:"PC", icon:"🖥️" },
    { id:"ps5", name:"PS5", icon:"🎮" },
    { id:"xbox", name:"Xbox", icon:"🎯" },
    { id:"switch", name:"Switch", icon:"🕹️" },
    { id:"mobile", name:"手机", icon:"📱" },
];

var REGIONS = [
    { id:"CN", name:"中国大陆" },
    { id:"GLOBAL", name:"全球/美国" },
    { id:"JP", name:"日本" },
    { id:"EU", name:"欧洲" },
    { id:"KR", name:"韩国" },
];

// ═══ 更多游戏填充 ═══
(function() {
    var more = [
    { id:"g100", name:"对马岛之魂2", type:"release", genres:["动作冒险"], platforms:["PS5"], releases:[{region:"GLOBAL",date:"2026-03-01"},{region:"CN",date:"2026-03-01"}], expectScore:92, popularity:90, rating:"mature", cover:"🏯", desc:"武士续作" },
    { id:"g101", name:"龙之信条2：黑暗觉醒", type:"dlc", genres:["RPG","动作冒险"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-04-10"},{region:"CN",date:"2026-04-10"}], expectScore:85, popularity:82, rating:"mature", cover:"🐲", desc:"大型资料片" },
    { id:"g102", name:"星际公民 正式版", type:"release", genres:["FPS/射击","MMO"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-06-15"},{region:"CN",date:"2026-06-15"}], expectScore:88, popularity:85, rating:"teen", cover:"🚀", desc:"世纪众筹终结" },
    { id:"g103", name:"方舟2", type:"release", genres:["动作冒险","MMO"], platforms:["PC","Xbox"], releases:[{region:"GLOBAL",date:"2026-05-10"},{region:"CN",date:"2026-05-10"}], expectScore:80, popularity:78, rating:"teen", cover:"🦖", desc:"范·迪塞尔主演" },
    { id:"g104", name:"吸血鬼：避世血族2", type:"release", genres:["RPG","恐怖生存"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-02-20"},{region:"CN",date:"2026-02-20"}], expectScore:82, popularity:72, rating:"mature", cover:"🩸", desc:"黑暗世界续作" },
    { id:"g105", name:"战争机器6", type:"release", genres:["FPS/射击"], platforms:["PC","Xbox"], releases:[{region:"GLOBAL",date:"2026-09-10"},{region:"CN",date:"2026-09-11"}], expectScore:88, popularity:86, rating:"mature", cover:"⚙️", desc:"Xbox旗舰" },
    { id:"g106", name:"波斯王子：时之砂 Remake", type:"release", genres:["动作冒险"], platforms:["PC","PS5","Xbox","Switch"], releases:[{region:"GLOBAL",date:"2026-01-15"},{region:"CN",date:"2026-01-16"}], expectScore:78, popularity:75, rating:"teen", cover:"⏳", desc:"经典重制" },
    { id:"g107", name:"女神异闻录6", type:"release", genres:["RPG"], platforms:["PS5","PC"], releases:[{region:"JP",date:"2026-08-01"},{region:"GLOBAL",date:"2026-08-05"},{region:"CN",date:"2026-08-06"}], expectScore:94, popularity:92, rating:"teen", cover:"🎭", desc:"P系列新作" },
    { id:"g108", name:"鬼灭之刃：火之神血风谭2", type:"release", genres:["动作冒险"], platforms:["PC","PS5","Xbox","Switch"], releases:[{region:"JP",date:"2026-07-20"},{region:"GLOBAL",date:"2026-07-25"},{region:"CN",date:"2026-07-26"}], expectScore:82, popularity:84, rating:"teen", cover:"👺", desc:"动画格斗续作" },
    { id:"g109", name:"永劫无间 主机版", type:"release", genres:["动作冒险","MMO"], platforms:["PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-04-20"},{region:"CN",date:"2026-04-20"}], expectScore:80, popularity:76, rating:"teen", cover:"⚔️", desc:"国产吃鸡主机版" },
    { id:"g110", name:"幻兽帕鲁 大型更新", type:"update", genres:["动作冒险","MMO"], platforms:["PC","Xbox"], releases:[{region:"GLOBAL",date:"2026-03-10"},{region:"CN",date:"2026-03-10"}], expectScore:0, popularity:88, rating:"teen", cover:"🐑", desc:"PvP竞技场" },
    { id:"g111", name:"CS2 大行动", type:"update", genres:["FPS/射击"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-02-01"},{region:"CN",date:"2026-02-01"}], expectScore:0, popularity:92, rating:"mature", cover:"🔫", desc:"新武器箱+地图" },
    { id:"g112", name:"DOTA2 10周年活动", type:"update", genres:["MMO","策略"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-05-15"},{region:"CN",date:"2026-05-15"}], expectScore:0, popularity:89, rating:"teen", cover:"🗡️", desc:"周年庆典" },
    { id:"g113", name:"英雄联盟 斗魂竞技场", type:"update", genres:["MMO","策略"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-06-10"},{region:"CN",date:"2026-06-10"}], expectScore:0, popularity:91, rating:"teen", cover:"🏟️", desc:"2v2模式" },
    { id:"g114", name:"炉石传说 新扩展包", type:"update", genres:["策略"], platforms:["PC","手机"], releases:[{region:"GLOBAL",date:"2026-04-08"},{region:"CN",date:"2026-04-08"}], expectScore:0, popularity:83, rating:"all", cover:"🃏", desc:"最新扩展" },
    { id:"g115", name:"绝地求生 2.0", type:"update", genres:["FPS/射击","MMO"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-08-10"},{region:"CN",date:"2026-08-10"}], expectScore:0, popularity:82, rating:"teen", cover:"🎖️", desc:"大版本更新" },
    { id:"g116", name:"命运2：最终形态", type:"dlc", genres:["FPS/射击","MMO"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-03-25"},{region:"CN",date:"2026-03-26"}], expectScore:86, popularity:80, rating:"teen", cover:"🌌", desc:"光与暗终章" },
    { id:"g117", name:"赛马娘 国际版", type:"release", genres:["模拟经营","体育竞速"], platforms:["PC","手机"], releases:[{region:"GLOBAL",date:"2026-05-25"},{region:"CN",date:"2026-05-25"}], expectScore:80, popularity:78, rating:"all", cover:"🐴", desc:"日服火爆手游" },
    { id:"g118", name:"明日方舟：终末地", type:"release", genres:["RPG","策略"], platforms:["PC","手机"], releases:[{region:"CN",date:"2026-07-10"},{region:"GLOBAL",date:"2026-07-15"}], expectScore:88, popularity:86, rating:"teen", cover:"🔬", desc:"鹰角开放世界" },
    { id:"g119", name:"三角洲行动 主机版", type:"release", genres:["FPS/射击"], platforms:["PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-09-01"},{region:"CN",date:"2026-09-01"}], expectScore:80, popularity:75, rating:"teen", cover:"🎖️", desc:"腾讯战术射击" },
    { id:"g120", name:"燕云十六声", type:"release", genres:["动作冒险","RPG"], platforms:["PC","PS5","手机"], releases:[{region:"CN",date:"2026-03-20"},{region:"GLOBAL",date:"2026-04-01"}], expectScore:85, popularity:84, rating:"teen", cover:"🏯", desc:"网易武侠开放世界" },
    { id:"g121", name:"无限暖暖", type:"release", genres:["模拟经营","休闲社交"], platforms:["PC","PS5","手机"], releases:[{region:"CN",date:"2026-02-01"},{region:"GLOBAL",date:"2026-02-10"}], expectScore:78, popularity:75, rating:"all", cover:"👗", desc:"叠纸开放世界" },
    { id:"g122", name:"异人之下", type:"release", genres:["动作冒险","RPG"], platforms:["PC","手机"], releases:[{region:"CN",date:"2026-04-25"},{region:"GLOBAL",date:"2026-05-01"}], expectScore:82, popularity:79, rating:"teen", cover:"⚡", desc:"一人之下世界观" },
    { id:"g123", name:"FF14 8.0", type:"update", genres:["MMO","RPG"], platforms:["PC","PS5"], releases:[{region:"GLOBAL",date:"2026-06-20"},{region:"CN",date:"2026-06-21"}], expectScore:0, popularity:87, rating:"teen", cover:"🌍", desc:"新资料片" },
    { id:"g124", name:"Genshin 6.1", type:"update", genres:["RPG","MMO"], platforms:["PC","PS5","手机"], releases:[{region:"CN",date:"2026-05-01"},{region:"GLOBAL",date:"2026-05-01"}], expectScore:0, popularity:94, rating:"teen", cover:"🌊", desc:"新角色+新地图" },
    { id:"g125", name:"博德之门3 终极版", type:"dlc", genres:["RPG","策略"], platforms:["PC","PS5"], releases:[{region:"GLOBAL",date:"2026-08-20"},{region:"CN",date:"2026-08-21"}], expectScore:95, popularity:88, rating:"mature", cover:"🐉", desc:"拉瑞安终极版" },
    { id:"g126", name:"彩虹六号 围攻2", type:"release", genres:["FPS/射击","策略"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-10-10"},{region:"CN",date:"2026-10-11"}], expectScore:84, popularity:82, rating:"mature", cover:"🎯", desc:"战术射击续作" },
    { id:"g127", name:"庄园领主 正式版", type:"release", genres:["模拟经营","策略"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-04-15"},{region:"CN",date:"2026-04-15"}], expectScore:85, popularity:80, rating:"all", cover:"🏰", desc:"中世纪建造" },
    { id:"g128", name:"潜水员戴夫 DLC: 深海", type:"dlc", genres:["模拟经营","独立游戏"], platforms:["PC","Switch"], releases:[{region:"GLOBAL",date:"2026-01-25"},{region:"CN",date:"2026-01-25"}], expectScore:82, popularity:72, rating:"all", cover:"🐠", desc:"新海域探索" },
    { id:"g129", name:"星际战甲 1999", type:"update", genres:["FPS/射击","MMO"], platforms:["PC","PS5","Xbox","Switch"], releases:[{region:"GLOBAL",date:"2026-03-20"},{region:"CN",date:"2026-03-21"}], expectScore:0, popularity:80, rating:"teen", cover:"🤖", desc:"大型叙事更新" },
    { id:"g130", name:"霍格沃茨之遗2", type:"release", genres:["RPG","动作冒险"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-11-20"},{region:"CN",date:"2026-11-21"}], expectScore:88, popularity:89, rating:"teen", cover:"🧙", desc:"魔法世界续作" },
    { id:"g131", name:"战神：诸神黄昏 PC版", type:"release", genres:["动作冒险"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-01-10"},{region:"CN",date:"2026-01-11"}], expectScore:94, popularity:91, rating:"mature", cover:"🪓", desc:"PC移植" },
    { id:"g132", name:"暗喻幻想2", type:"release", genres:["RPG"], platforms:["PC","PS5","Xbox"], releases:[{region:"JP",date:"2026-09-20"},{region:"GLOBAL",date:"2026-09-25"},{region:"CN",date:"2026-09-26"}], expectScore:90, popularity:85, rating:"teen", cover:"📖", desc:"Atlus新RPG续作" },
    { id:"g133", name:"泰坦陨落3", type:"release", genres:["FPS/射击"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-12-05"},{region:"CN",date:"2026-12-06"}], expectScore:93, popularity:88, rating:"mature", cover:"🤖", desc:"Respawn回归" },
    { id:"g134", name:"帝国时代4 DLC", type:"dlc", genres:["策略"], platforms:["PC"], releases:[{region:"GLOBAL",date:"2026-02-15"},{region:"CN",date:"2026-02-15"}], expectScore:82, popularity:76, rating:"all", cover:"🏹", desc:"新文明" },
    { id:"g135", name:"崩坏3 第二部", type:"release", genres:["RPG","动作冒险"], platforms:["PC","手机"], releases:[{region:"CN",date:"2026-06-01"},{region:"GLOBAL",date:"2026-06-05"}], expectScore:84, popularity:81, rating:"teen", cover:"🌠", desc:"米哈游旗舰重生" },
    { id:"g136", name:"幻塔 4.0", type:"update", genres:["MMO","RPG"], platforms:["PC","PS5","手机"], releases:[{region:"CN",date:"2026-04-12"},{region:"GLOBAL",date:"2026-04-12"}], expectScore:0, popularity:75, rating:"teen", cover:"🗼", desc:"新区域开放" },
    { id:"g137", name:"动物派对 正式版", type:"release", genres:["休闲社交"], platforms:["PC","Xbox"], releases:[{region:"GLOBAL",date:"2026-01-20"},{region:"CN",date:"2026-01-20"}], expectScore:78, popularity:77, rating:"all", cover:"🐶", desc:"派对乱斗" },
    { id:"g138", name:"空洞骑士：丝之歌 DLC", type:"dlc", genres:["动作冒险","独立游戏"], platforms:["PC","Switch","PS5"], releases:[{region:"GLOBAL",date:"2026-08-10"},{region:"CN",date:"2026-08-10"}], expectScore:90, popularity:85, rating:"all", cover:"🎻", desc:"新增Boss Rush" },
    { id:"g139", name:"鸣潮 2.0", type:"update", genres:["动作冒险","RPG"], platforms:["PC","手机"], releases:[{region:"CN",date:"2026-05-20"},{region:"GLOBAL",date:"2026-05-20"}], expectScore:0, popularity:78, rating:"teen", cover:"🌊", desc:"大版本更新" },
    { id:"g140", name:"绝区零 2.0", type:"update", genres:["动作冒险","RPG"], platforms:["PC","PS5","手机"], releases:[{region:"CN",date:"2026-07-01"},{region:"GLOBAL",date:"2026-07-01"}], expectScore:0, popularity:85, rating:"teen", cover:"🎸", desc:"新阵营+城市" },
    { id:"g141", name:"仙剑奇侠传8", type:"release", genres:["RPG"], platforms:["PC","PS5"], releases:[{region:"CN",date:"2026-08-15"},{region:"GLOBAL",date:"2026-08-20"}], expectScore:85, popularity:83, rating:"teen", cover:"🗡️", desc:"国产RPG旗舰" },
    { id:"g142", name:"三国志15", type:"release", genres:["策略"], platforms:["PC","PS5","Switch"], releases:[{region:"CN",date:"2026-11-01"},{region:"JP",date:"2026-10-28"},{region:"GLOBAL",date:"2026-11-01"}], expectScore:84, popularity:80, rating:"all", cover:"🏯", desc:"光荣策略新作" },
    { id:"g143", name:"崩坏：星穹铁道 动画联动", type:"update", genres:["RPG"], platforms:["PC","手机"], releases:[{region:"CN",date:"2026-06-25"},{region:"GLOBAL",date:"2026-06-25"}], expectScore:0, popularity:86, rating:"teen", cover:"🎬", desc:"Fate联动" },
    { id:"g144", name:"极限竞速8", type:"release", genres:["体育竞速"], platforms:["PC","Xbox"], releases:[{region:"GLOBAL",date:"2026-10-05"},{region:"CN",date:"2026-10-06"}], expectScore:87, popularity:77, rating:"all", cover:"🏎️", desc:"次世代竞速" },
    { id:"g145", name:"街霸6 终极版", type:"dlc", genres:["动作冒险"], platforms:["PC","PS5","Xbox"], releases:[{region:"GLOBAL",date:"2026-03-30"},{region:"CN",date:"2026-03-30"}], expectScore:86, popularity:79, rating:"teen", cover:"🥊", desc:"全角色合集" },
    ];
    for (var i=0;i<more.length;i++) { GAME_DATA.push(more[i]); }
})();

console.log("📊 游戏数据库已加载 (" + GAME_DATA.length + " 款游戏)");
