import { auth, currentUser } from "@clerk/nextjs/server"
import { ExternalLink, Link2, MousePointerClick } from "lucide-react"

import { CreateLinkDialog } from "@/app/dashboard/create-link-dialog/CreateLinkDialog"
import { DeleteLinkDialog } from "@/app/dashboard/delete-link-dialog/DeleteLinkDialog"
import { EditLinkDialog } from "@/app/dashboard/edit-link-dialog/EditLinkDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getLinksForUser } from "@/data/links"

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  dateStyle: "medium",
})

function getDisplayName(name: string | null | undefined) {
  return name?.trim() || "der"
}

export default async function DashboardPage() {
  const [{ userId }, user] = await Promise.all([auth(), currentUser()])

  if (!userId) {
    return null
  }

  const links = await getLinksForUser(userId)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 px-6 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-[0.24em]">
            Dashboard
          </Badge>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Hei, {getDisplayName(user?.firstName)}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Her er alle lenkene som er lagret på kontoen din. Listen er hentet server-side for den innloggede brukeren.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch lg:min-w-fit">
              <CreateLinkDialog />
              <Card className="min-w-52 border border-zinc-200/70 bg-white/80 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none">
                <CardHeader>
                  <CardDescription>Totalt antall lenker</CardDescription>
                  <CardTitle className="text-3xl">{links.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          {links.length === 0 ? (
            <Card className="border border-dashed border-zinc-300 bg-white/80 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none">
              <CardHeader>
                <CardTitle>Ingen lenker ennå</CardTitle>
                <CardDescription>
                  Når du oppretter din første forkortede lenke, dukker den opp her.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateLinkDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {links.map((link) => (
                <Card
                  key={link.id}
                  className="border border-zinc-200/70 bg-white/85 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none"
                >
                  <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <Link2 className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-[0.22em]">
                          /{link.slug}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="break-all text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                          {link.title || link.originalUrl}
                        </CardTitle>
                        <CardDescription className="mt-1 break-all">
                          {link.originalUrl}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit rounded-full">
                      {link.clicks} klikk
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4" />
                        <span>{link.clicks} registrerte klikk</span>
                      </div>
                      <span>Opprettet {dateFormatter.format(new Date(link.createdAt))}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline">
                        <a href={link.originalUrl} rel="noreferrer" target="_blank">
                          Åpne original
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <EditLinkDialog
                        link={{
                          id: link.id,
                          slug: link.slug,
                          originalUrl: link.originalUrl,
                          title: link.title,
                        }}
                      />
                      <DeleteLinkDialog
                        link={{
                          id: link.id,
                          slug: link.slug,
                          title: link.title,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
