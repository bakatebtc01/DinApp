import React from "react";
import Head from "next/head";

const keyStats = [
  { label: "Top students departing on 15 Aug 2025", value: "30" },
  { label: "Students supported in 2024", value: "76" },
  { label: "Students supported in 2023", value: "43" },
  { label: "National sponsorship allocation", value: "K150 million" },
];

const programs = [
  {
    title: "USA STEM Scholarship Pathway",
    detail:
      "Top-performing Papua New Guinean students are supported into specialized STEM programs at US colleges and universities through merit-based selection and pre-departure readiness training.",
  },
  {
    title: "Mine-Impacted Area Sponsorship",
    detail:
      "In partnership with Star Mountain Education Foundation (SMEF), Global-Ed supports students from mine-impacted communities, including the Ok Tedi region, to access world-class education opportunities.",
  },
  {
    title: "Global Mobility Beyond the USA",
    detail:
      "The education pathway also extends to other international destinations, including India, to develop future PNG leaders in science, technology, and innovation.",
  },
];

const partnerships = [
  "Star Mountain Education Foundation (SMEF)",
  "EducationUSA",
  "PNG Government (Take Back PNG program)",
  "MRDC",
  "Kumul Petroleum",
  "MSU academic selection team",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Head>
        <title>Global-Ed PNG | Connecting Bright Minds to Global STEM</title>
        <meta
          name="description"
          content="Global-Ed is an education agency empowering Papua New Guinean students through STEM study opportunities abroad, strategic partnerships, and leadership pathways."
        />
      </Head>

      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap gap-4 text-sm text-slate-300">
          <a href="#home" className="hover:text-sky-300">
            Home
          </a>
          <a href="#founder" className="hover:text-sky-300">
            Founder&apos;s Story
          </a>
          <a href="#programs" className="hover:text-sky-300">
            Programs
          </a>
          <a href="#partnerships" className="hover:text-sky-300">
            Partnerships
          </a>
          <a href="#contact" className="hover:text-sky-300">
            Contact
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-12">
        <section id="home" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-10">
          <p className="text-sky-300 font-semibold tracking-wide uppercase text-sm mb-3">
            About Global-Ed
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Global-Ed: Connecting Papua New Guinea&apos;s brightest minds to global STEM opportunities.
          </h1>
          <p className="mt-5 text-slate-300 text-lg max-w-4xl leading-8">
            Global-Ed is an education agency focused on facilitating Science, Technology, Engineering,
            and Mathematics opportunities abroad. The organization works with partners in Papua New Guinea
            to sponsor high-achieving students and build a long-term pipeline of global-ready leaders.
          </p>
          <p className="mt-4 text-slate-300 leading-7">
            This year, 30 top academic students from PNG&apos;s 2024 cohort were oriented at the American
            Corner in Port Moresby ahead of their departure on August 15, 2025. They will join hundreds
            of PNG STEM students already studying in the USA.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          {keyStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <p className="text-3xl font-bold text-sky-300">{stat.value}</p>
              <p className="mt-2 text-slate-300">{stat.label}</p>
            </div>
          ))}
        </section>

        <section id="founder" className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Founder&apos;s Story: Jayson Kopeap</h2>
          <div className="space-y-4 text-slate-300 leading-7">
            <p>
              Jayson Kopeap is the Founder and Director of Global-Ed. His vision is to bridge Papua New
              Guinea&apos;s talent with global opportunities, especially in STEM fields, and ensure students
              from underserved communities can thrive internationally.
            </p>
            <p>
              His educational journey includes studies at West Virginia University in Computer Science and
              Software Engineering, and at Pensacola Christian College in Florida, USA. He communicates
              across both Pidgin and American English to mentor students and families through each stage
              of the international education pathway.
            </p>
            <p>
              As a STEM consultant, he has helped students prepare through pre-departure orientation,
              interview readiness, and transition support so they can feel at home while studying abroad.
            </p>
          </div>
        </section>

        <section id="programs" className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-5">Programs</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {programs.map((program) => (
              <article
                key={program.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
              >
                <h3 className="font-semibold text-lg text-sky-300 mb-2">{program.title}</h3>
                <p className="text-slate-300 leading-7">{program.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="partnerships" className="grid lg:grid-cols-5 gap-8">
          <article className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Latest Program Update</h2>
            <div className="space-y-4 text-slate-300 leading-7">
              <p>
                Students were selected by MSU based on high academic performance from across the country,
                with notable representation from national high schools including Sogeri National High School.
              </p>
              <p>
                Under the Take Back PNG program, the National Government provides full support and student
                allowances in collaboration with MRDC, Kumul Petroleum, and the Star Mountain Education
                Foundation.
              </p>
              <p>
                Global-Ed&apos;s key message remains clear: PNG students from all backgrounds can become future
                leaders through education, return with world-class knowledge, and contribute to national
                development in science and technology.
              </p>
            </div>
          </article>

          <aside className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Partnerships</h2>
            <ul className="space-y-3 text-slate-300 list-disc list-inside">
              {partnerships.map((partner) => (
                <li key={partner}>{partner}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="contact" className="bg-gradient-to-r from-sky-700 to-indigo-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold">Contact Global-Ed PNG</h2>
          <p className="mt-3 text-sky-100 leading-7 max-w-3xl">
            Office base: Papua New Guinea. Email inquiries: info@global-edpng.org. Use the form below to
            ask about scholarships, partnerships, or student applications.
          </p>
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              className="rounded-md border border-sky-300/40 bg-white/10 p-3 text-white placeholder-sky-100/80 outline-none focus:border-white"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="rounded-md border border-sky-300/40 bg-white/10 p-3 text-white placeholder-sky-100/80 outline-none focus:border-white"
            />
            <textarea
              placeholder="Your inquiry"
              rows={4}
              className="md:col-span-2 rounded-md border border-sky-300/40 bg-white/10 p-3 text-white placeholder-sky-100/80 outline-none focus:border-white"
            />
            <button
              type="button"
              className="md:col-span-2 rounded-md bg-white px-5 py-3 font-semibold text-sky-800 hover:bg-sky-100"
            >
              Send Inquiry
            </button>
          </form>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-slate-400 text-sm">
        Global-Ed PNG · Transforming Papua New Guinea&apos;s future through education.
      </footer>
    </div>
  );
}
