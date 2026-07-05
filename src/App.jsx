import { useEffect, useState } from 'react'

/* ---------------------------------------------------------------- *
 * Small hook: reveal elements as they scroll into view
 * ---------------------------------------------------------------- */
function useReveal() {
  useEffect(() => {
    // Mark JS as ready so the hide-then-animate CSS kicks in.
    // Without JS (or if this fails), content stays fully visible.
    document.documentElement.classList.add('js-ready')

    const els = Array.from(document.querySelectorAll('.reveal'))

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in-view'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))

    // Safety net: reveal anything already in the viewport on mount,
    // and guarantee everything is visible shortly after load.
    const revealVisible = () => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('in-view')
        }
      })
    }
    revealVisible()
    const t = setTimeout(() => els.forEach((el) => el.classList.add('in-view')), 1500)

    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])
}

/* ---------------------------------------------------------------- *
 * Decorative leaf / person mark (echoes the brand logo)
 * ---------------------------------------------------------------- */
function BrandMark({ className = '' }) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#80B165" />
          <stop offset="55%" stopColor="#2C8CA2" />
          <stop offset="100%" stopColor="#062A43" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="18" r="13" fill="url(#bm-grad)" />
      <path
        d="M50 112 C 8 78, 14 30, 46 20 C 50 40, 52 78, 50 112 Z"
        fill="url(#bm-grad)"
        opacity="0.92"
      />
      <path
        d="M50 112 C 92 78, 86 34, 58 26 C 52 46, 48 78, 50 112 Z"
        fill="url(#bm-grad)"
      />
    </svg>
  )
}

/* ---------------------------------------------------------------- *
 * Section heading with small eyebrow label
 * ---------------------------------------------------------------- */
