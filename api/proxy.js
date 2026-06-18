// Vercel Serverless Function — RAWG API 代理（CommonJS格式）
module.exports = async function handler(req, res) {
    // CORS 完整支持
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') { res.status(200).end(); return; }

    var KEY = process.env.RAWG_KEY || 'cd40865edfda46d5bc7eca06864f3667';
    var page = req.query.page || 1;
    var past = new Date(Date.now() - 180*86400000).toISOString().split('T')[0];
    var future = new Date(Date.now() + 365*86400000).toISOString().split('T')[0];
    var url = 'https://api.rawg.io/api/games?key=' + KEY + '&dates=' + past + ',' + future + '&ordering=-added&page_size=40&page=' + page;

    try {
        var resp = await fetch(url);
        var data = await resp.json();
        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
};
