// ============================================================================
// 节假日数据 — 中国法定假日 + 国际节日 + 农历转换
// ============================================================================

// 2026年中国法定节假日
var CN_HOLIDAYS_2026 = {
    '2026-01-01': { name:'元旦', type:'holiday', days:1 },
    '2026-01-28': { name:'除夕', type:'holiday' },
    '2026-01-29': { name:'春节', type:'holiday', days:7 },
    '2026-04-05': { name:'清明节', type:'holiday', days:3 },
    '2026-05-01': { name:'劳动节', type:'holiday', days:5 },
    '2026-06-19': { name:'端午节', type:'holiday', days:3 },
    '2026-09-25': { name:'中秋节', type:'holiday', days:3 },
    '2026-10-01': { name:'国庆节', type:'holiday', days:7 },
};

// 国际节日
var GLOBAL_HOLIDAYS = {
    '2026-01-01': { name:'元旦', type:'global' },
    '2026-02-14': { name:'情人节', type:'global' },
    '2026-03-08': { name:'妇女节', type:'global' },
    '2026-04-01': { name:'愚人节', type:'global' },
    '2026-05-10': { name:'母亲节', type:'global' },
    '2026-06-01': { name:'儿童节', type:'global' },
    '2026-06-21': { name:'父亲节', type:'global' },
    '2026-10-31': { name:'万圣节', type:'global' },
    '2026-11-26': { name:'感恩节', type:'global' },
    '2026-12-25': { name:'圣诞节', type:'global' },
};

// 农历数据 — 2026年（算法生成）
var LUNAR_MONTH_DAYS = [29,30,29,30,29,30,29,30,30,29,30,29]; // 2026年农历每月天数
var LUNAR_MONTH_NAMES = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
var LUNAR_DAY_NAMES = ['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

// 2026年正月初一 = 公历 2026-01-29（春节）
var LUNAR_BASE = new Date(2026, 0, 29); // Jan 29, 2026 = 正月初一
var LUNAR_BASE_TIME = LUNAR_BASE.getTime();

function getLunar(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
    var diffDays = Math.round((d.getTime() - LUNAR_BASE_TIME) / 86400000);

    if (diffDays < 0) {
        // 2026年正月初一之前 = 2025年腊月
        var prevMonthTotal = 30; // 2025腊月30天
        var day = prevMonthTotal + diffDays + 1;
        if (day > 0 && day <= 30) return '腊月' + LUNAR_DAY_NAMES[day];
        return '';
    }

    var remaining = diffDays;
    for (var m = 0; m < 12; m++) {
        if (remaining < LUNAR_MONTH_DAYS[m]) {
            var day = remaining + 1;
            var name = LUNAR_MONTH_NAMES[m] + LUNAR_DAY_NAMES[day];
            // 特殊节日标记
            if (m === 0 && day === 1) name = '正月初一·春节';
            else if (m === 0 && day === 15) name = '正月十五·元宵';
            else if (m === 4 && day === 5) name = '五月初五·端午';
            else if (m === 7 && day === 15) name = '八月十五·中秋';
            else if (m === 8 && day === 9) name = '九月初九·重阳';
            return name;
        }
        remaining -= LUNAR_MONTH_DAYS[m];
    }
    return '';
}

// 获取节日
function getHolidays(dateStr) {
    var result = [];
    if (CN_HOLIDAYS_2026[dateStr]) result.push(CN_HOLIDAYS_2026[dateStr]);
    if (GLOBAL_HOLIDAYS[dateStr]) result.push(GLOBAL_HOLIDAYS[dateStr]);
    return result;
}
