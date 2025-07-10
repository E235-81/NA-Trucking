import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

export interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  actions?: HeroAction[];
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ title, subtitle, actions, className, titleClassName, subtitleClassName, actionsClassName, ...props }, ref) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
    const [autoplayFailed, setAutoplayFailed] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(true);

    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        // Attempt autoplay
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setAutoplayFailed(false);
            })
            .catch(() => {
              setAutoplayFailed(true);
              setIsPlaying(false);
            });
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleError = () => setAutoplayFailed(true);

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('error', handleError);

      // Force load the video
      video.load();

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('error', handleError);
      };
    }, []);

    const handleManualPlay = () => {
      const video = videoRef.current;
      if (video) {
        video.play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayFailed(false);
          })
          .catch(() => {
            setAutoplayFailed(true);
          });
      }
    };

    const handlePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleMuteToggle = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (videoRef.current) {
        videoRef.current.volume = parseFloat(e.target.value);
      }
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative min-h-screen flex items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          src="https://wp3qshs4sh.ufs.sh/f/CK4jwRqb6gnIS4WqeJsgceLjEbMP3uC9rQKsqUFdVNpw05vf"
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://wp3qshs4sh.ufs.sh/f/CK4jwRqb6gnIJGa1JV6nyWwI6E1z9hlBqTMUe0ivJ2VDjYRm" type="video/mp4" />
          <source src="https://wp3qshs4sh.ufs.sh/f/CK4jwRqb6gnIS4WqeJsgceLjEbMP3uC9rQKsqUFdVNpw05vf" type="video/mp4" />
          {/* Fallback for browsers that don't support the video format */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        </video>

        {/* Manual play button for when autoplay fails */}
        {autoplayFailed && !isPlaying && (
          <button
            onClick={handleManualPlay}
            className="absolute inset-0 w-full h-full bg-black/20 flex items-center justify-center group transition-all duration-300 hover:bg-black/30"
            aria-label="Play background video"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
              <Play className="h-12 w-12 text-white ml-1" fill="currentColor" />
            </div>
          </button>
        )}

        {/* Loading state */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* Video Controls (without playhead) */}
        <div className="absolute bottom-6 left-6 flex items-center space-x-4 z-20">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={handleMuteToggle}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM16.707 9.293a1 1 0 010 1.414L15.414 12l1.293 1.293a1 1 0 01-1.414 1.414L14 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L12.586 12l-1.293-1.293a1 1 0 011.414-1.414L14 10.586l1.293-1.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Volume Slider */}
          {!isMuted && (
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className={cn(
            "text-4xl md:text-6xl font-bold text-white mb-6 leading-tight",
            titleClassName
          )}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={cn(
              "text-lg md:text-xl text-gray-200 mb-8 leading-relaxed",
              subtitleClassName
            )}>
              {subtitle}
            </p>
          )}
          
          {actions && actions.length > 0 && (
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center items-center",
              actionsClassName
            )}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  size="lg"
                  asChild
                  className="min-w-[140px]"
                >
                  <a href={action.href}>{action.label}</a>
                </Button>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero };