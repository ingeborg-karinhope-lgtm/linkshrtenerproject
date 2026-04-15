<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent instructions

## UI-komponenter

- Alle UI-elementer skal bruke **shadcn/ui**. Ingen egenutviklede komponenter er tillatt.
- Legg til nye komponenter via `npx shadcn@latest add <komponent>` — aldri manuelt.
- Importer alltid fra `@/components/ui/`.
- Bruk `lucide-react` for ikoner.

## Autentisering og autorisasjon

- All autentisering håndteres **kun av Clerk**. Ingen andre metoder er tillatt.
- Dashboard-siden er beskyttet — bruk Clerk middleware.
- Innloggede brukere skal omdirigeres fra hjemmesiden til dashboard.
- `<SignInButton>` og `<SignUpButton>` skal alltid ha `mode="modal"` — ingen egne innloggingssider.


