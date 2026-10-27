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

function CaseCard({ c, open, onToggle }: { c: CaseStudy; open: boolean; onToggle: () => void }) {
  return (
    <article className={`case ${open ? "is-open" : ""}`}>
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

  return (
    <>
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
          <p className="eyebrow">
            {profile.role} · {profile.location}
          </p>
          <h1>
            Bonjour, I'm Heena. <span className="soft">{profile.headline}</span>
          </h1>
          <p className="lede">{profile.intro}</p>
          <div className="actions">
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
          <dl className="now-list">
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
          <div className="cases">
            {shown.map((c) => (
              <CaseCard key={c.id} c={c} open={openId === c.id} onToggle={() => setOpenId(openId === c.id ? null : c.id)} />
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <h2>Experience</h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.org}>
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
          <h2>What I work with</h2>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.group}>
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

        <section id="about" className="section about">
          <h2>About me</h2>
          <p>
            I wanted to build things ever since I watched Big Hero 6. Hiro had a garage full of half-finished inventions, and Baymax was a robot
            whose whole job was taking care of people. I know it's a cliché, but it stuck with me: technology at its best quietly looks after the
            people using it. That's what took me into Computing Science at the University of Alberta.
          </p>
          <p>
            I still learn the way Hiro did, by building something, watching it break and figuring out why. These days that's dashboards,
            automations and apps for real teams, and I'm always picking up whatever the next problem needs.
          </p>
          <p>
            Outside of work I run networking events for students through the International Students' Association, and I speak five languages.
          </p>
        </section>

        <section id="contact" className="section contact">
          <h2>Say hi</h2>
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
