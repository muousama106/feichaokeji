// ============================================================================
// 游戏数据获取器
//   架构：中央数据库JSON → 所有用户自动拉取
//   运营方用VPN爬取Steam → 更新JSON → 发布到CDN → 用户自动更新
// ============================================================================

// RAWG API Key（运营方配置，用户无需关心）
var RAWG_API_KEY = localStorage.getItem('gc_rawg_key') || '';
// Gitee/CDN 远程数据库URL（用户自动拉取，无需VPN）
// GitHub API — 国内可直连
var REMOTE_DATA_URL = 'https://api.github.com/repos/muousama106/feichaokeji/contents/games.json';

var CRAWLER_CONFIG = {
    cacheKey: 'gc_game_cache',
    cacheTime: 6 * 60 * 60 * 1000, // 6小时刷新一次
};

// ═══ 从 RAWG API 拉取（需要VPN）═══
// ═══ GitHub API（国内直连）═══
async function fetchRemoteCDN() {
    var apiUrl = 'https://api.github.com/repos/muousama106/feichaokeji/contents/games.json';
    try {
        var resp = await fetchTimeout(apiUrl, 10000);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        var raw = await resp.json();
        if (!raw.content || raw.encoding !== 'base64') throw new Error('格式错误');
        var json = atob(raw.content.replace(/\s/g, ''));
        var data = JSON.parse(json);
        if (!Array.isArray(data) || data.length === 0) throw new Error('空数据');
        flashMsg('📡 在线更新 ' + data.length + ' 款游戏');
        return data;
    } catch(e) {
        return null;
    }
}

// ═══ 缓存 ═══
function getCachedGames() {
    try { var c=localStorage.getItem(CRAWLER_CONFIG.cacheKey); if(!c) return null;
        var p=JSON.parse(c); if(Date.now()-p.time > CRAWLER_CONFIG.cacheTime) return null; return p.data; }
    catch(e){ return null; }
}
function setCachedGames(games) {
    try { localStorage.setItem(CRAWLER_CONFIG.cacheKey, JSON.stringify({time:Date.now(),data:games})); } catch(e){}
}

// ═══ 主同步 ═══
async function syncGameData() {
    // 1. GitHub API（国内直连，数据由GitHub Actions每天自动更新）
    var cdn = await fetchRemoteCDN();
    if (cdn && cdn.length > 0) { GAME_DATA = cdn; setCachedGames(cdn); return cdn.length; }
    // 2. 缓存
    var cached = getCachedGames();
    if (cached && cached.length > 0) { GAME_DATA = cached; return cached.length; }
    return GAME_DATA.length;
}

// ═══ 导入/导出 ═══
function importGameJSON() {
    var input = document.createElement('input'); input.type='file'; input.accept='.json';
    input.onchange = function(e) {
        var f = e.target.files[0]; if(!f) return;
        var r = new FileReader();
        r.onload = function(ev) {
            try {
                var d = JSON.parse(ev.target.result);
                if (!Array.isArray(d)) throw new Error('需要数组格式');
                GAME_DATA = d; setCachedGames(d);
                renderCalendar(); selectDate(selectedDate);
                flashMsg('✅ 导入 '+d.length+' 款游戏');
            } catch(err) { flashMsg('❌ '+err.message); }
        };
        r.readAsText(f);
    };
    input.click();
}

