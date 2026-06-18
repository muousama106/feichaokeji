// ============================================================================
// 游戏数据获取器
//   架构：中央数据库JSON → 所有用户自动拉取
//   运营方用VPN爬取Steam → 更新JSON → 发布到CDN → 用户自动更新
// ============================================================================

// RAWG API Key（运营方配置，用户无需关心）
var RAWG_API_KEY = localStorage.getItem('gc_rawg_key') || '';
// Gitee/CDN 远程数据库URL（用户自动拉取，无需VPN）
var REMOTE_DATA_URL = 'https://feichaokeji1.vercel.app/api/proxy';

var CRAWLER_CONFIG = {
    cacheKey: 'gc_game_cache',
    cacheTime: 6 * 60 * 60 * 1000, // 6小时刷新一次
};

// ═══ 从 RAWG API 拉取（需要VPN）═══
// ═══ 通过 Vercel 代理抓取 RAWG（无 CORS 问题）═══
async function fetchViaVercel() {
    var all = [];
    for (var p = 1; p <= 10; p++) {
        try {
            var resp = await fetchTimeout(REMOTE_DATA_URL + '?page=' + p, 10000);
            if (!resp.ok) break;
            var data = await resp.json();
            if (!data.results || data.results.length === 0) break;
            data.results.forEach(function(g) {
                var rdate = g.released || '2026-08-01';
                if (!rdate.match(/^\d{4}-\d{2}-\d{2}$/)) rdate = '2026-08-01';
                var genres = [];
                if (g.genres) g.genres.forEach(function(ge) {
                    var n = ge.name;
                    if (n.indexOf('Action')>=0) genres.push('动作冒险');
                    else if (n.indexOf('RPG')>=0) genres.push('RPG');
                    else if (n.indexOf('Shooter')>=0) genres.push('FPS/射击');
                    else if (n.indexOf('Strategy')>=0) genres.push('策略');
                    else if (n.indexOf('Simulation')>=0) genres.push('模拟经营');
                    else if (n.indexOf('Sport')>=0||n.indexOf('Racing')>=0) genres.push('体育竞速');
                    else if (n.indexOf('Indie')>=0) genres.push('独立游戏');
                });
                if (genres.length===0) genres.push('动作冒险');
                var platforms = [];
                if (g.parent_platforms) g.parent_platforms.forEach(function(pf) {
                    var n = pf.platform.name;
                    if (n==='PC') platforms.push('PC');
                    else if (n==='PlayStation') platforms.push('PS5');
                    else if (n==='Xbox') platforms.push('Xbox');
                    else if (n==='Nintendo') platforms.push('Switch');
                });
                if (platforms.length===0) platforms.push('PC');
                all.push({
                    id:'rawg_'+g.id, name:g.name, type:'release',
                    genres:genres.slice(0,3), platforms:platforms,
                    releases:[{region:'GLOBAL',date:rdate},{region:'CN',date:rdate}],
                    expectScore:g.metacritic||g.rating_top||75, popularity:Math.round((g.added||100)/10),
                    rating:g.esrb_rating&&g.esrb_rating.name==='Mature'?'mature':'teen',
                    cover:g.background_image?'🖼️':'🎮', desc:(g.slug||'').replace(/-/g,' ').substring(0,60),
                    source:'vercel_rawg',
                });
            });
        } catch(e) { continue; }
    }
    if (all.length > 0) flashMsg('🎮 Vercel抓取: ' + all.length + ' 款游戏');
    else flashMsg('⚠ Vercel返回0款，检查代理是否正常');
    return all.length > 0 ? all : null;
}

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
    // 1. Vercel代理RAWG（自动，无需VPN）
    var rawg = await fetchViaVercel();
    if (rawg && rawg.length > 50) { GAME_DATA = rawg; setCachedGames(rawg); return rawg.length; }
    // 2. GitHub API
    var cdn = await fetchRemoteCDN();
    if (cdn && cdn.length > GAME_DATA.length) { GAME_DATA = cdn; setCachedGames(cdn); return cdn.length; }
    // 3. 缓存
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
