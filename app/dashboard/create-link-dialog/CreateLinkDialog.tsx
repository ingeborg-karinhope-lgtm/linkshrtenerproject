"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Link2, LoaderCircle, Plus } from "lucide-react"

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
  createLinkAction,
  type CreateLinkActionResult,
  type CreateLinkInput,
} from "./actions"

const initialValues: CreateLinkInput = {
  slug: "",
  originalUrl: "",
  title: "",
}

export function CreateLinkDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<CreateLinkInput>(initialValues)
  const [result, setResult] = useState<CreateLinkActionResult>({})
  const [isPending, startTransition] = useTransition()

  function updateValue(field: keyof CreateLinkInput, value: string) {
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
      setValues(initialValues)
      setResult({})
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const response = await createLinkAction(values)
      setResult(response)

      if (!response.success) {
        return
      }

      setValues(initialValues)
      setResult({})
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-4" size="lg">
          Ny lenke
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Opprett ny lenke</DialogTitle>
          <DialogDescription>
            Lag en kort lenke du kan dele, spore og finne igjen i dashboardet.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Original URL</Label>
            <Input
              id="originalUrl"
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
              <Label htmlFor="slug">Slug</Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="slug"
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
              <Label htmlFor="title">Tittel</Label>
              <Input
                id="title"
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
                  Oppretter
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Opprett lenke
                  <Plus className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}