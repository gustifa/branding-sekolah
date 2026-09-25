import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection({ dataPengaturan, posts = [] }) {
  // Ambil artikel paling baru untuk badge informasi
  const beritaTerbaru = posts && posts.length > 0 ? posts[0] : null;

  // Siapkan daftar gambar slider dari database
  const rawImages = dataPengaturan?.gambar_hero || dataPengaturan?.foto_hero;
  const heroImages =
    Array.isArray(rawImages) && rawImages.length > 0
      ? rawImages
      : typeof rawImages === "string" && rawImages.length > 0
        ? [rawImages]
        : [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000",
          ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigasi manual mundur & maju
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  // Timer otomatis berganti setiap 6 detik
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  return (
    <div className="relative h-[560px] sm:h-[620px] flex items-center justify-center text-center overflow-hidden group select-none">
      {/* 1. SLIDER GAMBAR LATAR (Dibuat transisi zoom lembut) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${
              heroImages[currentIndex].startsWith("http")
                ? heroImages[currentIndex]
                : "/storage/" + heroImages[currentIndex]
            }')`,
          }}
        />
      </AnimatePresence>

      {/* 2. LAPISAN OVERLAY TRANSPARAN (Dibuat lebih tipis agar gambar sekolah sangat terlihat jelas) */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/75 via-black/35 to-black/20 z-0"></div>

      {/* 3. KONTEN DENGAN ANIMASI MASUK KIRI & KANAN BERGANTIAN */}
      <div className="relative z-10 px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex flex-col items-center w-full"
          >
            {/* Badge Berita Terbaru (Bergerak Masuk dari Kiri) */}
            {beritaTerbaru && (
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md transition shadow-lg"
              >
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-yellow-400 text-blue-950 rounded-full shadow-sm">
                  Terbaru
                </span>
                <Link
                  href={`/berita/${beritaTerbaru.slug}`}
                  className="text-xs sm:text-sm text-white font-medium truncate max-w-[220px] sm:max-w-md drop-shadow"
                >
                  {beritaTerbaru.title} &rarr;
                </Link>
              </motion.div>
            )}

            {/* Judul Utama (Bergerak Masuk dari Kiri ke Kanan) */}
            <motion.h1
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-tight"
            >
              {dataPengaturan?.hero_title ||
                "Menuntun Potensi, Mendidik dengan Hati dan Visi"}
            </motion.h1>

            {/* Slogan / Deskripsi (Bergerak Masuk dari Kanan ke Kiri) */}
            <motion.p
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-base sm:text-xl text-white max-w-3xl mx-auto mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium"
            >
              {dataPengaturan?.hero_deskripsi ||
                dataPengaturan?.slogan ||
                "Berkarakter, Inovatif, Menjangkau Masa Depan"}
            </motion.p>

            {/* Tombol Aksi (Bergerak Muncul dengan Skala) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <a
                href="#berita"
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold px-8 py-3 rounded-full hover:scale-105 transition shadow-xl text-sm sm:text-base cursor-pointer"
              >
                Berita Terbaru
              </a>
              <a
                href="#jurusan"
                className="bg-black/30 hover:bg-white hover:text-blue-950 border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition shadow-xl backdrop-blur-sm text-sm sm:text-base cursor-pointer"
              >
                Jelajahi Jurusan
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. TOMBOL MANUAL MUNDUR (KIRI) */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Slide Mundur"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-yellow-400 text-white hover:text-blue-950 border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* TOMBOL MANUAL MAJU (KANAN) */}
          <button
            onClick={handleNext}
            aria-label="Slide Maju"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/40 hover:bg-yellow-400 text-white hover:text-blue-950 border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* INDIKATOR TITIK (DOTS) DI BAGIAN BAWAH */}
          <div className="absolute bottom-5 z-20 flex gap-2.5">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-yellow-400 shadow-lg"
                    : "w-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Ke slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
