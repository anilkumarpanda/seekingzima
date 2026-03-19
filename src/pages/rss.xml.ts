import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const writing = (await getCollection('writing')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Seeking Zima — Anil Kumar Panda',
    description: 'Writing about ML, building products with AI, and systems thinking.',
    site: context.site!,
    items: writing.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/writing/${post.id}/`,
    })),
  });
}
