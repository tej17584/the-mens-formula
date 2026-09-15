import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-20 sm:px-10">
        <section className="max-w-2xl space-y-6">
          <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase">
            Production foundation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Build the next chapter of The Men&apos;s Formula.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600">
            Next.js App Router, typed Supabase clients, cookie-based
            authentication, validation, and a complete testing baseline are
            ready for product work.
          </p>
        </section>
      </main>
    </div>
  );
}
