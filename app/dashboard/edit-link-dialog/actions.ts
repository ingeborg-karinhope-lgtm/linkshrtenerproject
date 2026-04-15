"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { updateShortLink } from "@/data/links"
import {
  isUniqueConstraintError,
  linkFieldsSchema,
  normalizeLinkFields,
  type LinkFieldErrors,
} from "@/lib/link-form"

const updateLinkSchema = linkFieldsSchema.extend({
  id: z.number().int().positive("Lenke-ID må være gyldig"),
})

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>

export type UpdateLinkActionResult = {
  success?: boolean
  error?: string
  errors?: LinkFieldErrors
}

export async function updateLinkAction(
  input: UpdateLinkInput
): Promise<UpdateLinkActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: "Du må være logget inn for å redigere en lenke.",
    }
  }

  const parsed = updateLinkSchema.safeParse({
    id: input.id,
    ...normalizeLinkFields(input),
  })

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()

    return {
      error: "Skjemaet inneholder ugyldige verdier.",
      errors: {
        slug: fieldErrors.slug,
        originalUrl: fieldErrors.originalUrl,
        title: fieldErrors.title,
      },
    }
  }

  try {
    const link = await updateShortLink({
      userId,
      ...parsed.data,
      title: parsed.data.title || undefined,
    })

    if (!link) {
      return {
        error: "Lenken finnes ikke lenger eller tilhører ikke kontoen din.",
      }
    }
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
      error: "Kunne ikke lagre endringene akkurat nå.",
    }
  }

  revalidatePath("/dashboard")

  return {
    success: true,
  }
}