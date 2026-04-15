"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, Trash2, TriangleAlert } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import {
  deleteLinkAction,
  type DeleteLinkActionResult,
} from "./actions"

type DeletableLink = {
  id: number
  slug: string
  title: string | null
}

export function DeleteLinkDialog({ link }: { link: DeletableLink }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<DeleteLinkActionResult>({})
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)

    if (!nextOpen && !isPending) {
      setResult({})
    }
  }

  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    startTransition(async () => {
      const response = await deleteLinkAction({ id: link.id })
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
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Slett
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <TriangleAlert className="h-5 w-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>Slett lenke</AlertDialogTitle>
          <AlertDialogDescription>
            {`Er du sikker på at du vil slette /${link.slug}? Denne handlingen kan ikke angres.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {result.error ? (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {result.error}
          </p>
        ) : null}

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {link.title?.trim()
            ? `Tittelen \"${link.title}\" og alle tilhørende klikkdata blir fjernet.`
            : "Lenken og alle tilhørende klikkdata blir fjernet."}
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Avbryt</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? (
              <>
                Sletter
                <LoaderCircle className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Slett lenke
                <Trash2 className="h-4 w-4" />
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}