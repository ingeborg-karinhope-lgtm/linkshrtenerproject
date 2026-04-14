import { ArrowRight, BarChart3, Link2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center bg-zinc-50 px-6 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="w-full max-w-6xl">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-violet-700 dark:bg-violet-950/20 dark:text-violet-300">
              Landingsside for LinkShrtener
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Forkort lenker. Del dem smartere. Følg hvem som klikker.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                LinkShrtener gjør det enkelt å opprette korte, delbare URL-er, samle dem i et rent dashboard og se klikkstatistikk på en trygg måte.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <a href="/dashboard" className="inline-flex items-center gap-2">
                  Kom i gang
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#features">Funksjoner</a>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-xl shadow-zinc-200/60 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-zinc-950/30">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">Eksempel på lenke</p>
            <div className="mt-6 rounded-3xl bg-zinc-900 px-6 py-8 text-white shadow-[0_25px_100px_-80px_rgba(15,23,42,0.8)] dark:bg-violet-950">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-violet-300">Kort URL</span>
                <p className="text-2xl font-semibold">linkshrtnr.app/ny-tilbud</p>
                <p className="text-sm leading-6 text-zinc-300">
                  Del denne lenken med kunden, og se hvor mange ganger den blir brukt i dashboardet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20 space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">Hvorfor LinkShrtener?</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Enkel administrasjon for alle lenker</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">
                <Link2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Rask forkortelse</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Lag en kort, minneverdig link fra hvilken som helst lang URL på et øyeblikk.
              </p>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Klikkanalyse</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Følg trafikk fra forkortede lenker og se hvilke delinger som gir resultater.
              </p>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Sikker deling</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Del lenker uten å miste kontroll over hvordan de brukes og hvem som ser dem.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
