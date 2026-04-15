"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { deleteShortLink } from "@/data/links"

const deleteLinkSchema = z.object({
  id: z.number().int().positive("Lenke-ID må være gyldig"),
})

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>

export type DeleteLinkActionResult = {
  success?: boolean
  error?: string
}

export async function deleteLinkAction(
  input: DeleteLinkInput
): Promise<DeleteLinkActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: "Du må være logget inn for å slette en lenke.",
    }
  }

  const parsed = deleteLinkSchema.safeParse(input)

  if (!parsed.success) {
    return {
      error: "Ugyldig lenke valgt for sletting.",
    }
  }

  const link = await deleteShortLink({
    id: parsed.data.id,
    userId,
  })

  if (!link) {
    return {
      error: "Lenken finnes ikke lenger eller tilhører ikke kontoen din.",
    }
  }

  revalidatePath("/dashboard")

  return {
    success: true,
  }
}