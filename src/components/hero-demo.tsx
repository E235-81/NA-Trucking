import { Hero } from "@/components/ui/hero"

function HeroDemo() {
  return (
    <Hero
      title="AI that works for you."
      subtitle="Transform your workflow with intelligent automation. Simple, powerful, reliable."
      actions={[
        {
          label: "Try Demo",
          href: "#demo",
          variant: "outline"
        },
        {
          label: "Get a Quote",
          href: "/buttons",
          variant: "default"
        },
        {
          label: "Test Slug",
          href: "/centuriontruckinginc",
          variant: "outline"
        }
      ]}
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
      actionsClassName="mt-8"
    />
  );
}

export { HeroDemo }