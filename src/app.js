// ============================================================================
// 游戏年历 — 主应用逻辑
// ============================================================================

var currentYear = 2026;
var currentMonth = 6; // 0-indexed for Date
var selectedDate = null;
var userRegion = 'CN';
var userPrefs = { genres:{}, platforms:{}, rating:'teen', favorites:[], ignored:[] };
var userWishlist = [];

// ── Init ──
(function() {
    var saved = localStorage.getItem('gamecalendar_prefs');
    if (saved) { try { userPrefs = JSON.parse(saved); } catch(e) {} }
    var wl = localStorage.getItem('gamecalendar_wishlist');
    if (wl) { try { userWishlist = JSON.parse(wl); } catch(e) {} }
    // 从远程数据库拉取最新游戏数据（如果配置了REMOTE_DATA_URL）
    syncGameData().then(function(count) {
        flashMsg('📡 已加载 ' + count + ' 款游戏');
    }).catch(function() {}).then(function() {
        renderCalendar();
        selectToday();
    });
})();

// ── Calendar Rendering ──
function renderCalendar() {
    document.getElementById('month-title').textContent = currentYear + '年 ' + (currentMonth + 1) + '月';
    var grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + pad(today.getMonth()+1) + '-' + pad(today.getDate());

    // 填充上月尾巴
    for (var i = 0; i < firstDay; i++) {
        var cell = document.createElement('div');
        cell.className = 'cal-day other-month';
        grid.appendChild(cell);
    }

    // 当月每一天
    for (var d = 1; d <= daysInMonth; d++) {
        var dateStr = currentYear + '-' + pad(currentMonth + 1) + '-' + pad(d);
        var games = getGamesForDate(dateStr);
        var cell = document.createElement('div');
        cell.className = 'cal-day';
        if (dateStr === todayStr) cell.className += ' today';
        cell.setAttribute('data-date', dateStr);
        cell.onclick = function() { selectDate(this.getAttribute('data-date')); };

        // 农历 + 节日
        var lunar = getLunar(dateStr);
        var holidays = getHolidays(dateStr);
        var lunarText = lunar ? '<span class="day-lunar">' + lunar + '</span>' : '';
        var holText = '';
        if (holidays.length > 0) {
            for (var hi = 0; hi < holidays.length; hi++) {
                holText += '<span class="day-holiday">' + holidays[hi].name + '</span>';
            }
        }

        cell.innerHTML = '<div class="day-top">' + lunarText + '<span class="day-num">' + d + '</span></div>' +
            holText +
            '<div class="day-games">';
        for (var g = 0; g < Math.min(games.length, 4); g++) {
            var gColor = games[g].type === 'update' ? 'update' : (games[g].type === 'dlc' ? 'dlc' : 'release');
            var isWish = userWishlist.indexOf(games[g].id) >= 0 ? ' ⭐' : '';
            var wishMarker = isWish ? '⭐ ' : '';
            var cnName = getGameDisplayName(games[g].name);
            var dotName = cnName !== games[g].name ? cnName : games[g].name;
            cell.innerHTML += '<span class="day-game-dot ' + gColor + '" title="' + games[g].name + '">' + wishMarker + games[g].cover + ' ' + dotName + '</span>';
        }
        if (games.length > 4) cell.innerHTML += '<span class="day-game-dot" style="color:#666;">+' + (games.length - 4) + ' 更多</span>';
        cell.innerHTML += '</div>';
        grid.appendChild(cell);
    }
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    var games = getGamesForDate(dateStr, true); // 包含已忽略的
    renderGameList(games);
    // 高亮选中日
    document.querySelectorAll('.cal-day').forEach(function(c) { c.style.borderColor = c.className.indexOf('today') >= 0 ? '#ffd700' : ''; });
    var el = document.querySelector('[data-date="' + dateStr + '"]');
    if (el) el.style.borderColor = '#4aafef';
}

function selectToday() {
    var today = new Date();
    if (today.getFullYear() === currentYear && today.getMonth() === currentMonth) {
        var dateStr = currentYear + '-' + pad(currentMonth + 1) + '-' + pad(today.getDate());
        selectDate(dateStr);
    }
}

// ── Game Filtering ──
function getGamesForDate(dateStr, includeIgnored) {
    return GAME_DATA.filter(function(g) {
        for (var i = 0; i < g.releases.length; i++) {
            if (g.releases[i].date === dateStr && (g.releases[i].region === userRegion || g.releases[i].region === 'GLOBAL')) {
                if (g.rating === 'adult') return false;
                if (includeIgnored) return true;
                if (userPrefs.ignored.indexOf(g.id) >= 0) return false;
                return true;
            }
        }
        return false;
    });
}

