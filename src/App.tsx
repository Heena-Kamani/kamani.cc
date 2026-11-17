import { useEffect, useMemo, useState } from "react";
import { caseStudies, experience, now, profile, skills, type CaseStudy, type Track } from "./data";
import Visual from "./Visual";
import ResumeRequest from "./ResumeRequest";
import ContactForm from "./ContactForm";

type Filter = "all" | Track;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "software", label: "Building software" },
  { id: "data", label: "Making sense of data" },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* storage unavailable */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))] as const;
}

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fade things in as they scroll into view.
function useReveal(deps: unknown[]) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduceMotion()) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Thin bar at the top that fills as you scroll down the page.
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? window.scrollY / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}

// Works out which project card is in the middle of the screen, so the pinned picture can follow along.
function useActiveCase(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    setActive(ids[0]);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.id!);
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    ids.forEach((id) => {
      const el = document.querySelector(`[data-id="${id}"]`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids.join(",")]);
  return active;
}

function Stage({ ids, active }: { ids: string[]; active: string }) {
  const c = caseStudies.find((x) => x.id === active);
  return (
    <div className="stage" aria-hidden="true">
      <div className="stage-frame">
        {ids.map((id) => (
          <div key={id} className={`stage-item ${id === active ? "active" : ""}`}>
            <Visual id={id} />
          </div>
        ))}
      </div>
      <p className="stage-caption">
        <span className="stage-count">
          {String(ids.indexOf(active) + 1).padStart(2, "0")} / {String(ids.length).padStart(2, "0")}
        </span>
        {c?.title}
      </p>
    </div>
  );
}

function CaseCard({ c, open, onToggle, active }: { c: CaseStudy; open: boolean; onToggle: () => void; active: boolean }) {
  return (
    <article className={`case reveal ${open ? "is-open" : ""} ${active ? "is-active" : ""}`} data-id={c.id}>
      <Visual id={c.id} />
      <div className="case-main">
      <button className="case-head" onClick={onToggle} aria-expanded={open} aria-controls={`case-${c.id}`}>
        <span className="case-where">
          {c.where} · {c.when}
        </span>
        <span className="case-title">{c.title}</span>
        <span className="case-summary">{c.summary}</span>
        <span className="case-more" aria-hidden="true">
          {open ? "Less" : "Read the story"}
        </span>
      </button>
      {open && (
        <div className="case-body" id={`case-${c.id}`}>
          <h4>The problem</h4>
          <p>{c.problem}</p>
          <h4>What I did</h4>
          <ul>
            {c.did.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h4>What changed</h4>
          <p>{c.result}</p>
          {c.links && (
            <p className="case-links">
              {c.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </p>
          )}
        </div>
      )}
      <ul className="chips" aria-label="Tools used">
        {c.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      </div>
    </article>
  );
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [askResume, setAskResume] = useState(false);

  const shown = useMemo(
    () => caseStudies.filter((c) => filter === "all" || c.tracks.includes(filter)),
    [filter],
  );
  const ids = shown.map((c) => c.id);
  const active = useActiveCase(ids);
  useReveal([filter]);

  return (
    <>
      <ScrollProgress />
      <a className="skip" href="#work">
        Skip to work
      </a>
      <header className="top">
        <a className="mark" href="#">
          {profile.name}
        </a>
        <nav aria-label="Main">
          <a href="#now">Now</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button className="theme" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow rise" style={{ animationDelay: "0ms" }}>
            {profile.role} · {profile.location}
          </p>
          <h1 className="rise" style={{ animationDelay: "120ms" }}>
            Bonjour, I'm Heena. <span className="soft">{profile.headline}</span>
          </h1>
          <p className="lede rise" style={{ animationDelay: "260ms" }}>
            {profile.intro}
          </p>
          <div className="actions rise" style={{ animationDelay: "400ms" }}>
            <a className="btn primary" href="#work">
              See my work
            </a>
            <button className="btn" onClick={() => setAskResume(true)}>
              Request my resume
            </button>
            <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>

        <section id="now" className="section now">
          <div className="section-head">
            <h2>Now</h2>
            <span className="soft small">Updated {now.updated}</span>
          </div>
          <dl className="now-list reveal">
            {now.items.map((n) => (
              <div key={n.label}>
                <dt>{n.label}</dt>
                <dd>{n.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="section">
          <div className="section-head">
            <h2>Selected work</h2>
            <div className="filters" role="group" aria-label="Filter work">
              {filters.map((f) => (
                <button
                  key={f.id}
                  className={filter === f.id ? "active" : ""}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="work-layout">
            <Stage ids={ids} active={active} />
            <div className="cases">
              {shown.map((c) => (
                <CaseCard
                  key={c.id}
                  c={c}
                  active={c.id === active}
                  open={openId === c.id}
                  onToggle={() => setOpenId(openId === c.id ? null : c.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <h2 className="reveal">Experience</h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.org} className="reveal">
                <div className="tl-when">{e.when}</div>
                <div>
                  <h3>
                    {e.role} <span className="soft">at {e.org}</span>
                  </h3>
                  <ul>
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section">
          <h2 className="reveal">What I work with</h2>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.group} className="reveal">
                <h3>{g.group}</h3>
                <ul className="chips">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section about ">
          <h2 className="reveal">About me</h2>
          <p className="reveal">
            I wanted to build things ever since I watched Big Hero 6. Hiro had a garage full of half-finished inventions, and Baymax was a robot
            whose whole job was taking care of people. I know it's a cliché, but it stuck with me: technology at its best quietly looks after the
            people using it. That's what took me into Computing Science at the University of Alberta.
          </p>
          <p className="reveal">
            I still learn the way Hiro did, by building something, watching it break and figuring out why. These days that's dashboards,
            automations and apps for real teams, and I'm always picking up whatever the next problem needs.
          </p>
          <p className="reveal">
            Outside of work I run networking events for students through the International Students' Association, and I speak five languages.
          </p>
        </section>

        <section id="contact" className="section contact">
          <h2 className="reveal">Say hi</h2>
          <p>I'm open to analyst, BI and developer roles in Edmonton or remote. Send me a note and I'll reply from my own inbox.</p>
          <ContactForm />
          <p className="links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <button className="linklike" onClick={() => setAskResume(true)}>
              Request my resume
            </button>
          </p>
        </section>
      </main>

      <footer className="foot">
        <p>
          Designed and built by me with React and TypeScript.
        </p>
      </footer>
      <ResumeRequest open={askResume} onClose={() => setAskResume(false)} />
    </>
  );
}
