import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AboutUsProps {
  title?: string;
  subtitle?: string;
  description?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

export function AboutUs({
  title = "About Us",
  subtitle = "Our Story",
  description = "We are passionate about creating amazing experiences.",
  titleClassName,
  subtitleClassName,
  descriptionClassName,
  className
}: AboutUsProps) {
  return (
    <section className={cn("relative z-0 flex min-h-[80vh] w-full flex-col justify-center overflow-hidden bg-black text-left", className)}>
      <div className="relative z-50 container mx-auto px-5 md:px-10 py-20">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 space-y-6">
              <h2 className={cn("text-3xl md:text-4xl font-bold text-white", titleClassName)}>
                {title}
              </h2>
              <h3 className={cn("text-xl md:text-2xl text-white/90", subtitleClassName)}>
                {subtitle}
              </h3>
              <p className={cn("text-base md:text-lg text-white/80 leading-relaxed", descriptionClassName)}>
                {description}
              </p>
            </div>
            
            <div className="flex-shrink-0 lg:mt-8 flex justify-center lg:justify-end">
              <div className="relative">
                <Button
                  variant="ghost"
                  className="py-2 group overflow-hidden transition-all duration-500 hover:scale-110 w-fit min-w-[220px] h-16 px-8 rounded-xl bg-gradient-to-r from-white via-gray-100 to-white hover:from-gray-50 hover:via-white hover:to-gray-50 border-2 border-white/20 hover:border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-4 focus-visible:ring-offset-black transform-gpu will-change-transform relative z-10"
                >
                  <div className="relative flex items-center justify-center gap-3 z-20">
                    <span className="text-lg font-semibold text-black/80 tracking-wide">
                      Get a Quote
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}