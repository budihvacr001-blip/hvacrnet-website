// Cloudflare Pages Advanced Mode worker.
// 处理 www -> 非 www 的 301 永久重定向（保留 pathname 与 search）。
// 其余请求原样交给 env.ASSETS.fetch 服务静态资源（含预渲染 HTML、SPA fallback，
// 以及 _redirects/_headers 中的其它规则，如 /contact-form -> /contact）。
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const host = url.hostname.toLowerCase()
    if (host === 'www.hvacrnet.com') {
      return Response.redirect('https://hvacrnet.com' + url.pathname + url.search, 301)
    }
    return env.ASSETS.fetch(request)
  },
}