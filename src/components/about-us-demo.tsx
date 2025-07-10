import { AboutUs } from "@/components/ui/about-us"

function AboutUsDemo() {
  return (
    <AboutUs
      title="About Our Vision"
      subtitle="Pioneering the Future of AI"
      description="We're a team of innovators, engineers, and visionaries dedicated to creating AI solutions that truly understand and adapt to human needs. Our mission is to bridge the gap between complex technology and everyday productivity, making advanced AI accessible to everyone."
      titleClassName="text-4xl md:text-5xl font-extrabold"
      subtitleClassName="text-xl md:text-2xl max-w-[800px]"
      descriptionClassName="text-lg md:text-xl max-w-[900px]"
    />
  );
}

export { AboutUsDemo }