"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { createShortLink } from "@/data/links"
import {
  isUniqueConstraintError,
  linkFieldsSchema,
  normalizeLinkFields,
  type LinkFieldErrors,
  type LinkFieldsInput,
} from "@/lib/link-form"

export type CreateLinkInput = LinkFieldsInput

export type CreateLinkActionResult = {
  success?: boolean
  error?: string
  errors?: LinkFieldErrors
}

export async function createLinkAction(
  input: CreateLinkInput
): Promise<CreateLinkActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: "Du må være logget inn for å opprette en lenke.",
    }
  }

  const parsed = linkFieldsSchema.safeParse(normalizeLinkFields(input))

  if (!parsed.success) {
    return {
      error: "Skjemaet inneholder ugyldige verdier.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await createShortLink({
      userId,
      ...parsed.data,
      title: parsed.data.title || undefined,
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        error: "Denne slugen er allerede i bruk på kontoen din.",
        errors: {
          slug: ["Velg en annen slug."],
        },
      }
    }

    return {
      error: "Kunne ikke opprette lenken akkurat nå.",
    }
  }

  revalidatePath("/dashboard")

  return {
    success: true,
  }
}