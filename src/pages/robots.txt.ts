import type { APIRoute } from 'astro';

// Тестовый поддомен не индексируется: robots.txt запрещает весь сайт.
// Для боевого домена собрать с SITE_INDEXABLE=true — тогда робот получит Allow.
export const GET: APIRoute = () => {
  const body =
    import.meta.env.SITE_INDEXABLE === 'true'
      ? 'User-agent: *\nAllow: /\n'
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
