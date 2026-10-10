"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Video,
} from "lucide-react";

export default function BackgroundVideo() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Jangan render video background pada halaman admin studio
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pastikan video mulai diputar
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay dicegah browser jika tidak muted
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      // Jika sebelumnya paused, play saat unmute
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const toggleVisibility = () => {
    setIsVideoVisible((prev) => !prev);
  };

  if (isAdmin) {
    return null;
  }

  return (
    <>
      {/* Fixed Fullscreen Background Video Container */}
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden transition-opacity duration-1000 ${
          isVideoVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/video/thumb.jpg"
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{
            filter: "brightness(0.92) contrast(1.05)",
          }}
        >
          <source
            src="/video/snaptik_7589468623945731349_v3.mp4"
            type="video/mp4"
          />
        </video>

        {/* Ambient Gradient & Glassmorphism Backdrop Overlay
            Menjaga kontras teks dan komponen tetap tajam dan nyaman dibaca */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--bg-rgb, 255, 255, 255), 0.72) 0%, rgba(var(--bg-rgb, 255, 255, 255), 0.58) 50%, rgba(var(--bg-rgb, 255, 255, 255), 0.76) 100%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />

        {/* Theme-Adaptive Tint for Dark Mode & Light Mode */}
        <div className="absolute inset-0 bg-white/60 dark:bg-[#070b14]/78 transition-colors duration-500" />

        {/* Subtle Radial Vignette for cinematic focus */}
        <div
          className="absolute inset-0 opacity-40 dark:opacity-70 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.45) 100%)",
          }}
        />
      </div>

      {/* Modern Floating Glassmorphism Controller Bar */}
      <aside
        aria-label="Kontrol Video Background"
        className="fixed bottom-5 left-5 z-40 pointer-events-auto"
      >
        {/* Desktop & Tablet Pill Controller */}
        <div className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-black/5 text-slate-700 dark:text-slate-200 transition-all hover:shadow-xl">
          {/* Badge Label */}
          <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isPlaying && isVideoVisible
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isPlaying && isVideoVisible
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Video BG
            </span>
            <span className="text-[10px] opacity-60 hidden md:inline">
              IKS PI Kera Sakti
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? "Jeda video" : "Putar video"}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Play className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 fill-current" />
            )}
            <span className="sr-only">
              {isPlaying ? "Jeda Video" : "Putar Video"}
            </span>
          </button>

          {/* Sound Mute / Unmute Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Bunyikan musik video" : "Bisukan musik video"}
            className={`p-1.5 rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
              !isMuted
                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-medium"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            )}
            <span className="sr-only">
              {isMuted ? "Bunyikan Audio" : "Bisukan Audio"}
            </span>
          </button>

          {/* Video Visibility Toggle Button */}
          <button
            type="button"
            onClick={toggleVisibility}
            title={
              isVideoVisible
                ? "Sembunyikan video background"
                : "Tampilkan video background"
            }
            className={`p-1.5 rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
              !isVideoVisible
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {isVideoVisible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
            <span className="sr-only">
              {isVideoVisible ? "Sembunyikan Video" : "Tampilkan Video"}
            </span>
          </button>
        </div>

        {/* Mobile Mini Floating Toggle */}
        <div className="sm:hidden relative">
          {isMenuOpen ? (
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Play className="w-4 h-4 text-slate-700 dark:text-slate-300 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className={`p-2 rounded-full ${
                  !isMuted
                    ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleVisibility}
                className={`p-2 rounded-full ${
                  !isVideoVisible
                    ? "bg-rose-500/20 text-rose-500"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {isVideoVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="px-2 py-1 text-[10px] font-bold text-slate-400"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-slate-700 dark:text-slate-300 flex items-center justify-center transition-transform active:scale-95"
              title="Kontrol Video Background"
            >
              <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="sr-only">Buka Kontrol Video</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