// ── Sidebar ──
function renderGameList(games) {
    var list = document.getElementById('game-list');
    if (!games.length) { list.innerHTML = '<p style="color:#666;">当天没有游戏发售</p>'; return; }
    list.innerHTML = '<h3>📋 ' + (selectedDate || '') + '</h3>';
    for (var i = 0; i < games.length; i++) {
        var g = games[i];
        var isWish = userWishlist.indexOf(g.id) >= 0;
        var isIgnored = userPrefs.ignored.indexOf(g.id) >= 0;
        var div = document.createElement('div');
        div.className = 'game-card' + (isWish ? ' wishlist' : '') + (isIgnored ? ' ignored' : '');
        var platNames = g.platforms.map(function(p) {
            var map = { PC:'🖥️ Steam/Epic', PS5:'🎮 PS5', Xbox:'🎯 Xbox', Switch:'🕹️ Switch', 手机:'📱 App Store' };
            return map[p] || p;
        });
        var cnName = getGameDisplayName(g.name);
        var nameDisplay = g.name;
        if (cnName !== g.name) nameDisplay += '<br><span style="font-size:12px;color:#aaa;">' + cnName + '</span>';

        div.innerHTML = '<span class="gc-cover">' + g.cover + '</span>' +
            '<div class="gc-name">' + nameDisplay + (isWish ? ' ⭐' : '') + '</div>' +
            '<div class="gc-info">' + platNames.join('<br>') + '</div>' +
            '<div class="gc-info" style="margin-top:3px;">' + (g.type==='release'?'🎮 发售':g.type==='dlc'?'📦 DLC':'🔄 更新') + '</div>' +
            (g.expectScore ? '<div class="gc-score">期待度 ' + g.expectScore + '</div>' : '') +
            '<div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap;">' +
            '<button onclick="event.stopPropagation();showGameDetail(\'' + g.id + '\')" style="font-size:12px;padding:3px 8px;cursor:pointer;border:1px solid #ffd700;background:rgba(30,30,20,0.8);color:#ffd700;border-radius:4px;">📋 详情</button>' +
            '<button onclick="event.stopPropagation();toggleWishlist(\'' + g.id + '\')" style="font-size:12px;padding:3px 8px;cursor:pointer;border:1px solid #4aaf5c;background:#1a4a2f;color:#c0ffc0;border-radius:4px;">' + (isWish?'取消关注':'⭐关注') + '</button>' +
            (isIgnored ?
                '<button onclick="event.stopPropagation();unignoreGame(\'' + g.id + '\')" style="font-size:12px;padding:3px 8px;cursor:pointer;border:1px solid #4488cc;background:#1a2a3a;color:#88bbff;border-radius:4px;">↩ 撤销</button>' :
                '<button onclick="event.stopPropagation();ignoreGame(\'' + g.id + '\')" style="font-size:12px;padding:3px 8px;cursor:pointer;border:1px solid #5a3a3a;background:#2a1a1a;color:#aa8888;border-radius:4px;">不感兴趣</button>') +
            '</div>';
        list.appendChild(div);
    }
}

// ── User Actions ──
function toggleWishlist(gameId) {
    var idx = userWishlist.indexOf(gameId);
    if (idx >= 0) userWishlist.splice(idx, 1); else userWishlist.push(gameId);
    localStorage.setItem('gamecalendar_wishlist', JSON.stringify(userWishlist));
    renderCalendar();
    selectDate(selectedDate);
    flashMsg(userWishlist.indexOf(gameId) >= 0 ? '⭐ 已关注！可导出到日历' : '已取消关注');
}

function ignoreGame(gameId) {
    if (userPrefs.ignored.indexOf(gameId) < 0) userPrefs.ignored.push(gameId);
    localStorage.setItem('gamecalendar_prefs', JSON.stringify(userPrefs));
    renderCalendar();
    selectDate(selectedDate);
    flashMsg('已隐藏，点击侧边栏中"撤销"可恢复');
}

function unignoreGame(gameId) {
    var idx = userPrefs.ignored.indexOf(gameId);
    if (idx >= 0) userPrefs.ignored.splice(idx, 1);
    localStorage.setItem('gamecalendar_prefs', JSON.stringify(userPrefs));
    renderCalendar();
    selectDate(selectedDate);
    flashMsg('已恢复推荐');
}

function flashMsg(msg) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a4a2f;color:#c0ffc0;border:1px solid #4aaf5c;padding:10px 24px;border-radius:6px;z-index:300;font-size:14px;transition:opacity .4s;white-space:nowrap;';
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._timer);
    el._timer = setTimeout(function() { el.style.opacity = '0'; }, 2000);
}

