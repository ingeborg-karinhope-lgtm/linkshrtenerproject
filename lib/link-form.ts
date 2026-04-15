import { z } from "zod"

export const linkFieldsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug må være minst 3 tegn")
    .max(128, "Slug kan ikke være lengre enn 128 tegn")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug kan bare inneholde små bokstaver, tall og bindestrek"
    ),
  originalUrl: z
    .url("Du må skrive inn en gyldig URL")
    .max(2048, "URL-en er for lang"),
  title: z
    .string()
    .trim()
    .max(255, "Tittel kan ikke være lengre enn 255 tegn")
    .optional()
    .or(z.literal("")),
})

export type LinkFieldsInput = z.infer<typeof linkFieldsSchema>
export type LinkFieldErrors = Partial<Record<keyof LinkFieldsInput, string[]>>

export function normalizeLinkFields(input: LinkFieldsInput): LinkFieldsInput {
  return {
    slug: input.slug.trim().toLowerCase(),
    originalUrl: input.originalUrl.trim(),
    title: input.title?.trim() || "",
  }
}

export function isUniqueConstraintError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  const pgCode = "code" in error ? error.code : undefined

  return (
    pgCode === "23505" ||
    error.message.includes("short_links_user_id_slug_key") ||
    error.message.toLowerCase().includes("unique")
  )
}