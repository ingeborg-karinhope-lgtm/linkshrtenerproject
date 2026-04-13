# Autentisering med Clerk

All autentisering og autorisasjon i denne applikasjonen håndteres **utelukkende av Clerk**.  
Ingen andre autentiseringsmekanismer, biblioteker eller egenutviklede løsninger skal brukes.

---

## Regler

- **Clerk er eneste tillatte autentiseringsløsning.** Aldri implementer JWT-håndtering, session-cookies, NextAuth, eller liknende alternativ.
- **Dashboard-siden er beskyttet.** Ikke-innloggede brukere skal ikke ha tilgang.
- **Innloggede brukere omdirigeres fra hjemmesiden** til dashboard automatisk.
- **Innlogging og registrering skal alltid vises i et modalt vindu** — aldri som egne sider.

---

## Oppsett

### 1. ClerkProvider

Wrap hele applikasjonen i `<ClerkProvider>` i `app/layout.tsx`. Dette er allerede gjort i dette prosjektet.

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

---

### 2. Beskytt dashboard-siden med middleware

Opprett eller oppdater `middleware.ts` i rotkatalogen:

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Omdiriger innlogget bruker fra hjemmesiden til dashboard
  if (isPublicRoute(req) && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Krev innlogging for beskyttede ruter
  if (isProtectedRoute(req) && !userId) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

> **Advarsel:** Ikke bruk `auth().protect()` eller `getAuth()` fra eldre Clerk-versjoner. Denne appen bruker `@clerk/nextjs` v7+ med async `auth()`.

---

### 3. Modal innlogging og registrering

Innlogging og registrering skal alltid vises som et modalt vindu, **aldri som egne ruter/sider**.

Bruk `<SignInButton mode="modal">` og `<SignUpButton mode="modal">` i UI:

```tsx
// Eksempel: header eller landingsside
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";

<Show when="signed-out">
  <SignInButton mode="modal">
    <button>Logg inn</button>
  </SignInButton>
  <SignUpButton mode="modal">
    <button>Registrer deg</button>
  </SignUpButton>
</Show>
```

> **Viktig:** `mode="modal"` er påkrevd på alle `<SignInButton>` og `<SignUpButton>` komponenter.  
> Ikke opprett `/sign-in` eller `/sign-up` ruter eller sider.

---

### 4. Vis bruker-meny når innlogget

```tsx
import { Show, UserButton } from "@clerk/nextjs";

<Show when="signed-in">
  <UserButton />
</Show>
```

---

## Tilgang til innlogget bruker i Server Components

```tsx
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return <div>Hei, {user?.firstName}</div>;
}
```

---

## Tilgang til innlogget bruker i Client Components

```tsx
"use client";
import { useUser } from "@clerk/nextjs";

export default function ProfileWidget() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;
  return <div>{user?.emailAddresses[0].emailAddress}</div>;
}
```

---

## Vanlige feil

| Feil | Løsning |
|------|---------|
| Innlogging åpner egen side i stedet for modal | Legg til `mode="modal"` på `<SignInButton>` / `<SignUpButton>` |
| Dashboard tilgjengelig uten innlogging | Sjekk at middleware matcher `/dashboard(.*)` |
| Innlogget bruker ser hjemmesiden | Sjekk redirect-logikken i middleware for `isPublicRoute && userId` |
| `auth()` krasjer | Husk `await auth()` — funksjonen er async i v7+ |
