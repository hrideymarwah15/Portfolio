"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface SiteData {
  hero: {
    headline1: string;
    headline2: string;
    highlightWord: string;
    description: string;
    ctaText: string;
  };
  about: {
    name: string;
    description: string;
    photoUrl: string;
    stats: { label: string; value: string }[];
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
    portfolio?: string;
    description: string;
  };
  meta: {
    footerText: string;
  };
  skills: string[];
  availability: {
    isAvailable: boolean;
    message: string;
  };
  projects: {
    id: string;
    title: string;
    problem: string;
    outcome: string;
    tag: string;
    tagColor: string;
    link: string | null;
    githubRepo: string | null;
    githubStars: number | null;
  }[];
}

interface HomeClientProps {
  data: SiteData;
}

// ScrollEntrance for scroll-triggered animations
function ScrollEntrance({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function HomeClient({ data }: HomeClientProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
        {/* Background Animation - positioned as background element */}
        <motion.div
          className="absolute inset-0 flex items-center justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background behind video */}
          <div className="absolute inset-0 bg-[var(--background)]" />

          {/* Grid overlay matching site background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <video
            ref={(el: HTMLVideoElement | null) => {
              if (el) {
                el.play().catch(console.error);
              }
            }}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="h-full w-auto max-w-none object-cover object-left relative opacity-90"
            style={{
              minHeight: "100%",
              transform: "translateX(10%)",
            }}
          >
            <source src="/coder-animation.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Content overlay */}
        <div className="max-w-6xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="font-mono font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.1] mb-6 text-[var(--foreground)]">
              {data.hero.headline1}
              <br />
              {data.hero.headline2}{" "}
              <span className="marker-yellow inline-block">
                {data.hero.highlightWord}
              </span>
              .
            </h1>
            <p className="text-base md:text-lg text-[var(--muted)] max-w-md leading-relaxed mb-8">
              {data.hero.description}
            </p>

            {/* CTA Button - Link to Work page */}
            <a
              href="/work"
              className="inline-block px-8 py-3 border-2 border-[var(--border)] bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-sm hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors shadow-hard"
            >
              {data.hero.ctaText}
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="w-6 h-10 border-2 border-[var(--border)] rounded-full flex justify-center pt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="w-1.5 h-3 bg-[var(--foreground)] rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-24 border-t border-dashed border-[var(--muted)]">
        <div className="max-w-5xl mx-auto">
          <ScrollEntrance delay={0.1}>
            <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
              // ABOUT
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Avatar */}
              <div
                className="relative w-full max-w-xs mx-auto lg:mx-0 aspect-square border-2 border-[var(--border)] bg-[var(--accent)] shadow-hard overflow-hidden"
                style={{
                  borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                }}
              >
                {data.about.photoUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={data.about.photoUrl}
                      alt={data.about.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <>
                    <svg className="absolute inset-0 w-full h-full opacity-10">
                      <line
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="100%"
                        y1="0"
                        x2="0"
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[var(--muted)] text-xs">
                      [PHOTO]
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div>
                <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-5 relative inline-block text-[var(--foreground)]">
                  {data.about.name}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 120 12"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M2 8 Q 30 2 60 8 T 118 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </svg>
                </h2>
                <p className="text-[var(--muted)] leading-relaxed mb-6 mt-4">
                  {data.about.description}
                </p>

                {/* Stats */}
                <div
                  className="p-6 border-2 border-[var(--border)] bg-[var(--accent)] shadow-hard"
                  style={{
                    borderRadius: "3px 15px 5px 15px / 15px 5px 15px 5px",
                  }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.about.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center p-3 border border-dashed border-[var(--muted)] bg-[var(--background)] group hover:border-solid hover:border-[var(--border)] transition-all duration-200"
                      >
                        <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider mb-1">
                          {stat.label}
                        </div>
                        <div className="text-lg font-mono font-black text-[var(--foreground)]">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollEntrance>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t-2 border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-5xl mx-auto flex justify-between items-center font-mono text-xs text-[var(--muted)]">
          <span>
            © {new Date().getFullYear()} {data.meta.footerText}
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/blog"
              className="hover:text-[var(--foreground)] transition-colors"
              title="Blog"
            >
              BLOG
            </a>
            <span>NEXT.JS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
