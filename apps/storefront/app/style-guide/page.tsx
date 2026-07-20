"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
import { Heading, Body, Label } from "@/components/ui/Typography"

export default function StyleGuide() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 max-w-4xl space-y-16">
      
      <section className="space-y-4">
        <Heading level={1}>Style Guide</Heading>
        <Body>This page showcases the core UI primitives and their various states, built completely from scratch using Radix UI (where necessary) and Tailwind CSS v4.</Body>
      </section>

      <div className="h-px bg-[var(--color-border)] w-full" />

      {/* Typography */}
      <section className="space-y-8">
        <Heading level={2}>Typography</Heading>
        <div className="space-y-6 bg-[var(--color-surface)] p-8 rounded-[var(--radius)] border border-[var(--color-border)]">
          <div>
            <Label className="text-[var(--color-text-secondary)] mb-2 block">Heading 1</Label>
            <Heading level={1}>Cormorant Garamond</Heading>
          </div>
          <div>
            <Label className="text-[var(--color-text-secondary)] mb-2 block">Heading 2</Label>
            <Heading level={2}>Cormorant Garamond</Heading>
          </div>
          <div>
            <Label className="text-[var(--color-text-secondary)] mb-2 block">Heading 3</Label>
            <Heading level={3}>Cormorant Garamond</Heading>
          </div>
          <div>
            <Label className="text-[var(--color-text-secondary)] mb-2 block">Heading 4</Label>
            <Heading level={4}>Cormorant Garamond</Heading>
          </div>
          <div>
            <Label className="text-[var(--color-text-secondary)] mb-2 block">Body Text</Label>
            <Body>
              Inter font. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Body>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--color-border)] w-full" />

      {/* Buttons */}
      <section className="space-y-8">
        <Heading level={2}>Buttons</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-surface)] p-8 rounded-[var(--radius)] border border-[var(--color-border)]">
          <div className="space-y-4 flex flex-col items-start">
            <Heading level={4}>Primary</Heading>
            <Button>Default State</Button>
            <Button className="focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 outline-none">Focus State (Tab here)</Button>
            <Button disabled>Disabled State</Button>
          </div>
          <div className="space-y-4 flex flex-col items-start">
            <Heading level={4}>Secondary</Heading>
            <Button variant="secondary">Default State</Button>
            <Button variant="secondary" className="focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 outline-none">Focus State (Tab here)</Button>
            <Button variant="secondary" disabled>Disabled State</Button>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--color-border)] w-full" />

      {/* Forms & Inputs */}
      <section className="space-y-8">
        <Heading level={2}>Forms & Inputs</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-surface)] p-8 rounded-[var(--radius)] border border-[var(--color-border)]">
          <div className="space-y-6">
            <Heading level={4}>Text Input</Heading>
            <div className="space-y-2">
              <Label htmlFor="input-default">Default Input</Label>
              <Input id="input-default" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Disabled Input</Label>
              <Input id="input-disabled" placeholder="Disabled..." disabled />
            </div>
          </div>
          
          <div className="space-y-6">
            <Heading level={4}>Select (Radix)</Heading>
            <div className="space-y-2">
              <Label>Default Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Swiss</SelectLabel>
                    <SelectItem value="rolex">Rolex</SelectItem>
                    <SelectItem value="omega">Omega</SelectItem>
                    <SelectItem value="patek">Patek Philippe</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Japanese</SelectLabel>
                    <SelectItem value="seiko">Seiko</SelectItem>
                    <SelectItem value="grand-seiko">Grand Seiko</SelectItem>
                    <SelectItem value="citizen" disabled>Citizen (Disabled)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Disabled Select</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Cannot select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--color-border)] w-full" />

      {/* Overlays */}
      <section className="space-y-8">
        <Heading level={2}>Overlays & Modals</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--color-surface)] p-8 rounded-[var(--radius)] border border-[var(--color-border)]">
          <div className="space-y-4">
            <Heading level={4}>Dialog (Radix)</Heading>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verify Authenticity</DialogTitle>
                  <DialogDescription>
                    Review the authenticity details for this timepiece. Once verified, this action is recorded permanently.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-[var(--color-text-primary)]">The dialog traps focus and is fully accessible via keyboard.</p>
                </div>
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogTrigger>
                  <Button>Confirm Verification</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4 flex flex-col items-start">
            <Heading level={4}>Tooltip (Radix)</Heading>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fully restored original dial.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>

    </div>
  )
}
