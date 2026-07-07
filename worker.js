addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const [first, second, ...rest] = segments;
  const isLang = (value) => value && value.length === 2;
  /* --------------------------------------------------
     /help
     /help/slug
  -------------------------------------------------- */
  if (first === 'help') {
    // /help
    if (!second) {
      event.respondWith(handleRoot(event, ''));
      return;
    }
    // /help/slug
    const slug = [second, ...rest].join('/');
    event.respondWith(handlePath(event, slug, ''));
    return;
  }
  /* --------------------------------------------------
     /en/help
     /hi/help
     /en/help/slug
  -------------------------------------------------- */
  if (isLang(first) && second === 'help') {
    const lang = first;
    if (!rest.length) {
      // /en/help
      event.respondWith(handleRoot(event, lang));
      return;
    } else {
      // /en/help/slug
      const slug = rest.join('/');
      event.respondWith(handlePath(event, slug, lang));
      return;
    }
  }
  /* --------------------------------------------------
     FALLBACK
  -------------------------------------------------- */
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    event.respondWith(new Response('Not Found (Fallback blocked in local dev to prevent infinite loop)', { status: 404 }));
  } else {
    event.respondWith(fetch(event.request));
  }
});
async function handleRoot(event, lang) {
  const originUrl = new URL('https://app.docstar.io/p');
  originUrl.searchParams.set('collectionId', 'vtYXax8DDrLB');
  if (lang) originUrl.searchParams.set('lang', lang);
  const init = {
    method: event.request.method,
    headers: new Headers({
      ...Object.fromEntries(event.request.headers),
      'techdoc-x-url-path': 'help',
      'techdoc-x-url-host': 'msg91.com'
    })
  };
  const response = await fetch(originUrl.toString(), { ...init, redirect: 'manual' });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
async function handlePath(event, slug, lang) {
  const originUrl = new URL(`https://app.docstar.io/p/${slug}`);
  originUrl.searchParams.set('collectionId', 'vtYXax8DDrLB');
  if (lang) originUrl.searchParams.set('lang', lang);
  const init = {
    method: event.request.method,
    headers: new Headers({
      ...Object.fromEntries(event.request.headers),
      'techdoc-x-url-path': 'help',
      'techdoc-x-url-host': 'msg91.com'
    }),
    body: event.request.body
  };
  const response = await fetch(originUrl.toString(), { ...init, redirect: 'manual' });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}