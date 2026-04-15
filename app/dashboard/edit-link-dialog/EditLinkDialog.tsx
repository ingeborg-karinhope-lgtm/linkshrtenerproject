"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Link2, LoaderCircle, Pencil, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  updateLinkAction,
  type UpdateLinkActionResult,
  type UpdateLinkInput,
} from "./actions"

type EditableLink = {
  id: number
  slug: string
  originalUrl: string
  title: string | null
}

function getInitialValues(link: EditableLink): UpdateLinkInput {
  return {
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    title: link.title ?? "",
  }
}

export function EditLinkDialog({ link }: { link: EditableLink }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<UpdateLinkInput>(() => getInitialValues(link))
  const [result, setResult] = useState<UpdateLinkActionResult>({})
  const [isPending, startTransition] = useTransition()
  const fieldIdPrefix = `edit-link-${link.id}`

  function updateValue(
    field: Exclude<keyof UpdateLinkInput, "id">,
    value: string
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))

    setResult((current) => ({
      ...current,
      error: undefined,
      errors: current.errors
        ? {
            ...current.errors,
            [field]: undefined,
          }
        : undefined,
    }))
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)

    if (!nextOpen && !isPending) {
      setValues(getInitialValues(link))
      setResult({})
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const response = await updateLinkAction(values)
      setResult(response)

      if (!response.success) {
        return
      }

      setOpen(false)
      setResult({})
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Rediger
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rediger lenke</DialogTitle>
          <DialogDescription>
            Oppdater slug, URL eller tittel for denne forkortede lenken.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`${fieldIdPrefix}-originalUrl`}>Original URL</Label>
            <Input
              id={`${fieldIdPrefix}-originalUrl`}
              type="url"
              autoComplete="url"
              placeholder="https://eksempel.no/artikkel"
              required
              value={values.originalUrl}
              onChange={(event) => updateValue("originalUrl", event.target.value)}
            />
            {result.errors?.originalUrl?.[0] ? (
              <p className="text-sm text-destructive">
                {result.errors.originalUrl[0]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
            <div className="space-y-2">
              <Label htmlFor={`${fieldIdPrefix}-slug`}>Slug</Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id={`${fieldIdPrefix}-slug`}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="kampanje-2026"
                  required
                  minLength={3}
                  maxLength={128}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  className="pl-9"
                  value={values.slug}
                  onChange={(event) => updateValue("slug", event.target.value.toLowerCase())}
                />
              </div>
              {result.errors?.slug?.[0] ? (
                <p className="text-sm text-destructive">{result.errors.slug[0]}</p>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Bruk små bokstaver, tall og bindestrek.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${fieldIdPrefix}-title`}>Tittel</Label>
              <Input
                id={`${fieldIdPrefix}-title`}
                placeholder="Vårkampanje"
                maxLength={255}
                value={values.title}
                onChange={(event) => updateValue("title", event.target.value)}
              />
              {result.errors?.title?.[0] ? (
                <p className="text-sm text-destructive">{result.errors.title[0]}</p>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Valgfritt navn som vises i listen.
                </p>
              )}
            </div>
          </div>

          {result.error ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {result.error}
            </p>
          ) : null}

          <DialogFooter className="mx-0 mb-0 rounded-lg border-0 bg-transparent p-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  Lagrer
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Lagre endringer
                  <Save className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}