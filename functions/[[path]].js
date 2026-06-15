import { handleRequest } from '../worker/index.js'

const CANONICAL_ORIGIN = 'https://deepseek-tui.space'
const CANONICAL_HOST = 'deepseek-tui.space'
const LEGACY_HOSTS = new Set(['www.deepseek-tui.space'])

function maybeRedirectToCanonical(request) {
  const url = new URL(request.url)
  const isPagesPreview = url.hostname.endsWith('.pages.dev')
  if (isPagesPreview) return null

  if (url.protocol !== 'https:' || LEGACY_HOSTS.has(url.hostname)) {
    url.protocol = 'https:'
    url.hostname = CANONICAL_HOST
    return Response.redirect(url.toString(), 308)
  }
  return null
}

export function onRequest(context) {
  const url = new URL(context.request.url)
  if (url.pathname.startsWith('/api/')) {
    return handleRequest(context.request, context.env)
  }

  const redirect = maybeRedirectToCanonical(context.request)
  if (redirect) return redirect

  if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') {
    return handleRequest(context.request, context.env)
  }

  return context.next()
}
