import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return new Response(
    JSON.stringify({ ip, ts: Date.now() }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
