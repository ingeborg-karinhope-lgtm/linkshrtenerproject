# UI-komponenter med shadcn/ui

Alle UI-elementer i denne applikasjonen skal bruke **shadcn/ui**. Egenutviklede komponenter er **ikke tillatt**.

---

## Regler

- **Kun shadcn/ui-komponenter er tillatt.** Opprett aldri egne UI-komponenter fra bunnen av.
- **Endre ikke kjernelogikken** i genererte shadcn-filer under `components/ui/`. Stilendringer via Tailwind-klasser er tillatt.
- **Bruk alltid `lucide-react`** for ikoner — dette er det forhåndskonfigurerte ikonbiblioteket.
- **Importer alltid fra `@/components/ui/`**, ikke fra shadcn direkte.

---

## Konfigurasjon

Prosjektet er konfigurert med `components.json`:

- **Style:** `radix-nova`
- **Base color:** `neutral`
- **CSS-variabler:** aktivert
- **Ikon-bibliotek:** `lucide`
- **Alias for komponenter:** `@/components/ui`

---

## Legge til en ny komponent

Bruk shadcn CLI til å installere komponenter:

```bash
npx shadcn@latest add <komponent-navn>
```

Eksempler:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dropdown-menu
```

Komponenten legges automatisk til i `components/ui/`.

---

## Bruk i kode

Importer og bruk komponenten direkte:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ExampleForm() {
  return (
    <div>
      <Input placeholder="Skriv inn en URL..." />
      <Button>Forkort URL</Button>
    </div>
  );
}
```

---

## Tilpasning

Bruk Tailwind-klasser via `className`-prop for stilendringer. Endre aldri komponentfilene i `components/ui/` direkte.

```tsx
// Riktig: tilpass via className
<Button className="w-full mt-4" variant="outline">
  Avbryt
</Button>

// Feil: opprett ikke en ny CustomButton-komponent
```

Tilgjengelige varianter er definert i selve komponentfilen og følger shadcn/ui-konvensjonene (`default`, `outline`, `ghost`, `destructive`, osv.).

---

## Tilgjengelige komponenter

Se [shadcn/ui-dokumentasjonen](https://ui.shadcn.com/docs/components) for full liste. Installer kun det som faktisk brukes.

---

## Advarsler

> **Ikke opprett egne UI-primitiver.** Dersom en nødvendig komponent mangler, installer den via CLI fremfor å lage en ny.

> **Ikke installer andre komponentbiblioteker** (som MUI, Radix direkte, Chakra UI, etc.). shadcn/ui er eneste tillatte kilde.
