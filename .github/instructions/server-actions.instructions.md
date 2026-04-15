---
description: Bruk denne filen når du implementerer datamanipulering, skjemaer eller knapper som skal skrive til databasen. Instruksen dekker colocated actions.ts-filer, kall fra klientkomponenter, Zod-validering, Clerk-autentisering og /data-hjelpere i stedet for direkte Drizzle-spørringer.
applyTo: "**/actions.ts"
---

# Server actions for datamanipulering

All datamanipulering i denne applikasjonen skal gå via server actions. Server actions skal kalles fra klientkomponenter, validere input med Zod, sjekke innlogging med Clerk før databaseoperasjoner, og bruke hjelpefunksjoner i `/data` i stedet for direkte Drizzle-spørringer.

---

## Regler

- All oppretting, oppdatering og sletting av data skal skje via server actions.
- Server action-filer **må hete `actions.ts`**.
- `actions.ts` skal ligge i samme mappe som klientkomponenten som kaller actionen.
- Server actions skal kalles fra klientkomponenter, ikke fra serverkomponenter.
- Input til server actions skal ha eksplisitte TypeScript-typer. **Ikke bruk `FormData` som TypeScript-type.**
- All input skal valideres med `zod` inne i server actionen før videre behandling.
- Alle server actions skal først sjekke om brukeren er innlogget med Clerk.
- Server actions skal ikke kaste feil. De skal returnere et objekt med `success` eller `error`.
- Server actions skal aldri bruke Drizzle direkte.
- Databaseoperasjoner skal ligge i hjelpefunksjoner under `/data`.

---

## Anbefalt arbeidsflyt

### 1. Definer input-type og Zod-schema

Lag en eksplisitt input-type basert på et `zod`-schema.

```ts
import { z } from "zod"

const createLinkSchema = z.object({
  slug: z.string().min(3).max(128),
  originalUrl: z.url(),
  title: z.string().max(255).optional(),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>
```

> **Viktig:** Send et vanlig objekt til actionen, for eksempel `{ slug, originalUrl, title }`. Ikke skriv action-signaturer som `formData: FormData`.

---

### 2. Opprett `actions.ts` ved siden av klientkomponenten

Eksempel struktur:

```text
app/dashboard/create-link-form/
  CreateLinkForm.tsx
  actions.ts
```

---

### 3. Sjekk autentisering før databasekall

Server actionen skal alltid verifisere innlogget bruker før den gjør noe mot databasen, og returnere et resultatobjekt ved både suksess og feil.

```ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

import { createShortLink } from "@/data/links"

const createLinkSchema = z.object({
  slug: z.string().min(3).max(128),
  originalUrl: z.url(),
  title: z.string().max(255).optional(),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: "Du må være logget inn",
    }
  }

  const parsed = createLinkSchema.safeParse(input)

  if (!parsed.success) {
    return {
      error: "Ugyldig input",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const link = await createShortLink({
    userId,
    ...parsed.data,
  })

  return {
    success: true,
    link,
  }
}
```

---

### 4. Legg databasekoden i `/data`

Server actions skal kalle hjelpefunksjoner i `/data`, og disse hjelperne kan wrappe Drizzle-spørringer.

```ts
import db from "@/db"
import { shortLinks } from "@/db/schema"

export type CreateShortLinkParams = {
  userId: string
  slug: string
  originalUrl: string
  title?: string
}

export async function createShortLink(params: CreateShortLinkParams) {
  const [link] = await db.insert(shortLinks).values(params).returning()
  return link
}
```

> **Regel:** `db.insert(...)`, `db.update(...)` og `db.delete(...)` hører hjemme i `/data`, ikke i `actions.ts`.

---

### 5. Kall actionen fra en klientkomponent

Klientkomponenten importerer actionen og sender et typet objekt.

```tsx
"use client"

import { useState, useTransition } from "react"

import { createLinkAction, type CreateLinkInput } from "./actions"

export function CreateLinkForm() {
  const [isPending, startTransition] = useTransition()
  const [slug, setSlug] = useState("")
  const [originalUrl, setOriginalUrl] = useState("")
  const [title, setTitle] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload: CreateLinkInput = {
      slug,
      originalUrl,
      title: title || undefined,
    }

    startTransition(async () => {
      await createLinkAction(payload)
    })
  }

  return <form onSubmit={handleSubmit}>{/* felter */}</form>
}
```

---

## Ikke gjør dette

```ts
// Feil: bruker FormData som input-type
export async function createLinkAction(formData: FormData) {}

// Feil: actionen kjører Drizzle direkte
await db.insert(shortLinks).values({ ... })

// Feil: actionen kaster feil i stedet for å returnere error-objekt
throw new Error("Unauthorized")

// Feil: databaseoperasjon før auth-sjekk
const link = await createShortLink(input)
const { userId } = await auth()
```

---

## Tips

- Bruk én action per tydelig handling, for eksempel `createLinkAction`, `updateLinkAction` eller `deleteLinkAction`.
- La Zod være eneste kilde for input-validering og hent TypeScript-typen fra schemaet med `z.infer`.
- Hold actionen tynn: auth, validering, kall til `/data`, returner et `success`- eller `error`-objekt.

---

## Advarsler

> Ikke plasser en delt `actions.ts` i en tilfeldig hjelpe-mappe hvis actionen tilhører én bestemt klientkomponent. Den skal ligge sammen med komponenten som bruker den.

> Hvis en server action trenger databasearbeid, skal dette alltid delegeres til en hjelpefunksjon i `/data`. Ikke bland forretningsflyt og query-kode i samme fil.

> Ikke bruk `throw new Error(...)` som normal feilhåndtering i server actions. Klientkomponenten skal kunne håndtere et eksplisitt returformat.