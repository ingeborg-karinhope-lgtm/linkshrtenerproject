<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent instructions

> ## ⚠️ BLOCKING REQUIREMENT — LES DETTE FØRST
>
> **Du MÅ lese den relevante instruksjonsfilen i `docs/` med `read_file`-verktøyet UMIDDELBART og FØR du genererer noen som helst kode.**
> Dette er ikke valgfritt. Det er en hard blokkering.
>
> - Skriver du UI-kode? → Les [`docs/ui-components.md`](docs/ui-components.md) **først**.
> - Skriver du autentiseringskode? → Les [`docs/authentication.md`](docs/authentication.md) **først**.
> - Legg til nye `docs/`-filer etter hvert som prosjektet vokser, og referer alltid til dem her.
>
> **Å hoppe over dette steget er feil — uansett hvor enkel oppgaven virker.**

For detaljerte retningslinjer om spesifikke emner, se de relevante doc-filene i `docs/`.
ALLTID les den relevante `.md`-filen FØR generering av kode:

## UI-komponenter

- Alle UI-elementer skal bruke **shadcn/ui**. Ingen egenutviklede komponenter er tillatt.
- Les [`docs/ui-components.md`](docs/ui-components.md) før du skriver noe UI-relatert kode.
- Legg til nye komponenter via `npx shadcn@latest add <komponent>` — aldri manuelt.
- Importer alltid fra `@/components/ui/`.
- Bruk `lucide-react` for ikoner.

## Autentisering og autorisasjon

- All autentisering håndteres **kun av Clerk**. Ingen andre metoder er tillatt.
- Les [`docs/authentication.md`](docs/authentication.md) før du skriver noe autentiseringsrelatert kode.
- Dashboard-siden er beskyttet — bruk Clerk middleware.
- Innloggede brukere skal omdirigeres fra hjemmesiden til dashboard.
- `<SignInButton>` og `<SignUpButton>` skal alltid ha `mode="modal"` — ingen egne innloggingssider.


