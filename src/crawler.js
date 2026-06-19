// ============================================================================
// 数据获取 — 同域 games.json（GitHub Pages 直接提供，无CORS）
//   GitHub Actions 每天自动从RAWG抓取并更新 games.json
// ============================================================================

var REMOTE_DATA_URL = 'games.json';
var CRAWLER_CONFIG = { cacheKey:'gc_cache', cacheTime:6*60*60*1000 };

function fetchTimeout(url, ms) {
    return new Promise(function(resolve, reject) {
        var t = setTimeout(function() { reject(new Error('timeout')); }, ms);
        fetch(url).then(function(r) { clearTimeout(t); resolve(r); })
                  .catch(function(e) { clearTimeout(t); reject(e); });
    });
}

async function fetchRemoteCDN() {
    try {
        var resp = await fetchTimeout(REMOTE_DATA_URL + '?t=' + Date.now(), 10000);
        if (!resp.ok) return null;
        var data = await resp.json();
        if (!Array.isArray(data) || data.length === 0) return null;
        flashMsg('📡 在线更新 ' + data.length + ' 款游戏');
        return data;
    } catch(e) { return null; }
}

function getCachedGames() {
    try { var c = localStorage.getItem(CRAWLER_CONFIG.cacheKey); if (!c) return null;
        var p = JSON.parse(c); if (Date.now()-p.time>CRAWLER_CONFIG.cacheTime) return null; return p.data; }
    catch(e) { return null; }
}
function setCachedGames(g) { try { localStorage.setItem(CRAWLER_CONFIG.cacheKey, JSON.stringify({time:Date.now(),data:g})); } catch(e) {} }

async function syncGameData() {
    var cdn = await fetchRemoteCDN();
    if (cdn && cdn.length > 0) { GAME_DATA = cdn; setCachedGames(cdn); return cdn.length; }
    var cached = getCachedGames();
    if (cached && cached.length > 0) { GAME_DATA = cached; return cached.length; }
    return GAME_DATA.length;
}

function importGameJSON() {
    var input = document.createElement('input'); input.type='file'; input.accept='.json';
    input.onchange = function(e) {
        var f = e.target.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function(ev) {
            try { var d = JSON.parse(ev.target.result); if (!Array.isArray(d)) throw new Error('数组格式');
                GAME_DATA = d; setCachedGames(d); flashMsg('✅ 导入 '+d.length+' 款'); renderCalendar(); selectDate(selectedDate); }
            catch(err) { flashMsg('❌ '+err.message); }
        };
        r.readAsText(f);
    };
    input.click();
}

function exportGameJSON() {
    var blob = new Blob([JSON.stringify(GAME_DATA,null,2)], {type:'application/json'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'games.json'; a.click();
}

function showAdminPanel() {
    var h = '<h2>📦 数据</h2><p>'+GAME_DATA.length+' 款 | 源: GitHub Actions → RAW</p>';
    h += '<button onclick="doSync()">🔄 刷新</button> ';
    h += '<button onclick="importGameJSON()">📥导入</button> ';
    h += '<button onclick="exportGameJSON()">📤导出</button>';
    h += '<span id="sync-status"></span>';
    showModal(h);
}

function saveAdminConfig() {}
function doSync() { syncGameData().then(function(c){ flashMsg('✅ '+c+' 款'); renderCalendar(); selectDate(selectedDate); }); }

console.log('📡 crawler ready (games.json)');
