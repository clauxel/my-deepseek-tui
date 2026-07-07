import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Code2,
  FileClock,
  GitBranch,
  Globe2,
  History,
  KeyRound,
  Laptop,
  Layers3,
  LockKeyhole,
  MonitorUp,
  Network,
  Play,
  RefreshCcw,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'
import { initializeAnalytics, syncAnalyticsPage } from './lib/analytics'

const defaultPublicAppOrigin = 'https://deepseek-tui.space'

type Billing = 'monthly' | 'annual'
type PlanId = 'starter' | 'pro' | 'team'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

const ctaPrimary = 'Checkout Pro annual'
const ctaSecondary = 'Checkout Starter annual'
const ctaTeam = 'Checkout Team annual'

const plans: Array<{
  id: PlanId
  name: string
  tagline: string
  monthlyUsd: number
  bullets: string[]
  popular?: boolean
}> = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Personal remote running for one developer.',
    monthlyUsd: 19,
    bullets: ['1 private remote workspace', 'Browser terminal runner', 'Session resume', 'Starter setup support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'More concurrency, persistent logs, and private workspaces.',
    monthlyUsd: 49,
    popular: true,
    bullets: ['3 concurrent agent sessions', 'Persistent run logs', 'Private workspace routing', 'Priority onboarding'],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Shared projects, member permissions, and audit records.',
    monthlyUsd: 149,
    bullets: ['Shared project workspaces', 'Member permissions', 'Audit records and exports', 'Remote runner rollout help'],
  },
]

const workflowCards = [
  {
    title: 'DeepSeek V4 auto routing',
    body: 'Resolve auto mode into the right V4 route before each request, then show what was used so cost never feels mysterious.',
    icon: <Activity size={20} />,
  },
  {
    title: 'Approvals before risk',
    body: 'Plan, Agent, and high-trust modes keep exploration, reviewed edits, and automation separate.',
    icon: <ShieldCheck size={20} />,
  },
  {
    title: 'Rollback you can explain',
    body: 'Side-git recovery and session history make the second hour of agent work less fragile than the first demo.',
    icon: <RefreshCcw size={20} />,
  },
  {
    title: 'Remote runner ready',
    body: 'Launch a browser-accessible terminal workspace without making every developer rebuild local environment glue.',
    icon: <MonitorUp size={20} />,
  },
]

const proofItems = [
  { label: 'Context window', value: '1M', detail: 'built for long repository sessions' },
  { label: 'Modes', value: '3', detail: 'Plan, Agent, and trusted automation' },
  { label: 'Annual savings', value: '50%', detail: 'selected by default at checkout' },
  { label: 'Workspace target', value: '<5 min', detail: 'from plan selection to onboarding' },
]