function Eyebrow({ children, className = 'text-teal' }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] ${className}`}>
      <span className="h-px w-8 bg-sage" />
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- *
 * Pillar icons
 * ---------------------------------------------------------------- */
const icons = {
  shield: (
    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
  ),
  heart: (
    <path d="M12 20s-7-4.5-9.3-8.6C1.2 8.5 2.7 5 6 5c2 0 3.2 1.2 4 2.4C10.8 6.2 12 5 14 5c3.3 0 4.8 3.5 3.3 6.4C19 15.5 12 20 12 20z" />
  ),
  brain: (
    <path d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5.8V15a3 3 0 003 3v0a2 2 0 002 2 2 2 0 002-2V4.5A2 2 0 009 4zm6 0a2 2 0 00-2 2.5V20a2 2 0 002 2 2 2 0 002-2v0a3 3 0 003-3v-2.2A3 3 0 0018 7a3 3 0 00-3-3z" />
  ),
}

function PillarIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      {icons[name]}
    </svg>
  )
}

/* ---------------------------------------------------------------- *
 * Data
 * ---------------------------------------------------------------- */
const pillars = [
  {
    icon: 'shield',
    title: 'Psychosocial Risk & ISO 45003',
    body: 'A structured, risk-aware approach to workplace wellbeing — helping organisations identify and manage psychosocial hazards.',
  },
  {
    icon: 'heart',
    title: 'Mental Health First Aid',
    body: 'MHFA England accredited training, delivered by an experienced instructor who has trained over 250 Mental Health First Aiders.',
  },
  {
    icon: 'brain',
    title: 'Neurodiversity Awareness',
    body: 'Practical training to help managers and teams understand, support, and get the best from neurodivergent colleagues.',
  },
]

const EMAIL = 'carl@thrivewellpartners.co.uk'

/* ================================================================ *
 * App
 * ================================================================ */
export default function App() {
  useReveal()

  return (
    <div className="min-h-screen bg-cream text-navy">
      <Nav />
      <main>
        <Hero />
        <Welcome />
        <Pillars />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

/* ---------------------------------------------------------------- *
 * Navigation
 * ---------------------------------------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    ['Welcome', '#welcome'],
    ['What We’re Building', '#pillars'],
    ['About Carl', '#about'],
    ['Contact', '#contact'],
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/85 shadow-[0_1px_0_rgba(6,42,67,0.08)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <a href="#top" className="flex items-center">
          <img
            src="/logo.jpg"
            alt="ThriveWell Partners"
            className="h-14 w-14 object-cover sm:h-16 sm:w-16"
          />
        </a>

        {/* Centered nav links */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="link-underline text-[15px] font-medium text-ink transition-colors hover:text-teal"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right-side CTA */}
        <a
          href="#contact"
          className="hidden rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal hover:shadow-md active:translate-y-0 md:inline-block"
        >
          Get in touch
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-navy md:hidden"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-navy/5 bg-cream shadow-lg shadow-navy/5 transition-[max-height] duration-300 md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-navy/80 transition-colors hover:bg-sage/10 hover:text-teal"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-navy px-5 py-3 text-center text-base font-semibold text-cream"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}

/* ---------------------------------------------------------------- *
 * Hero
 * ---------------------------------------------------------------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* soft background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="animate-drift-slow absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-teal/10 blur-3xl" />
        <div className="animate-drift absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="reveal">
          <Eyebrow>Workplace Wellbeing</Eyebrow>
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-navy text-balance sm:text-6xl lg:text-7xl">
            Building{' '}
            <span className="relative inline-block">
              <span className="animate-gradient relative z-10 bg-gradient-to-r from-sage via-teal to-navy bg-clip-text text-transparent">
                healthier
              </span>
            </span>{' '}
            workplaces
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink">
            We help organisations build practical, supportive approaches to
            wellbeing, mental health, neurodiversity, and psychological safety —
            creating environments where people feel understood, valued, and able
            to do their best work.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-base font-semibold text-cream shadow-md transition-all hover:-translate-y-0.5 hover:bg-teal hover:shadow-lg active:translate-y-0"
            >
              Get in touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-7 py-3.5 text-base font-semibold text-navy transition-all hover:border-teal hover:text-teal"
            >
              What we&rsquo;re building
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink">
            <span className="flex items-center gap-2">
              <Dot /> MHFA England accredited
            </span>
            <span className="flex items-center gap-2">
              <Dot /> ISO 45003 aligned
            </span>
            <span className="flex items-center gap-2">
              <Dot /> 250+ First Aiders trained
            </span>
          </div>
        </div>

        {/* Logo showcase */}
        <div className="reveal flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-110 rounded-[2.5rem] bg-gradient-to-br from-sage/25 via-teal/15 to-navy/10 blur-2xl" />
            <div className="animate-float rounded-[2rem] bg-white/60 p-6 shadow-2xl shadow-navy/10 ring-1 ring-navy/5 backdrop-blur-sm transition-transform duration-500 hover:scale-[1.03] sm:p-8">
              <img
                src="/logo.jpg"
                alt="ThriveWell Partners logo"
                className="w-64 rounded-2xl sm:w-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-sage" />
}

/* ---------------------------------------------------------------- *
 * Welcome
 * ---------------------------------------------------------------- */
function Welcome() {
  return (
    <section id="welcome" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="reveal">
          <Eyebrow>Welcome</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-navy text-balance sm:text-4xl lg:text-[2.75rem]">
            We believe workplaces can be healthier, kinder, and better places to
            spend our time.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink">
            ThriveWell Partners exists to help organisations create environments
            where people feel understood, valued, and able to do their best work —
            with practical, supportive approaches grounded in real experience.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- *
 * Pillars
 * ---------------------------------------------------------------- */
function Pillars() {
  return (
    <section id="pillars" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal max-w-2xl">
          <Eyebrow>What We&rsquo;re Building</Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-medium leading-tight tracking-tight text-navy text-balance sm:text-4xl lg:text-[2.75rem]">
            Three core pillars
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink">
            ThriveWell Partners is being developed around three practical,
            evidence-based areas of workplace wellbeing.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="reveal group relative flex flex-col rounded-3xl border border-navy/5 bg-white/70 p-8 shadow-sm shadow-navy/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/30 hover:shadow-xl hover:shadow-teal/10"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sage/20 to-teal/20 text-teal transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:from-sage/30 group-hover:to-teal/30">
                <PillarIcon name={p.icon} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-navy">{p.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-ink">{p.body}</p>
              <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-sage">
                Pillar {String(i + 1).padStart(2, '0')}
              </span>
            </article>
          ))}
        </div>

        <div className="reveal mt-12 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-5 py-2.5 text-sm font-medium text-ink">
            <span className="animate-soft-pulse h-2 w-2 rounded-full bg-sage" />
            Full services launching in 2027
          </span>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- *
 * About Carl
 * ---------------------------------------------------------------- */
function About() {
  const stats = [
    ['40+', 'Years in industry'],
    ['250+', 'First Aiders trained'],
    ['Samaritans', 'Listening volunteer'],
  ]
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-navy text-cream shadow-2xl shadow-navy/20">
          <div className="grid gap-0 lg:grid-cols-[0.85fr,1.15fr]">
            {/* Left visual panel */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-teal/30 via-navy to-navy p-8 sm:p-14">
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-sage/30 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-teal/40 blur-3xl" />
              </div>
              <div className="reveal relative text-center">
                <BrandMark className="mx-auto h-40 w-40 drop-shadow-xl" />
                <p className="mt-6 font-display text-2xl font-medium text-cream">Carl</p>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-sage">
                  Founder &amp; Instructor
                </p>
              </div>
            </div>

            {/* Right content */}
            <div className="reveal p-7 sm:p-14">
              <Eyebrow className="text-cream">About Carl</Eyebrow>
              <h2 className="mt-6 font-display text-3xl font-medium leading-tight tracking-tight text-cream text-balance sm:text-4xl">
                Four decades of experience, grounded in empathy
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-cream">
                <p>
                  Carl has spent more than 40 years working in industry,
                  combining real-world workplace experience with professional
                  qualifications in Mental Health First Aid, neurodiversity, and
                  ISO 45003.
                </p>
                <p>
                  He has trained more than 250 Mental Health First Aiders and is
                  a current listening volunteer with Samaritans — reflecting a
                  long-standing commitment to supporting people through difficult
                  moments with empathy, compassion, and care.
                </p>
                <p className="text-cream">
                  ThriveWell Partners combines this expertise with a genuine
                  belief: when people feel supported, organisations become
                  stronger.
                </p>
              </div>

              <div className="mt-9 grid grid-cols-3 gap-3 border-t border-cream/10 pt-8 sm:gap-4">
                {stats.map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-xl font-medium leading-none text-sage sm:text-3xl">
                      {n}
                    </div>
                    <div className="mt-1.5 text-xs leading-snug text-cream sm:text-sm">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- *
 * Contact
 * ---------------------------------------------------------------- */
function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL)
      } else {
        // Fallback for older / non-secure contexts
        const ta = document.createElement('textarea')
        ta.value = EMAIL
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="reveal relative overflow-hidden rounded-[2rem] border border-navy/5 bg-white/70 p-7 text-center shadow-xl shadow-navy/5 sm:rounded-[2.5rem] sm:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sage/15 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
          </div>

          <Eyebrow>Get In Touch</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-navy text-balance sm:text-4xl">
            Be among the first to know when we fully launch
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink">
            Interested in finding out more, or want early updates as ThriveWell
            Partners comes to life? We&rsquo;d love to hear from you.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex items-center gap-2 rounded-full bg-navy px-8 py-4 text-base font-semibold text-cream shadow-md transition-all hover:bg-teal hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Email Carl
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-8 py-4 text-base font-semibold text-navy transition-all hover:border-teal hover:text-teal"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z" />
              </svg>
              Follow on LinkedIn
            </a>
          </div>

          <button
            type="button"
            onClick={copyEmail}
            title="Click to copy email address"
            className="group/email mt-8 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-cream/60 px-4 py-2 text-sm font-medium text-teal transition-all hover:border-teal/40 hover:text-navy"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sage">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 opacity-70">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 012-2h10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span>{copied ? 'Copied to clipboard' : EMAIL}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- *
 * Footer
 * ---------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-navy/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="ThriveWell Partners"
            className="h-9 w-9 rounded-lg object-cover ring-1 ring-navy/5"
          />
          <span className="text-sm font-semibold text-ink">
            ThriveWell <span className="text-teal">Partners</span>
          </span>
        </div>
        <p className="text-sm text-ink">
          Building healthier workplaces · Launching 2027
        </p>
        <p className="text-sm text-ink">
          &copy; {new Date().getFullYear()} ThriveWell Partners
        </p>
      </div>
    </footer>
  )
}
