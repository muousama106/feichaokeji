// Vercel Serverless Function — RAWG API 代理
// 部署后访问: https://你的域名.vercel.app/api/proxy?page=1
// 自动从RAWG抓取并返回JSON，绕过CORS

export default async function handler(req, res) {
    // CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');

    const KEY = process.env.RAWG_KEY || 'cd40865edfda46d5bc7eca06864f3667';
    const page = req.query.page || 1;
    const today = new Date().toISOString().split('T')[0];
    const future = new Date(Date.now() + 365*86400000).toISOString().split('T')[0];

    const url = `https://api.rawg.io/api/games?key=${KEY}&dates=${today},${future}&ordering=-added&page_size=40&page=${page}`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