// ── Navigation ──
function prevMonth() { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } selectedDate = null; renderCalendar(); document.getElementById('game-list').innerHTML = '<p style="color:#666;">点击日历中的日期查看</p>'; }
function nextMonth() { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } selectedDate = null; renderCalendar(); document.getElementById('game-list').innerHTML = '<p style="color:#666;">点击日历中的日期查看</p>'; }
function changeRegion(r) { userRegion = r; renderCalendar(); selectDate(selectedDate); }
function toggleSidebar() {
    var sb = document.getElementById('sidebar');
    sb.classList.toggle('show');
}

// ── Game Detail Modal ──
function showGameDetail(gameId) {
    var g = null;
    for (var i = 0; i < GAME_DATA.length; i++) { if (GAME_DATA[i].id === gameId) { g = GAME_DATA[i]; break; } }
    if (!g) return;

    var cnName = getGameDisplayName(g.name);
    var platNames = g.platforms.map(function(p) {
        var map = { PC:'🖥️ Steam/Epic', PS5:'🎮 PS5', Xbox:'🎯 Xbox', Switch:'🕹️ Switch', 手机:'📱 App Store' };
        return map[p] || p;
    });
    var typeLabel = g.type === 'release' ? '🎮 发售' : (g.type === 'dlc' ? '📦 DLC' : '🔄 更新');
    var ratingLabel = g.rating === 'mature' ? '🔞 成人' : (g.rating === 'teen' ? '👦 青少年' : '👶 全年龄');

    var releasesHTML = '';
    for (var i = 0; i < g.releases.length; i++) {
        var regionNames = { CN:'🇨🇳中国', GLOBAL:'🌍全球', JP:'🇯🇵日本', EU:'🇪🇺欧洲', KR:'🇰🇷韩国' };
        releasesHTML += '<span style="margin-right:12px;">' + (regionNames[g.releases[i].region]||g.releases[i].region) + ': <b>' + g.releases[i].date + '</b></span>';
    }

    var html = '<div style="text-align:center;">';
    html += '<span style="font-size:48px;">' + g.cover + '</span>';
    html += '<h2 style="color:#fff;margin:8px 0;">' + g.name + '</h2>';
    if (cnName !== g.name) html += '<p style="color:#ffd700;font-size:18px;">' + cnName + '</p>';
    html += '<p style="color:#aaa;">' + typeLabel + ' | ' + ratingLabel + ' | ' + platNames.join(' ｜ ') + '</p>';
    if (g.expectScore) html += '<p style="color:#ffd700;font-size:16px;">⭐ 期待度: ' + g.expectScore + ' | 🔥 热度: ' + g.popularity + '</p>';
    html += '<div style="margin:10px 0;">' + releasesHTML + '</div>';
    html += '<p style="color:#ccc;line-height:1.6;max-height:120px;overflow-y:auto;">' + (g.desc || '暂无描述') + '</p>';
    var isWish = userWishlist.indexOf(g.id) >= 0;
    html += '<div style="margin-top:12px;">';
    html += '<button onclick="toggleWishlist(\'' + g.id + '\');showGameDetail(\'' + g.id + '\')" style="padding:6px 16px;cursor:pointer;border:1px solid #4aaf5c;background:#1a4a2f;color:#c0ffc0;border-radius:4px;font-size:14px;margin:4px;">' + (isWish?'取消关注':'⭐ 关注') + '</button>';
    html += '<button onclick="closeModal()" style="padding:6px 16px;cursor:pointer;border:1px solid #666;background:#333;color:#aaa;border-radius:4px;font-size:14px;margin:4px;">关闭</button>';
    html += '</div></div>';

    document.getElementById('modal').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('show');
}

// ── Modal ──
function showModal(html) {
    document.getElementById('modal').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('show');
}
function closeModal(e) {
    if (e && e.target !== document.getElementById('modal-overlay')) return;
    document.getElementById('modal-overlay').classList.remove('show');
}