const modeRows = [
  ['Plan', 'Read-only exploration for unfamiliar repos and technical due diligence.'],
  ['Agent', 'Reviewed implementation with tool visibility and human confidence.'],
  ['YOLO', 'High-trust automation only for scoped, disposable, or controlled workspaces.'],
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing, endpoint = '/api/checkout') {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'deepseek-tui-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#10151f;color:#eef4ff;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#aeb9c8">Your DeepSeek-TUI Cloud payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin; setting location below still works. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function usePathnameSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)
    window.dispatchEvent(new PopStateEvent('popstate'))

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])


  useEffect(() => {
    initializeAnalytics()
  }, [])

  useEffect(() => {
    syncAnalyticsPage(pathname, search)
  }, [pathname, search])

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'deepseek-tui-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'deepseek-tui-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin; the fallback below handles direct visits. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?checkout=complete`)
  }, [publicAppOrigin])

  return (
    <main className="dst-main">
      <section className="dst-section dst-centered-section">
        <p className="dst-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="dst-muted">You will return to the homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = usePathnameSignal()
  const normalizedPath = normalizePathname(pathname)
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro')
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/runtime')
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (!cancelled && payload?.publicAppOrigin) {
          setPublicAppOrigin(payload.publicAppOrigin)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({
      pathname,
      routeView,
      publicAppOrigin,
      keywordPage,
    })
    syncSeoDocument(seo)
  }, [keywordPage, pathname, publicAppOrigin, routeView])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const allowed = new Set([window.location.origin, new URL(publicAppOrigin).origin])
    const onMessage = (event: MessageEvent) => {
      if (!allowed.has(event.origin)) return
      if (event.data?.type === 'deepseek-tui-checkout-complete') {
        setCheckoutModal(null)
        navigate('/?checkout=complete')
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate, publicAppOrigin])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      requestAnimationFrame(() => scrollToHashTarget(hash))
    }
  }, [pathname])

  const startHostedCheckout = useCallback(async (planId: PlanId, nextBilling: Billing, loadingKey: string, provider = 'polar') => {
    setSelectedPlanId(planId)
    setBilling(nextBilling)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'loading' })

    const popup = openCenteredCheckoutWindow()

    try {
      const url = await createCheckoutSession(planId, nextBilling, provider === 'polar' ? '/api/polar-checkout' : '/api/checkout')
      sendPopupToCheckout(popup, url)
      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'popup', checkoutUrl: url })
    } catch {
      try {
        if (popup && !popup.closed) popup.close()
      } catch {
        /* Nothing to clean up if the browser blocks access to the popup. */
      }
      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'retry' })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }, [])

  const goPricingWithAnnual = useCallback(() => {
    setBilling('annual')
    setSelectedPlanId('pro')
    navigate('/#pricing')
  }, [navigate])

  const startDefaultCheckout = useCallback(
    (loadingKey: string) => {
      void startHostedCheckout('pro', 'annual', loadingKey)
    },
    [startHostedCheckout],
  )

  const renderHeader = () => (
    <header className={`dst-header${headerCompact ? ' dst-header-compact' : ''}`}>
      <div className="dst-header-inner">
        <a
          className="dst-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <span className="dst-brand-mark" aria-hidden>
            <Terminal size={21} />
          </span>
          <span className="dst-brand-name">DeepSeek-TUI Cloud</span>
        </a>

        <nav className="dst-nav" aria-label="Primary">
          <a href="/#workspace" onClick={() => navigate('/#workspace')}>
            Workspace
          </a>
          <a href="/#features" onClick={() => navigate('/#features')}>
            Features
          </a>
          <a href="/#pricing" onClick={() => navigate('/#pricing')}>
            Pricing
          </a>
          <a
            href="/deepseek-tui-github"
            onClick={(event) => {
              event.preventDefault()
              navigate('/deepseek-tui-github')
            }}
          >
            GitHub guide
          </a>
        </nav>

        <button type="button" className="dst-btn dst-btn-ghost dst-header-cta" onClick={() => startDefaultCheckout('header-pro-annual')}>
          <Play size={16} />
          {ctaSecondary}
        </button>
      </div>
    </header>
  )

  const renderCheckoutModal = () => {
    if (!checkoutModal) return null

    const checkoutUrl = checkoutModal.status === 'popup' ? checkoutModal.checkoutUrl : undefined

    return (
      <div className="dst-checkout-backdrop" role="presentation">
        <section className="dst-checkout-modal dst-polar-popup-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button type="button" className="dst-checkout-close" aria-label="Close checkout" onClick={() => setCheckoutModal(null)}>
            <X size={18} />
          </button>
          {checkoutUrl ? (
            <div className="dst-polar-popup-copy">
              <p className="dst-eyebrow">Secure checkout</p>
              <h2 id="checkout-title">Polar checkout opened.</h2>
              <p className="dst-muted">
                Complete payment in the Polar window. This page stays open and returns to the homepage after success.
              </p>
              <a className="dst-btn dst-btn-primary" href={checkoutUrl} target="_blank" rel="noreferrer noopener">
                Reopen Polar checkout
              </a>
            </div>
          ) : checkoutModal.status === 'loading' ? (
            <div className="dst-polar-loading" aria-live="polite">
              <span />
              Opening Polar checkout...
            </div>
          ) : (
            <div className="dst-polar-error">
              <p>Polar checkout could not be opened. Please try again.</p>
              <div className="dst-checkout-actions">
                <button
                  type="button"
                  className="dst-btn dst-btn-primary"
                  onClick={() => void startHostedCheckout(checkoutModal.planId, checkoutModal.billing, checkoutModal.loadingKey)}
                  disabled={checkoutLoadingKey !== null}
                >
                  Open Polar checkout
                </button>
                <button type="button" className="dst-btn dst-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Review plans
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }

  const renderHome = () => {
    const checkoutComplete = new URLSearchParams(search).get('checkout') === 'complete'

    return (
      <main className="dst-main">
        {checkoutComplete ? (
          <section className="dst-success-banner">
            <CheckCircle2 size={18} />
            Payment received. Your DeepSeek TUI workspace onboarding will start from the email used at checkout.
          </section>
        ) : null}

        <section className="dst-hero" id="top">
          <div className="dst-hero-copy">
            <p className="dst-eyebrow">Hosted DeepSeek TUI workspace for DeepSeek-TUI</p>
            <h1>DeepSeek TUI in the browser, with the guardrails teams ask for.</h1>
            <p className="dst-lede">
              Launch a remote DeepSeek TUI workspace for DeepSeek-TUI: auto model routing, approval modes, session resume,
              rollback, MCP, audit-ready logs, and a checkout path that keeps Pro annual selected by default.
            </p>

            <div className="dst-hero-actions">
              <button type="button" className="dst-btn dst-btn-primary" onClick={() => startDefaultCheckout('hero-pro-annual')}>
                <MonitorUp size={18} />
                {ctaPrimary}
              </button>
              <button type="button" className="dst-btn dst-btn-ghost" onClick={goPricingWithAnnual}>
                <Globe2 size={18} />
                {ctaSecondary}
              </button>
              <button type="button" className="dst-btn dst-btn-subtle" onClick={() => void startHostedCheckout('team', 'annual', 'hero-team-annual')}>
                <Users size={18} />
                {ctaTeam}
              </button>
            </div>

            <div className="dst-hero-trust">
              <span>Pro annual selected by default</span>
              <span>50% annual savings</span>
              <span>Returns home after payment</span>
            </div>
          </div>

          <aside className="dst-terminal-preview" aria-label="DeepSeek TUI workspace preview">
            <div className="dst-terminal-bar">
              <div>
                <span />
                <span />
                <span />
              </div>
              <strong>deepseek-tui.cloud/session/pro</strong>
            </div>
            <div className="dst-terminal-body">
              <div className="dst-terminal-row dst-terminal-row-active">
                <Terminal size={16} />
                <span>Agent mode - DeepSeek V4 Pro - private workspace</span>
              </div>
              <pre>{`> inspect src/api/checkout.ts
