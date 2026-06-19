// GitHub Actions 脚本 — 从RAWG抓取游戏数据并写入games.json
const https = require('https');

const KEY = process.env.RAWG_KEY;
if (!KEY) { console.error('RAWG_KEY not set'); process.exit(1); }

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const past = new Date(Date.now() - 180*86400000).toISOString().split('T')[0];
    const future = new Date(Date.now() + 365*86400000).toISOString().split('T')[0];
    const url = `https://api.rawg.io/api/games?key=${KEY}&dates=${past},${future}&ordering=-added&page_size=40&page=${page}`;
    https.get(url, { headers: { 'User-Agent': 'GameCalendar/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const genreMap = {
  Action: '动作冒险', Adventure: '动作冒险', RPG: 'RPG', Shooter: 'FPS/射击',
  Strategy: '策略', Simulation: '模拟经营', Sports: '体育竞速', Racing: '体育竞速',
  Indie: '独立游戏', 'Massively Multiplayer': 'MMO', Casual: 'MMO',
};
const platformMap = { PC: 'PC', PlayStation: 'PS5', Xbox: 'Xbox', Nintendo: 'Switch' };

async function main() {
  const all = [];
  for (let p = 1; p <= 10; p++) {
    try {
      const data = await fetchPage(p);
      if (!data.results || data.results.length === 0) break;
      for (const g of data.results) {
        let rdate = g.released || '2026-08-01';
        if (!rdate.match(/^\d{4}-\d{2}-\d{2}$/)) rdate = '2026-08-01';
        const genres = [];
        if (g.genres) g.genres.forEach(ge => {
          const n = genreMap[ge.name] || '动作冒险';
          if (!genres.includes(n)) genres.push(n);
        });
        if (!genres.length) genres.push('动作冒险');
        const platforms = [];
        if (g.parent_platforms) g.parent_platforms.forEach(pp => {
          const n = platformMap[pp.platform.name];
          if (n && !platforms.includes(n)) platforms.push(n);
        });
        if (!platforms.length) platforms.push('PC');
        all.push({
          id: 'rawg_' + g.id, name: g.name, type: 'release',
          genres: genres.slice(0, 3), platforms,
          releases: [{ region: 'GLOBAL', date: rdate }, { region: 'CN', date: rdate }],
          expectScore: g.metacritic || g.rating_top || 75,
          popularity: Math.round((g.added || 100) / 10),
          rating: g.esrb_rating && g.esrb_rating.name === 'Mature' ? 'mature' : 'teen',
          cover: g.background_image ? '🖼️' : '🎮',
          desc: (g.slug || '').replace(/-/g, ' ').substring(0, 60),
          source: 'rawg_auto',
        });
      }
      console.log(`Page ${p}: ${data.results.length} games (total ${all.length})`);
    } catch(e) { console.error(`Page ${p} failed: ${e.message}`); break; }
  }
  require('fs').writeFileSync('games.json', JSON.stringify(all, null, 2));
  console.log(`Done! ${all.length} games written to games.json`);
}
main();
