export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordPage = {
  path: string
  title: string
  description: string
  h1: string
  eyebrow: string
  lede: string
  intent: string
  sections: KeywordSection[]
  faqs: Array<{ question: string; answer: string }>
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/deepseek-tui-reddit',
    title: 'DeepSeek TUI Reddit Questions, Answered',
    description:
      'A practical DeepSeek TUI Reddit-style guide: setup risk, model routing, cost control, approvals, rollback, and when a hosted workspace is worth it.',
    h1: 'DeepSeek TUI Reddit questions, without the noise',
    eyebrow: 'Community checklist',
    intent: 'For buyers and builders comparing field reports before installing a terminal agent.',
    lede:
      'Reddit threads around terminal agents usually circle the same worries: will it touch the wrong files, burn API spend, hide reasoning, or become another tool nobody maintains? This page answers those questions in a buyer-safe way.',
    sections: [
      {
        heading: 'What people usually want to know first',
        paragraphs: [
          'DeepSeek-TUI is a local terminal coding agent, so the first evaluation should focus on control. Plan mode is for read-only exploration, Agent mode keeps approvals in the loop, and YOLO mode belongs only in trusted sandboxes.',
          'The hosted layer here is designed for teams that want the same terminal-first workflow but need onboarding, preset guardrails, browser access, and a predictable billing path before rolling it to more developers.',
        ],
        bullets: [
          'Start in Plan mode for unfamiliar repositories.',
          'Use Agent mode when edits should be reviewed before they land.',
          'Reserve YOLO mode for disposable or tightly scoped workspaces.',
          'Track cost per turn, not only total API spend at the end of a session.',
        ],
      },
      {
        heading: 'What a sensible Reddit answer would recommend',
        paragraphs: [
          'Do not judge a coding agent from one screenshot. Run a small task: inspect a bug, make a narrow patch, review the diff, resume the session, then roll it back. That sequence tests the product in the places where teams actually get nervous.',
          'If the local install feels powerful but too open-ended for a team pilot, use a hosted workspace with preset modes, model routing, and support so the first week has boundaries.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is DeepSeek-TUI safe to run on a private repo?',
        answer:
          'Treat it like any local coding agent. Use read-only exploration first, review tool approvals, keep API keys out of prompts, and test rollback before using broad automation modes.',
      },
      {
        question: 'Why would a hosted workspace help?',
        answer:
          'A hosted workspace adds onboarding, plan defaults, cost visibility, and a cleaner path for teams that do not want every developer hand-wiring a local setup.',
      },
    ],
  },
  {
    path: '/deepseek-tui-github',
    title: 'DeepSeek TUI GitHub Guide for Technical Evaluation',
    description:
      'Use the DeepSeek-TUI GitHub repository wisely: features to inspect, install paths to compare, and a practical checklist before choosing hosted or local use.',
    h1: 'DeepSeek-TUI on GitHub: what to inspect before you adopt it',
    eyebrow: 'Repository guide',
    intent: 'For teams moving from GitHub curiosity to a real adoption decision.',
    lede:
      'The repository is the source of truth. It shows the terminal runtime, Rust binaries, install paths, modes, MCP support, session resume, rollback, HTTP/SSE server mode, and cost reporting. This page turns that into an evaluation checklist.',
    sections: [
      {
        heading: 'Start with the operational features',
        paragraphs: [
          'The headline is not just "chat in a terminal." DeepSeek-TUI includes model auto-routing, thinking-mode streaming, tool approvals, sub-agents, MCP servers, LSP diagnostics, session save/resume, and a side-git rollback system.',
          'Those features matter because coding agents fail adoption when teams cannot see what changed, recover from a bad turn, or explain cost after a long session.',
        ],
        bullets: [
          'Verify install path: npm wrapper, Cargo binaries, Homebrew, Scoop, or direct releases.',
          'Check whether your OS target has prebuilt binaries.',
          'Read the mode behavior before enabling broad tool access.',
          'Confirm your DeepSeek API key flow and provider mapping.',
        ],
      },
      {
        heading: 'When GitHub is enough, and when SaaS is cleaner',
        paragraphs: [
          'GitHub is ideal for source review, local install, and custom workflows. A SaaS layer is cleaner when the team wants one guided launch surface, billing clarity, support, browser-based workspace handoff, and default guardrails around model and approval choices.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this site the official GitHub repository?',
        answer:
          'No. The official open-source repository is Hmbown/DeepSeek-TUI on GitHub. This site is an independent hosted product layer and evaluation guide around that workflow.',
      },
      {
        question: 'What should I check in the repo first?',
        answer:
          'Read the README, install notes, architecture docs, mode docs, configuration docs, MCP docs, and changelog before a team pilot.',
      },
    ],
  },
  {
    path: '/deepseek-v4',
    title: 'DeepSeek V4 for Terminal Coding Agents',
    description:
      'Understand DeepSeek V4 in a terminal coding workflow: auto routing, 1M context, reasoning visibility, cache-aware costs, and practical model selection.',
    h1: 'DeepSeek V4 as a terminal coding engine',
    eyebrow: 'Model workflow',
    intent: 'For users who care less about model hype and more about how V4 changes daily coding work.',
    lede:
      'DeepSeek V4 becomes more useful when the product around it can route tasks, expose reasoning, manage long context, and report cost. DeepSeek-TUI is interesting because it turns those model traits into a keyboard-driven coding workflow.',
    sections: [
      {
        heading: 'The V4 workflow advantage',
        paragraphs: [
          'Long-context coding work is not just about stuffing more files into a prompt. The agent needs session state, compaction, diagnostics, rollback, and a clear mode system so large context does not become large risk.',
          'Auto mode is useful because small turns can stay cheap while heavier debugging, architecture, or release work can move to stronger routing when needed.',
        ],
        bullets: [
          'Use Flash-style routing for short, repetitive, or low-risk turns.',
          'Use Pro-style routing for hard edits, debugging, security review, and ambiguous work.',
          'Watch cache hit and miss reporting before declaring a workflow expensive.',
        ],
      },
      {
        heading: 'How DeepSeek-TUI Cloud packages it',
        paragraphs: [
          'The SaaS surface starts with recommended annual Pro because most serious pilots need saved sessions, model routing, rollback confidence, and support. The pricing is intentionally visible before checkout so model cost anxiety does not block conversion later.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does auto mode send model auto to the upstream API?',
        answer:
          'No. The TUI resolves auto into a concrete model and thinking level before the real request, then reports the route used for that turn.',
      },
      {
        question: 'Why does 1M context matter?',
        answer:
          'It helps when a coding task needs broad repository awareness, but it only pays off when paired with compaction, diagnostics, and cost reporting.',
      },
    ],
  },
  {
    path: '/opencode-deepseek-v4',
    title: 'OpenCode DeepSeek V4 vs DeepSeek-TUI',
    description:
      'Compare OpenCode DeepSeek V4 workflows with DeepSeek-TUI: terminal control, approvals, rollback, model routing, and hosted team adoption.',
    h1: 'OpenCode DeepSeek V4 or DeepSeek-TUI?',
    eyebrow: 'Comparison',
    intent: 'For developers comparing terminal agent workflows before settling on one daily tool.',
    lede:
      'OpenCode-style workflows and DeepSeek-TUI both appeal to developers who want AI close to the codebase. The real question is not which name sounds better; it is how much control, rollback, provider routing, and team rollout support you need.',
    sections: [
      {
        heading: 'A fair comparison axis',
        paragraphs: [
          'Choose the tool by workflow shape. If you want a keyboard-first terminal agent with explicit modes, session resume, rollback, MCP, LSP diagnostics, and DeepSeek V4 auto routing, DeepSeek-TUI is built around that surface.',
          'If your existing editor or agent stack already fits your team and only needs a model swap, the migration pressure is lower. The best pilot compares one real task in both tools.',
        ],
        bullets: [
          'Run the same bug fix in both workflows.',
          'Measure review clarity, not only completion speed.',
          'Compare rollback and resume behavior after a bad turn.',
          'Check how each workflow reports model and token cost.',
        ],
      },
      {
        heading: 'When hosted DeepSeek-TUI wins',
        paragraphs: [
          'Hosted DeepSeek-TUI is strongest when the team wants a shared launch path, recommended defaults, support, and a checkout-to-workspace motion instead of every developer assembling local config from scratch.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should I switch if my OpenCode workflow already works?',
        answer:
          'Only if DeepSeek-TUI gives you clearer terminal control, better cost visibility, stronger rollback, or an easier team rollout for your actual work.',
      },
      {
        question: 'What is the fastest proof of value?',
        answer:
          'Pick a real repository task, require a diff review, resume the session once, and test rollback. That covers the points where agents usually succeed or fail.',
      },
    ],
  },
  {
    path: '/deepseek-api',
    title: 'DeepSeek API Setup for DeepSeek-TUI',
    description:
      'A practical DeepSeek API guide for terminal agents: API keys, provider settings, model routing, cost control, and hosted onboarding.',
    h1: 'DeepSeek API setup for a terminal agent',
    eyebrow: 'API guide',
    intent: 'For users who are ready to connect an API key and want fewer setup surprises.',
    lede:
      'The DeepSeek API is the engine. The terminal agent is the operating layer around it. A good setup keeps keys out of chat, routes models intentionally, and makes cost visible while work is happening.',
    sections: [
      {
        heading: 'Local setup checklist',
        paragraphs: [
          'DeepSeek-TUI can prompt for an API key on first launch, store it in local config, or read it from environment variables. For team use, document which path is approved and how key rotation works.',
          'A hosted workspace can reduce setup variance by keeping the purchase path, workspace defaults, support flow, and model route recommendation in one place.',
        ],
        bullets: [
          'Create the key from the official DeepSeek platform.',
          'Avoid pasting secrets into prompts or issue threads.',
          'Run the built-in doctor command after setup.',
          'Use provider-specific config only when you know why you need it.',
        ],
      },
      {
        heading: 'Cost controls to care about',
        paragraphs: [
          'The API bill is easier to manage when the agent reports the actual model used, token usage, reasoning output, and cache behavior. DeepSeek-TUI is valuable because cost is visible at the turn level instead of arriving as a surprise later.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I use environment variables instead of saved config?',
        answer:
          'Yes. Environment variables are useful in scripted or ephemeral environments, while saved local config is often smoother for daily terminal work.',
      },
      {
        question: 'Does the hosted plan include the DeepSeek API itself?',
        answer:
          'The hosted plan covers the workspace layer. Model/API usage can depend on the provider and account terms shown during onboarding.',
      },
    ],
  },
  {
    path: '/deepseek-platform',
    title: 'DeepSeek Platform: From API Key to Coding Workspace',
    description:
      'Move from the DeepSeek platform to a practical terminal coding workspace with model routing, approvals, rollback, and team-ready onboarding.',
    h1: 'From DeepSeek platform to working coding agent',
    eyebrow: 'Platform bridge',
    intent: 'For users who already understand the model platform and now need a practical coding interface.',
    lede:
      'The DeepSeek platform gives you access to models and keys. DeepSeek-TUI turns that access into a coding environment with modes, tools, sessions, diagnostics, rollback, and cost reporting.',
    sections: [
      {
        heading: 'What the platform does not solve by itself',
        paragraphs: [
          'A model endpoint does not decide when tools need approval, how to resume a failed session, how to isolate workspace changes, or how to explain cost to a lead developer. Those are product and workflow decisions.',
          'The Cloud plan wraps those decisions into a buyer-friendly launch: choose plan, choose annual savings, open checkout, then start from recommended defaults.',
        ],
        bullets: [
          'Model access: handled by the platform.',
          'Coding workflow: handled by DeepSeek-TUI.',
          'Team rollout and support: handled by the hosted layer.',
        ],
      },
      {
        heading: 'The practical handoff',
        paragraphs: [
          'Start by confirming the API key works, then run a narrow task in Agent mode. After that, evaluate the hosted plan if you need repeatable workspace creation, support, billing clarity, and a shared way for non-terminal-heavy stakeholders to understand the value.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is the DeepSeek platform enough for developers?',
        answer:
          'It is enough for model access. Developers still need a workflow layer for files, shell commands, approvals, sessions, and rollback.',
      },
      {
        question: 'Where should a company pilot begin?',
        answer:
          'Begin with one repository, one approval mode, one cost budget, and one measurable task outcome.',
      },
    ],
  },
  {
    path: '/deepseek-pricing',
    title: 'DeepSeek Pricing and Hosted DeepSeek-TUI Plans',
    description:
      'Understand DeepSeek pricing in a terminal-agent workflow, then compare hosted DeepSeek-TUI plans with annual billing selected by default.',
    h1: 'DeepSeek pricing, translated into coding-agent decisions',
    eyebrow: 'Pricing guide',
    intent: 'For teams trying to avoid model-bill surprises before starting a paid workspace.',
    lede:
      'Model pricing and SaaS pricing are different costs. The model bill depends on context, output, reasoning, and cache behavior. The hosted plan covers the workspace layer: launch flow, defaults, support, and team-ready packaging.',
    sections: [
      {
        heading: 'How to forecast the model side',
        paragraphs: [
          'For terminal agents, cost is driven by how often you attach broad context, how much output the agent produces, whether reasoning tokens are billed, and whether prefix cache is hit. DeepSeek-TUI exposes those signals during work.',
          'Use a small pilot budget before broad rollout. One real debugging task tells you more than a spreadsheet of theoretical token counts.',
        ],
        bullets: [
          'Watch cache hit versus cache miss.',
          'Use auto mode for mixed task complexity.',
          'Reserve high-thinking turns for hard work.',
          'Track cost by session so teams can compare workflows.',
        ],
      },
      {
        heading: 'How to read our hosted plans',
        paragraphs: [
          'The middle plan is selected by default because most teams need session history, rollback confidence, and priority setup help. Annual billing is selected by default because it cuts the effective monthly price in half and reduces checkout hesitation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is annual selected by default?',
        answer:
          'Annual billing is 50% cheaper than monthly here, and most serious pilots need enough time to evaluate recurring workflows rather than one isolated task.',
      },
      {
        question: 'Does this replace official DeepSeek pricing?',
        answer:
          'No. Always check the official DeepSeek pricing page for current model rates. This page explains how those rates show up in terminal-agent usage.',
      },
    ],
  },
  {
    path: '/deepseek-v4-openclaw',
    title: 'DeepSeek V4 OpenClaw Workflows',
    description:
      'Plan DeepSeek V4 OpenClaw-style workflows with terminal agents, approval modes, rollback, hosted onboarding, and team-safe automation.',
    h1: 'DeepSeek V4 OpenClaw workflows for real teams',
    eyebrow: 'Workflow design',
    intent: 'For builders thinking about DeepSeek V4 plus OpenClaw-style agent orchestration.',
    lede:
      'OpenClaw-style work is about turning agent power into dependable operations: scoped workspaces, clear approvals, tool visibility, memory, repeatable tasks, and recovery when automation goes sideways.',
    sections: [
      {
        heading: 'What to standardize first',
        paragraphs: [
          'Before adding more agents, standardize how a single DeepSeek V4 terminal session explores, edits, validates, and rolls back. DeepSeek-TUI gives that baseline with modes, sessions, diagnostics, and side-git recovery.',
          'Once that baseline feels predictable, orchestration becomes less scary because every worker follows a visible operating model.',
        ],
        bullets: [
          'Plan mode for exploration.',
          'Agent mode for reviewed implementation.',
          'YOLO only for trusted and isolated automation.',
          'Session resume and rollback as required pilot checks.',
        ],
      },
      {
        heading: 'Where the hosted layer fits',
        paragraphs: [
          'Hosted DeepSeek-TUI Cloud gives teams a shared place to start before expanding into broader OpenClaw automation. It packages the purchase, default plan, annual discount, and onboarding into one clean path.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is OpenClaw required to use DeepSeek-TUI?',
        answer:
          'No. DeepSeek-TUI can be used on its own. OpenClaw-style orchestration becomes relevant when you want repeatable, multi-agent workflows around it.',
      },
      {
        question: 'What is the safest first OpenClaw-style pilot?',
        answer:
          'Run one repository task with clear approval gates, capture cost and diffs, then test rollback. Add parallelism only after that baseline is boring.',
      },
    ],
  },
  {
    path: '/deepseek-tui-team-workspace',
    title: 'DeepSeek-TUI Team Workspace Guide',
    description:
      'Design a DeepSeek-TUI team workspace with shared defaults, safe approval modes, session handoff, cost visibility, and a cleaner path from pilot to rollout.',
    h1: 'DeepSeek-TUI team workspace: how to make agents adoptable',
    eyebrow: 'Team rollout',
    intent: 'For engineering leads turning a promising local terminal agent into a workflow multiple developers can trust.',
    lede:
      'A single developer can tolerate rough edges in a terminal agent. A team needs defaults: which mode to use, how rollback works, where sessions live, how API cost is tracked, and who can approve broader automation.',
    sections: [
      {
        heading: 'What a team workspace should standardize',
        paragraphs: [
          'The first win is not maximum autonomy. It is repeatability. Everyone should know the difference between planning, reviewed edits, and high-trust automation before the tool touches a shared repository.',
          'DeepSeek-TUI Cloud packages those decisions into a recommended Pro annual workspace so the first rollout has sessions, rollback discipline, setup help, and cost expectations from day one.',
        ],
        bullets: [
          'Default to reviewed Agent mode for implementation.',
          'Use Plan mode for onboarding, audit, and unfamiliar codebases.',
          'Require rollback checks before enabling broad automation.',
          'Track cost and model route per session.',
        ],
      },
      {
        heading: 'The pilot that proves team value',
        paragraphs: [
          'Pick one repository and one measurable workflow: triage a bug, make the patch, run validation, review the diff, resume the session, and roll back once. If that loop feels calm, the team workspace is ready to expand.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why not let every developer configure local DeepSeek-TUI alone?',
        answer:
          'Local setup is fine for enthusiasts. A shared workspace helps teams agree on modes, support, billing, and rollout practices before agent usage becomes inconsistent.',
      },
      {
        question: 'Which plan fits a team pilot?',
        answer:
          'The Pro annual plan is the default recommendation because it balances session history, rollback-focused onboarding, and 50% annual savings.',
      },
    ],
  },
  {
    path: '/deepseek-tui-remote-runner',
    title: 'DeepSeek-TUI Remote Runner Workflow',
    description:
      'Plan a DeepSeek-TUI remote runner setup for cloud workspaces, SSH access, approval gates, long-running tasks, and safer coding automation.',
    h1: 'DeepSeek-TUI remote runner: terminal power without local setup drag',
    eyebrow: 'Remote execution',
    intent: 'For users who want terminal-agent work close to a cloud workspace instead of every laptop.',
    lede:
      'Remote runners are useful when repositories are heavy, environments are hard to reproduce, or a team wants agent work contained away from personal machines. The goal is not mystery automation; it is a visible runner with clear approvals.',
    sections: [
      {
        heading: 'When remote execution is worth it',
        paragraphs: [
          'Use a remote runner when setup time, dependency drift, or machine access slows the team more than the agent itself. The runner should make commands reproducible, keep sessions resumable, and expose enough logs for a human to review what happened.',
          'DeepSeek-TUI Cloud is positioned for this kind of controlled launch: a hosted workspace, DeepSeek V4 routing, and checkout-to-onboarding flow without making every buyer become an infrastructure engineer first.',
        ],
        bullets: [
          'Heavy monorepos with slow local bootstrap.',
          'Private dependency networks or internal services.',
          'Short-lived review environments.',
          'Teams that need a consistent approval policy.',
        ],
      },
      {
        heading: 'Runner safety checklist',
        paragraphs: [
          'Keep the runner scoped. Use least-privilege credentials, short-lived access, explicit approval modes, and a rollback path. Remote does not mean unattended; it means the environment is easier to reproduce and observe.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is a remote runner safer than local use?',
        answer:
          'It can be safer when access is scoped, credentials are isolated, and logs are reviewable. Poorly configured remote execution is just local risk moved somewhere else.',
      },
      {
        question: 'Does every DeepSeek-TUI user need a remote runner?',
        answer:
          'No. Solo users can start locally. Remote runners become valuable when setup consistency, team policy, or environment size becomes the blocker.',
      },
    ],
  },
  {
    path: '/deepseek-tui-alternative',
    title: 'DeepSeek-TUI Alternative Checklist',
    description:
      'Compare DeepSeek-TUI alternatives by terminal workflow, model routing, approval modes, rollback, MCP, auditability, and hosted team adoption.',
    h1: 'DeepSeek-TUI alternative: compare the workflow, not the logo',
    eyebrow: 'Buyer comparison',
    intent: 'For developers comparing coding agents and trying to choose the one that will survive real work.',
    lede:
      'Most coding-agent alternatives sound similar in a feature list. The separation shows up during the second hour: can you resume context, review tool calls, recover from a bad edit, track cost, and keep working in the terminal without fighting the interface?',
    sections: [
      {
        heading: 'Comparison criteria that matter',
        paragraphs: [
          'A good DeepSeek-TUI alternative must compete on terminal ergonomics, explicit modes, provider/model routing, MCP compatibility, LSP diagnostics, rollback, and session continuity. If it only compares model names, it is not a serious comparison.',
          'The hosted version here should be judged on adoption friction: how quickly a team can choose a plan, launch a workspace, understand annual savings, and keep the checkout flow focused.',
        ],
        bullets: [
          'Can you see and approve tool use clearly?',
          'Can you roll back agent work without guessing?',
          'Does it report token and cost data by session?',
          'Can it work with your terminal, editor, and remote workspace habits?',
        ],
      },
      {
        heading: 'When DeepSeek-TUI is the better choice',
        paragraphs: [
          'Choose DeepSeek-TUI when your team values a terminal-native agent, DeepSeek V4 routing, long-context work, visible approvals, rollback, and a product path that can move from local evaluation to hosted team onboarding.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the most common mistake when comparing alternatives?',
        answer:
          'Comparing only model quality. The workflow layer matters just as much: approvals, rollback, session continuity, diagnostics, and cost reporting decide whether teams keep using the tool.',
      },
      {
        question: 'Should I test multiple tools?',
        answer:
          'Yes. Run the same real task in each tool, require validation, inspect the diff, resume the session, and test rollback before deciding.',
      },
    ],
  },
  {
    path: '/deepseek-tui-pricing',
    title: 'DeepSeek-TUI Pricing and Plan Selection',
    description:
      'Compare DeepSeek-TUI Cloud pricing plans, annual 50% savings, recommended Pro defaults, and how hosted workspace pricing differs from model API usage.',
    h1: 'DeepSeek-TUI pricing: choose the plan around workflow risk',
    eyebrow: 'Plan guide',
    intent: 'For buyers who want a clear pricing explanation before opening hosted checkout.',
    lede:
      'Pricing should reduce anxiety, not create it. DeepSeek-TUI Cloud separates the hosted workspace plan from the underlying model/API usage, then defaults to Pro annual because most real pilots need enough time and support to prove recurring value.',
    sections: [
      {
        heading: 'Why Pro annual is selected by default',
        paragraphs: [
          'The middle plan is the sensible starting point for serious users: it covers the recurring workflows most teams test first without pushing everyone into enterprise pricing. Annual billing is selected because it is 50% cheaper than paying monthly.',
          'If you are only curious, start smaller. If you are standardizing multiple teams, move upward once usage patterns are measurable.',
        ],
        bullets: [
          'Starter: personal evaluation and first workspace.',
          'Pro: recommended for team pilots and repeat coding sessions.',
          'Team: shared projects, member permissions, audit records, and remote workflow help.',
        ],
      },
      {
        heading: 'How model costs fit in',
        paragraphs: [
          'Hosted pricing covers the workspace layer, checkout flow, defaults, and support. Model costs depend on your DeepSeek API usage, context size, output, reasoning, and cache behavior. The product should keep those signals visible instead of hiding them.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is this page separate from DeepSeek pricing?',
        answer:
          'DeepSeek pricing covers model usage. DeepSeek-TUI Cloud pricing covers the hosted workspace and adoption layer around that usage.',
      },
      {
        question: 'Can I pay monthly?',
        answer:
          'Yes. Monthly is available, but annual is the default because it is 50% cheaper and better aligned with a real team pilot.',
      },
    ],
  },
  {
    path: '/deepseek-tui-ssh-agent',
    title: 'DeepSeek-TUI SSH Agent Workflow',
    description:
      'Use DeepSeek-TUI with SSH-style development safely: remote shells, keys, approvals, command review, and least-privilege agent access.',
    h1: 'DeepSeek-TUI SSH agent workflows without accidental risk',
    eyebrow: 'SSH safety',
    intent: 'For developers who want terminal agents near remote servers or dev boxes without losing control of credentials.',
    lede:
      'SSH makes terminal work powerful. Agentic SSH workflows need extra discipline: protect keys, scope access, review commands, and make sure the agent cannot wander from a dev workspace into production by accident.',
    sections: [
      {
        heading: 'What to lock down first',
        paragraphs: [
          'Do not start by giving an agent broad remote access. Start with a development box, a restricted user, explicit command approvals, and a repository-scoped working directory. Treat production credentials as out of bounds unless a human deliberately changes the policy.',
          'DeepSeek-TUI Cloud can sit in front of that workflow with clearer onboarding: mode defaults, remote runner guidance, and plan support before teams normalize SSH-based agent use.',
        ],
        bullets: [
          'Use dedicated SSH keys with limited access.',
          'Avoid shared admin users.',
          'Keep production hosts out of the first pilot.',
          'Review shell commands before execution in unfamiliar environments.',
        ],
      },
      {
        heading: 'What good looks like',
        paragraphs: [
          'A healthy SSH agent workflow feels boring: the agent can inspect, edit, test, and report within a known workspace; humans can see commands and diffs; rollback is available; and secrets never become prompt material.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should DeepSeek-TUI have direct production SSH access?',
        answer:
          'Not for an initial rollout. Start in dev or staging with restricted credentials and explicit approvals, then expand only after the workflow is proven.',
      },
      {
        question: 'How should SSH keys be handled?',
        answer:
          'Use dedicated, revocable keys with least privilege. Never paste private keys into prompts or support messages.',
      },
    ],
  },
  {
    path: '/deepseek-tui-audit-logs',
    title: 'DeepSeek-TUI Audit Logs for Agentic Coding',
    description:
      'Design useful DeepSeek-TUI audit logs: session history, tool calls, command output, diffs, model routes, cost, approvals, and rollback records.',
    h1: 'DeepSeek-TUI audit logs: what teams actually need to review',
    eyebrow: 'Governance',
    intent: 'For teams that need agentic coding to be observable enough for engineering, security, and finance.',
    lede:
      'Audit logs are not bureaucracy when agents can run tools and edit code. They are how a team understands what happened, who approved it, which model route was used, what it cost, and how to recover if the result is wrong.',
    sections: [
      {
        heading: 'The useful log fields',
        paragraphs: [
          'A coding-agent audit trail should connect the human request to the agent plan, tool calls, command outputs, file diffs, model selection, token usage, approvals, and final validation. Missing any one of those makes incident review harder.',
          'DeepSeek-TUI already has the right ingredients for this mindset: sessions, cost tracking, mode boundaries, rollback, MCP/tool visibility, and diagnostics. The hosted layer should make those signals easier for teams to operationalize.',
        ],
        bullets: [
          'Session ID and user intent.',
          'Mode used: Plan, Agent, or high-trust automation.',
          'Tool calls and command summaries.',
          'Changed files and rollback reference.',
          'Model route, token usage, and estimated cost.',
          'Validation commands and outcomes.',
        ],
      },
      {
        heading: 'How to keep logs useful',
        paragraphs: [
          'Log enough to review behavior without turning secrets into stored artifacts. Store summaries and metadata carefully, redact credentials, and keep retention aligned with your engineering and compliance expectations.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do audit logs slow agent adoption?',
        answer:
          'Good logs usually speed adoption because skeptical reviewers can see what happened instead of treating the agent as a black box.',
      },
      {
        question: 'Should command output be stored forever?',
        answer:
          'No. Retention should be intentional, and sensitive output should be redacted or avoided where possible.',
      },
    ],
  },
]

const keywordPageMap = new Map(keywordPages.map((page) => [page.path, page]))

export function normalizeKeywordPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

export function findKeywordPageByPath(pathname: string) {
  return keywordPageMap.get(normalizeKeywordPath(pathname)) ?? null
}