> plan safe Cloudflare Worker patch
> run tests --changed

approval required:
  edit worker/index.js
  create checkout session

estimated cost: $0.18
rollback ref: side-git:7f4a2`}</pre>
              <div className="dst-terminal-footer">
                <span>1M context</span>
                <span>MCP ready</span>
                <span>audit logs</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="dst-proof-strip" aria-label="Product proof points">
          {proofItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="dst-section dst-screenshot-section" id="workspace">
          <div className="dst-section-head">
            <p className="dst-eyebrow">Workspace first</p>
            <h2>Start with the actual agent surface, not a slide deck.</h2>
            <p>
              DeepSeek TUI is a terminal coding agent. DeepSeek-TUI gives the open-source workflow its project identity, while
              this hosted version should feel like opening a ready workspace:
              choose the plan, launch the browser terminal, keep approvals visible, and preserve the session record.
            </p>
          </div>
          <div className="dst-screenshot-grid">
            <div className="dst-screenshot-frame">
              <img src="/deepseek-tui-screenshot.png" alt="DeepSeek TUI terminal interface preview for DeepSeek-TUI" />
            </div>
            <div className="dst-workspace-panel">
              <h3>What happens after checkout</h3>
              <div className="dst-step-list">
                {[
                  ['01', 'Private workspace created', 'A remote runner is prepared with browser access and terminal-first defaults.'],
                  ['02', 'DeepSeek API path verified', 'Onboarding checks model routing, cost reporting, and safe key handling.'],
                  ['03', 'Team mode selected', 'Plan, Agent, and trusted automation modes are explained before broad execution.'],
                  ['04', 'Session history retained', 'Persistent logs and rollback references make review and recovery realistic.'],
                ].map(([step, title, body]) => (
                  <article key={title} className="dst-step">
                    <span>{step}</span>
                    <div>
                      <strong>{title}</strong>
                      <p>{body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dst-section" id="features">
          <div className="dst-section-head">
            <p className="dst-eyebrow">Why teams convert</p>
            <h2>The features that make a coding agent feel safe enough to buy.</h2>
            <p>
              The open-source project already has the interesting primitives. The SaaS value is packaging them into a
              remote workspace with default choices, visible cost, and a checkout flow that does not interrupt momentum.
            </p>
          </div>
          <div className="dst-card-grid dst-card-grid-4">
            {workflowCards.map((card) => (
              <article className="dst-card" key={card.title}>
                <div className="dst-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dst-section dst-mode-section">
          <div className="dst-mode-copy">
            <p className="dst-eyebrow">Mode discipline</p>
            <h2>Power is useful only when the team knows which mode it is in.</h2>
            <p>
              The first-screen pitch is intentionally simple: launch a remote workspace, run it in the browser, then
              choose whether this is a solo session, a Pro private workflow, or a Team agent session.
            </p>
            <button type="button" className="dst-btn dst-btn-primary" onClick={() => startDefaultCheckout('mode-pro-annual')}>
              <ArrowRight size={18} />
              {ctaPrimary}
            </button>
          </div>
          <div className="dst-mode-table">
            {modeRows.map(([mode, body]) => (
              <article key={mode}>
                <strong>{mode}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dst-section" id="use-cases">
          <div className="dst-section-head">
            <p className="dst-eyebrow">Use cases</p>
            <h2>Built for remote coding sessions that need a paper trail.</h2>
          </div>
          <div className="dst-card-grid dst-card-grid-3">
            {[
              {
                title: 'Remote bug-fix runner',
                body: 'Give the agent a scoped workspace, run diagnostics, patch a narrow issue, and keep the log for review.',
                icon: <ServerCog size={20} />,
              },
              {
                title: 'Private repo onboarding',
                body: 'Use Plan mode to map a repository, then Agent mode to make the first reviewed change.',
                icon: <LockKeyhole size={20} />,
              },
              {
                title: 'Team audit workflow',
                body: 'Persist session intent, commands, changed files, validation outcomes, model route, and rollback reference.',
                icon: <ClipboardCheck size={20} />,
              },
            ].map((card) => (
              <article className="dst-card" key={card.title}>
                <div className="dst-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        {renderPricing()}

        <section className="dst-section">
          <div className="dst-section-head">
            <p className="dst-eyebrow">Useful pages</p>
            <h2>DeepSeek-TUI evaluation guides</h2>
            <p>
              These pages answer the searches people make before they buy: GitHub, Reddit, API, pricing, alternatives,
              remote runners, SSH agent workflows, and audit logs.
            </p>
          </div>
          <div className="dst-guide-grid">
            {keywordPages.slice(0, 8).map((page) => (
              <a
                className="dst-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const renderPricing = () => (
    <section className="dst-section dst-pricing-section" id="pricing">
      <div className="dst-pricing-head">
        <div>
          <p className="dst-eyebrow">Pricing</p>
          <h2>Pro annual is the default for serious pilots.</h2>
          <p>Annual billing is selected by default and is 50% cheaper than paying monthly.</p>
        </div>
        <div className="dst-cycle" role="group" aria-label="Billing cycle">
          <button type="button" data-active={billing === 'monthly' ? 'true' : 'false'} onClick={() => setBilling('monthly')}>
            Monthly
          </button>
          <button type="button" data-active={billing === 'annual' ? 'true' : 'false'} onClick={() => setBilling('annual')}>
            Annual - 50% off
          </button>
        </div>
      </div>

      <div className="dst-plan-grid">
        {plans.map((plan) => {
          const monthly = billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd
          const strike = billing === 'annual' ? plan.monthlyUsd : null
          const loadingKey = `plan-${plan.id}-${billing}`
          return (
            <article className="dst-plan-card" data-popular={plan.popular ? 'true' : 'false'} key={plan.id}>
              {plan.popular ? <span className="dst-plan-badge">Default choice</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.tagline}</p>
              <div className="dst-price-line">
                {formatMoney(monthly)}
                <small>/mo</small>
                {strike ? <span>{formatMoney(strike)}</span> : null}
              </div>
              <strong className="dst-billing-note">
                {billing === 'annual' ? `${formatMoney(monthly * 12)} billed annually` : 'Billed monthly'}
              </strong>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={15} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={plan.popular ? 'dst-btn dst-btn-primary' : 'dst-btn dst-btn-ghost'}
                data-billing={billing}
                data-checkout
                data-plan-id={plan.id}
                data-polar-checkout
                onClick={() => void startHostedCheckout(plan.id, billing, loadingKey)}
                onMouseEnter={() => setSelectedPlanId(plan.id)}
                disabled={checkoutLoadingKey !== null}
              >
                {checkoutLoadingKey === loadingKey
                  ? 'Starting secure checkout...'
                  : plan.id === 'team'
                    ? ctaTeam
                    : plan.id === 'starter'
                      ? ctaSecondary
                      : ctaPrimary}
              </button>
                <button
                  type="button"
                  className="dst-btn dst-btn-ghost"
                  onClick={() => void startHostedCheckout(plan.id, billing, `${loadingKey}-wallet`, 'polar')}
                  disabled={checkoutLoadingKey !== null}
                >
                  {checkoutLoadingKey === `${loadingKey}-wallet` ? 'Opening USDC wallet...' : 'Pay with USDC Wallet'}
                </button>
              {selectedPlanId === plan.id ? <span className="dst-plan-selected">Selected</span> : null}
            </article>
          )
        })}
      </div>
    </section>
  )

  const renderKeywordPage = (page: KeywordPage) => (
    <main className="dst-main">
      <article className="dst-article">
        <a
          className="dst-back-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <ArrowRight size={16} />
          Back to DeepSeek-TUI Cloud
        </a>
        <p className="dst-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="dst-lede">{page.lede}</p>
        <div className="dst-article-intent">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>Questions worth answering before checkout</h2>
          <div className="dst-faq-list">
            {page.faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="dst-article-cta">
          <div>
            <p className="dst-eyebrow">Recommended next step</p>
            <h2>Start with Pro annual and keep the first session reviewable.</h2>
            <p>Launch the hosted workspace, keep annual savings applied, and use persistent logs before expanding to a team session.</p>
          </div>
          <button type="button" className="dst-btn dst-btn-primary" onClick={() => startDefaultCheckout(`article-${page.path}`)}>
            <MonitorUp size={18} />
            {ctaPrimary}
          </button>
        </aside>
      </article>
    </main>
  )

  const renderPrivacy = () => (
    <main className="dst-main">
      <article className="dst-article">
        <p className="dst-eyebrow">Privacy</p>
        <h1>Privacy Policy</h1>
        <p className="dst-lede">
          DeepSeek-TUI Cloud collects only the information needed to run checkout, onboard hosted workspaces, provide
          support, and maintain the service.
        </p>
        <section>
          <h2>What we process</h2>
          <p>We process account contact details, payment metadata from Polar, workspace onboarding information, support messages, and limited operational analytics.</p>
          <h2>Credentials</h2>
          <p>Never paste private keys or model credentials into support messages. Workspace setup should use scoped, revocable secrets and least-privilege access.</p>
          <h2>Retention</h2>
          <p>Operational records are retained only as long as needed for support, billing, abuse prevention, and product reliability.</p>
        </section>
      </article>
    </main>
  )

  const renderTerms = () => (
    <main className="dst-main">
      <article className="dst-article">
        <p className="dst-eyebrow">Terms</p>
        <h1>Terms of Service</h1>
        <p className="dst-lede">
          By using DeepSeek-TUI Cloud, you agree to use the hosted workspace lawfully, keep credentials secure, and pay
          plan fees when due.
        </p>
        <section>
          <h2>Service</h2>
          <p>Plans provide access to hosted workspace onboarding and related support. The open-source DeepSeek-TUI project remains independently maintained by its authors.</p>
          <h2>Payments</h2>
          <p>Payments are processed by Polar. Annual billing is discounted as shown at checkout and returns to the homepage after successful payment.</p>
          <h2>Acceptable use</h2>
          <p>Do not use the service to access systems you do not control, bypass security policies, exfiltrate secrets, or run harmful automation.</p>
        </section>
      </article>
    </main>
  )

  const renderNotFound = () => (
    <main className="dst-main">
      <section className="dst-section dst-centered-section">
        <p className="dst-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="dst-muted">That route is not available.</p>
        <button type="button" className="dst-btn dst-btn-primary" onClick={() => navigate('/')}>
          Return home
        </button>
      </section>
    </main>
  )

  let body: React.ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'privacy') {
    body = renderPrivacy()
  } else if (routeView === 'terms') {
    body = renderTerms()
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="dst-shell">
      <div className="dst-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="dst-footer">
        <div className="dst-footer-inner">
          <span>DeepSeek-TUI Cloud</span>
          <a href="/privacy" onClick={(event) => { event.preventDefault(); navigate('/privacy') }}>
            Privacy
          </a>
          <a href="/terms" onClick={(event) => { event.preventDefault(); navigate('/terms') }}>
            Terms
          </a>
          <a href="https://github.com/Hmbown/DeepSeek-TUI" target="_blank" rel="noreferrer">
            Upstream GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
