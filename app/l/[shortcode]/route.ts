import { redirect } from "next/navigation"

import { resolveShortLink } from "@/data/links"

type RouteParams = {
  shortcode: string
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { shortcode } = await params
  const result = await resolveShortLink(shortcode)

  if (result.status === "not-found") {
    return new Response("Lenken finnes ikke.", {
      status: 404,
    })
  }

  if (result.status === "conflict") {
    return new Response("Shortcode er ikke globalt unik.", {
      status: 409,
    })
  }

  redirect(result.link.originalUrl)
}