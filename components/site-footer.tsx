import * as React from "react"

// import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
// import { ModeToggle } from "@/components/mode-toggle"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/kathanmehtaa"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              kathan
            </a>
            . Hosted on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </a>
            . Component Credits to {" "}
            <a
              href="https://twitter.com/shadcn"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn
            </a>
            {/* . The source code is available on{" "}
            <a
              href="/#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a> */}
            .
          </p>
        </div>
        {/* <ModeToggle /> */}
        <a
              href="https://twitter.com/kathanmehtaa"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-2xl dark:md:hover:bg-gray-800 border border-spacing-4 border-opacity-80 rounded px-2"
            >
              𝕏
            </a>
      </div>
    </footer>
  )
}