import { and, asc, eq, sql } from "drizzle-orm"

import db from "@/db"
import { shortLinks } from "@/db/schema"

export type ShortLink = typeof shortLinks.$inferSelect
export type CreateShortLinkInput = {
  userId: string
  slug: string
  originalUrl: string
  title?: string
}

export type UpdateShortLinkInput = CreateShortLinkInput & {
  id: number
}

export type DeleteShortLinkInput = {
  id: number
  userId: string
}

export type ResolveShortLinkResult =
  | {
      status: "found"
      link: ShortLink
    }
  | {
      status: "not-found"
    }
  | {
      status: "conflict"
    }

export async function getLinksForUser(userId: string): Promise<ShortLink[]> {
  try {
    const links = await db
      .select()
      .from(shortLinks)
      .where(eq(shortLinks.userId, userId))
      .orderBy(asc(shortLinks.createdAt))

    return links
  } catch {
    throw new Error("Kunne ikke hente lenkene for brukeren")
  }
}

export async function createShortLink(
  input: CreateShortLinkInput
): Promise<ShortLink> {
  const [link] = await db
    .insert(shortLinks)
    .values({
      userId: input.userId,
      slug: input.slug,
      originalUrl: input.originalUrl,
      title: input.title,
    })
    .returning()

  return link
}

export async function updateShortLink(
  input: UpdateShortLinkInput
): Promise<ShortLink | null> {
  const [link] = await db
    .update(shortLinks)
    .set({
      slug: input.slug,
      originalUrl: input.originalUrl,
      title: input.title,
      updatedAt: new Date(),
    })
    .where(
      and(eq(shortLinks.id, input.id), eq(shortLinks.userId, input.userId))
    )
    .returning()

  return link ?? null
}

export async function deleteShortLink(
  input: DeleteShortLinkInput
): Promise<ShortLink | null> {
  const [link] = await db
    .delete(shortLinks)
    .where(
      and(eq(shortLinks.id, input.id), eq(shortLinks.userId, input.userId))
    )
    .returning()

  return link ?? null
}

export async function resolveShortLink(
  slug: string
): Promise<ResolveShortLinkResult> {
  try {
    const normalizedSlug = slug.trim().toLowerCase()

    const links = await db
      .select()
      .from(shortLinks)
      .where(eq(shortLinks.slug, normalizedSlug))
      .limit(2)

    if (links.length === 0) {
      return {
        status: "not-found",
      }
    }

    if (links.length > 1) {
      return {
        status: "conflict",
      }
    }

    const [link] = await db
      .update(shortLinks)
      .set({
        clicks: sql`${shortLinks.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(shortLinks.id, links[0].id))
      .returning()

    return {
      status: "found",
      link: link ?? links[0],
    }
  } catch {
    throw new Error("Kunne ikke slå opp lenken")
  }
}