import { Heading, Body } from "@/components/ui/Typography"

export default function Home() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
      <Heading level={1} className="mb-6 text-[var(--color-brand)]">
        RetroTimeCo
      </Heading>
      <Body className="max-w-xl text-[var(--color-text-secondary)] text-lg">
        This is a placeholder for the RetroTimeCo homepage. The core layout and design tokens have been established.
      </Body>
    </div>
  );
}