function exportGameJSON() {
    var blob = new Blob([JSON.stringify(GAME_DATA,null,2)], {type:'application/json'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'games.json'; a.click();
    flashMsg('📤 已导出 '+GAME_DATA.length+' 款');
}

// ═══ 管理面板 ═══
function showAdminPanel() {
    var html = '<h2>🔧 数据管理</h2>';
    html += '<p style="color:var(--muted)">当前: <b>' + GAME_DATA.length + '</b> 款游戏</p>';

    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px;margin:12px 0;">';
    html += '<p style="font-weight:600">🎮 RAWG API Key <span style="font-size:11px;color:var(--muted);">（运营方配置，需VPN）</span></p>';
    html += '<input id="admin-rawg-key" value="'+RAWG_API_KEY+'" placeholder="输入RAWG API Key" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-size:14px;background:var(--bg);color:var(--text);">';
    html += '<p style="font-size:11px;color:var(--muted);">免费注册: rawg.io/apidocs</p>';
    html += '</div>';

    html += '<button onclick="saveAdminConfig()" style="padding:10px 24px;cursor:pointer;background:var(--green);color:#fff;border:none;border-radius:6px;font-size:16px;">💾 保存配置</button> ';

    html += '<button onclick="doSync()" style="padding:10px 24px;cursor:pointer;background:var(--blue);color:#fff;border:none;border-radius:6px;font-size:16px;">🔄 同步RAWG（开VPN）</button> ';
    html += '<span id="sync-status" style="margin-left:10px;color:var(--muted);"></span>';

    html += '<p style="font-size:12px;color:var(--muted);margin-top:8px;">💡 工作流程：开VPN同步 → 📤导出 → 上传到GitHub → jsDelivr CDN自动更新</p>';
    html += '<p style="font-size:11px;color:var(--muted);">数据源: GitHub + jsDelivr + ghproxy 三路降级</p>';

    html += '<hr style="border-color:var(--border);margin:12px 0;">';
    html += '<button onclick="importGameJSON()" style="padding:6px 14px;cursor:pointer;border:1px solid var(--border);background:var(--card);color:var(--text);border-radius:4px;font-size:13px;">📥 导入JSON</button> ';
    html += '<button onclick="exportGameJSON()" style="padding:6px 14px;cursor:pointer;border:1px solid var(--border);background:var(--card);color:var(--text);border-radius:4px;font-size:13px;">📤 导出JSON</button>';
    showModal(html);
}

// ═══ Gitee 自动上传 ═══
var GITEE_CONFIG = {
    token: localStorage.getItem('gc_gitee_token') || '',
    owner: 'muousama106',
    repo: 'feichaokeji',
    path: 'games.json',
};

async function autoUploadToGitee() {
    var token = GITEE_CONFIG.token;
    if (!token) { flashMsg('❌ 请先配置 Gitee Token'); return; }

    var cached = getCachedGames();
    var data = (cached && cached.length > GAME_DATA.length) ? cached : GAME_DATA;
    var content = JSON.stringify(data, null, 2);
    // Base64 encode (Unicode safe)
    var encoder = new TextEncoder();
    var bytes = encoder.encode(content);
    var binary = '';
    for (var i = 0; i < bytes.length; i++) { binary += String.fromCharCode(bytes[i]); }
    var base64 = btoa(binary);
    var apiUrl = 'https://gitee.com/api/v5/repos/' + GITEE_CONFIG.owner + '/' + GITEE_CONFIG.repo + '/contents/' + GITEE_CONFIG.path;
    var body = JSON.stringify({
        access_token: token,
        content: base64,
        message: '自动更新游戏数据 (' + new Date().toISOString().split('T')[0] + ', ' + GAME_DATA.length + '款)',
    });

    flashMsg('📤 正在上传到 Gitee...');
    try {
        var resp = await fetch(apiUrl, { method: 'PUT', body: body, headers: {'Content-Type':'application/json'} });
        var result = await resp.json();
        if (resp.ok && result.content) {
            flashMsg('✅ 已上传到 Gitee！' + data.length + ' 款游戏');
        } else {
            flashMsg('❌ 上传失败: ' + (result.message || resp.status));
        }
    } catch(e) {
        flashMsg('❌ 上传失败: ' + e.message);
    }
}

function saveAdminConfig() {
    var key = document.getElementById('admin-rawg-key').value.trim();
    RAWG_API_KEY = key;
    localStorage.setItem('gc_rawg_key', key);
    flashMsg('✅ 配置已保存');
}

function doSync() {
    var st = document.getElementById('sync-status');
    if (st) st.textContent = '同步中...';
    syncGameData().then(function(c) {
        if (st) st.textContent = '✅ 获取 ' + c + ' 款（总计 ' + GAME_DATA.length + '）';
        renderCalendar(); if (selectedDate) selectDate(selectedDate); else selectToday();
    }).catch(function(e) {
        if (st) st.textContent = '❌ ' + e.message;
    });
}

console.log('📡 数据同步模块就绪（远程URL + 本地缓存）');
