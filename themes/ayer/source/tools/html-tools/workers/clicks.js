export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (url.pathname !== '/api/clicks') {
      return new Response('Not found', { status: 404 });
    }

    if (request.method === 'GET') {
      const idsParam = url.searchParams.get('ids') || '';
      const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
      const counts = {};
      const day = new Date().toISOString().slice(0, 10);
      for (const id of ids) {
        const [pvTotal, uvTotal, pvDay, uvDay] = await Promise.all([
          env.CLICKS_KV.get(`pv:${id}`),
          env.CLICKS_KV.get(`uv:${id}`),
          env.CLICKS_KV.get(`pv:${id}:${day}`),
          env.CLICKS_KV.get(`uv:${id}:${day}`)
        ]);
        counts[id] = {
          pv: { total: Number(pvTotal || 0), day: Number(pvDay || 0) },
          uv: { total: Number(uvTotal || 0), day: Number(uvDay || 0) }
        };
      }
      return jsonResponse({ counts }, 200, corsHeaders);
    }

    if (request.method === 'POST') {
      let payload;
      try {
        payload = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON' }, 400);
      }

      const id = String(payload?.id || '').trim();
      if (!id) {
        return jsonResponse({ error: 'Missing id' }, 400);
      }

      const { visitorId, headers } = await ensureVisitor(request);
      const day = new Date().toISOString().slice(0, 10);
      const pvTotalKey = `pv:${id}`;
      const pvDayKey = `pv:${id}:${day}`;
      const uvTotalKey = `uv:${id}`;
      const uvDayKey = `uv:${id}:${day}`;
      const seenTotalKey = `seen:total:${id}:${visitorId}`;
      const seenDayKey = `seen:day:${id}:${visitorId}:${day}`;

      const [pvTotalRaw, pvDayRaw, uvTotalRaw, uvDayRaw, seenTotal, seenDay] = await Promise.all([
        env.CLICKS_KV.get(pvTotalKey),
        env.CLICKS_KV.get(pvDayKey),
        env.CLICKS_KV.get(uvTotalKey),
        env.CLICKS_KV.get(uvDayKey),
        env.CLICKS_KV.get(seenTotalKey),
        env.CLICKS_KV.get(seenDayKey)
      ]);

      const pvTotal = Number(pvTotalRaw || 0) + 1;
      const pvDay = Number(pvDayRaw || 0) + 1;

      await Promise.all([
        env.CLICKS_KV.put(pvTotalKey, String(pvTotal)),
        env.CLICKS_KV.put(pvDayKey, String(pvDay))
      ]);

      let uvTotal = Number(uvTotalRaw || 0);
      if (!seenTotal) {
        uvTotal += 1;
        await Promise.all([
          env.CLICKS_KV.put(uvTotalKey, String(uvTotal)),
          env.CLICKS_KV.put(seenTotalKey, '1')
        ]);
      }

      let uvDay = Number(uvDayRaw || 0);
      if (!seenDay) {
        uvDay += 1;
        await Promise.all([
          env.CLICKS_KV.put(uvDayKey, String(uvDay)),
          env.CLICKS_KV.put(seenDayKey, '1', { expirationTtl: 60 * 60 * 48 })
        ]);
      }

      return jsonResponse(
        { id, pv: { total: pvTotal, day: pvDay }, uv: { total: uvTotal, day: uvDay } },
        200,
        { ...corsHeaders, ...headers }
      );
    }

    return new Response('Method not allowed', { status: 405 });
  }
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}

async function ensureVisitor(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/htmls_vid=([^;]+)/);
  if (match) {
    return { visitorId: match[1], headers: {} };
  }

  const visitorId = crypto.randomUUID();
  const headers = {
    'Set-Cookie': `htmls_vid=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax`
  };
  return { visitorId, headers };
}