// ── Questionnaire ──
function showQuestionnaire() {
    var html = '<h2>📝 游戏偏好问卷</h2><p style="color:#aaa;margin-bottom:12px;">帮助我们了解你的游戏喜好（共15题）</p>';
    html += '<div style="max-height:50vh;overflow-y:auto;">';

    // Q1-2: age/gender
    html += '<p><b>1. 年龄段</b></p>';
    ['18岁以下','18-24','25-34','35-44','45+'].forEach(function(o) { html += '<label style="margin-right:12px;"><input type="radio" name="q1" value="'+o+'"> '+o+'</label>'; });
    html += '<br><br><p><b>2. 性别</b></p>';
    ['男','女','不便透露'].forEach(function(o) { html += '<label style="margin-right:12px;"><input type="radio" name="q2" value="'+o+'"> '+o+'</label>'; });

    // Q3-7: platforms
    html += '<br><br><p><b>3-7. 游戏平台偏好（每项评分1-5）</b></p>';
    PLATFORM_TAGS.forEach(function(p,i) {
        html += '<p>' + p.icon + ' ' + p.name + ': ';
        for (var s=1;s<=5;s++) html += '<input type="radio" name="pf' + i + '" value="'+s+'">'+s+' ';
        html += '</p>';
    });

    // Q8-12: genres
    html += '<br><p><b>8-12. 选择3个最爱的游戏类型 + 2个不感兴趣</b></p>';
    html += '<p style="color:#aaa;font-size:11px;">最爱:</p>';
    GENRE_TAGS.forEach(function(t) { html += '<label style="margin-right:8px;"><input type="checkbox" class="q-like" value="'+t.id+'"> '+t.icon+' '+t.name+'</label>'; });
    html += '<br><p style="color:#aaa;font-size:11px;">不感兴趣:</p>';
    GENRE_TAGS.forEach(function(t) { html += '<label style="margin-right:8px;"><input type="checkbox" class="q-dislike" value="'+t.id+'"> '+t.icon+' '+t.name+'</label>'; });

    // Q13-15
    html += '<br><br><p><b>13. 每周游戏时长</b></p>';
    ['<5小时','5-15小时','>15小时'].forEach(function(o) { html += '<label style="margin-right:12px;"><input type="radio" name="q13" value="'+o+'"> '+o+'</label>'; });
    html += '<br><br><p><b>14. 游戏方式偏好</b></p>';
    ['单机为主','联机为主','都喜欢'].forEach(function(o) { html += '<label style="margin-right:12px;"><input type="radio" name="q14" value="'+o+'"> '+o+'</label>'; });
    html += '<br><br><p><b>15. 月均游戏消费</b></p>';
    ['免费玩家','0-100元','100-300元','300元以上'].forEach(function(o) { html += '<label style="margin-right:12px;"><input type="radio" name="q15" value="'+o+'"> '+o+'</label>'; });

    html += '</div>';
    html += '<br><button onclick="submitQuestionnaire()" style="padding:8px 24px;cursor:pointer;border:2px solid #4aaf5c;background:#1a4a2f;color:#c0ffc0;border-radius:6px;font-size:15px;">✅ 提交</button>';

    showModal(html);
}

function submitQuestionnaire() {
    var likes = []; document.querySelectorAll('.q-like:checked').forEach(function(c) { likes.push(c.value); });
    var dislikes = []; document.querySelectorAll('.q-dislike:checked').forEach(function(c) { dislikes.push(c.value); });
    userPrefs.genres = {};
    likes.forEach(function(g) { userPrefs.genres[g] = 1.0; });
    dislikes.forEach(function(g) { userPrefs.genres[g] = -1.0; });
    localStorage.setItem('gamecalendar_prefs', JSON.stringify(userPrefs));
    closeModal();
    selectDate(selectedDate);
    alert('偏好已保存！🎉');
}

// ── ICS Export ──
function exportICS() {
    var wishGames = GAME_DATA.filter(function(g) { return userWishlist.indexOf(g.id) >= 0; });
    if (!wishGames.length) { flashMsg('请先在日历中 ⭐关注 游戏再导出'); return; }
    var ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//GameCalendar//CN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n';
    wishGames.forEach(function(g) {
        var rel = null;
        for (var i=0;i<g.releases.length;i++) { if (g.releases[i].region===userRegion){ rel=g.releases[i]; break; } }
        if (!rel) for (var i=0;i<g.releases.length;i++) { if (g.releases[i].region==='GLOBAL'){ rel=g.releases[i]; break; } }
        if (!rel) rel = g.releases[0];
        var dt = rel.date.replace(/-/g,'');
        // DTEND = DTSTART + 1 day
        var endDt = '';
        var parts = rel.date.split('-');
        if (parts.length === 3) {
            var d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2])+1);
            endDt = d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate());
        } else { endDt = dt; }
        var summary = g.name + (g.type==='release'?' 发售':g.type==='dlc'?' DLC':' 更新');
        ics += 'BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:' + dt + '\r\nDTEND;VALUE=DATE:' + endDt + '\r\nSUMMARY:' + summary + '\r\nDESCRIPTION:' + g.desc + '\\n平台: ' + g.platforms.join('/') + '\r\nBEGIN:VALARM\r\nTRIGGER:-PT1440M\r\nACTION:DISPLAY\r\nDESCRIPTION:提醒: ' + summary + '\r\nEND:VALARM\r\nEND:VEVENT\r\n';
    });
    ics += 'END:VCALENDAR\r\n';
    var blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gamecalendar.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    flashMsg('📅 已下载 ' + wishGames.length + ' 个游戏提醒到日历文件');
}

// ── Helpers ──
function pad(n) { return n < 10 ? '0' + n : '' + n; }

console.log('🎮 游戏年历已就绪');
