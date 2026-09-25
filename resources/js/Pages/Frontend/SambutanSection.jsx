import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/Components/Animations";

export default function SambutanSection({ dataPengaturan, namaSekolah }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const fotoKepalaSekolah = dataPengaturan?.foto_kepala_sekolah
    ? `/storage/${dataPengaturan.foto_kepala_sekolah}`
    : "https://ui-avatars.com/api/?name=KS&size=400&background=0D8ABC&color=fff";

  const namaKepalaSekolah =
    dataPengaturan?.nama_kepala_sekolah || "Nurli Hayati, S.Pd";

  // Tangani Escape untuk menutup modal zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <div
      id="profil"
      className="py-20 lg:py-24 bg-gradient-to-b from-white via-blue-50/20 to-white overflow-hidden relative"
    >
      {/* Ornamen Latar Belakang Gradien Halus */}
      <div className="absolute top-1/3 -right-20 w-[480px] h-[480px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16"
        >
          {/* 1. KOLOM KIRI: TEKS SAMBUTAN LENGKAP */}
          <div className="w-full lg:w-8/12 flex-1 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                Sambutan Pimpinan
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Selamat Datang di Website Resmi{" "}
              <span className="text-blue-900">{namaSekolah}</span>
            </h2>

            {dataPengaturan?.sambutan_kepala_sekolah ? (
              <div
                className="prose prose-base sm:prose-lg text-gray-700 leading-relaxed text-justify max-w-none w-full
                  [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: dataPengaturan.sambutan_kepala_sekolah,
                }}
              />
            ) : (
              <p className="text-gray-500 italic">
                Sambutan kepala sekolah belum ditambahkan di panel admin.
              </p>
            )}

            {/* Tanda Tangan Ringkas di Bawah Paragraf */}
            <div className="mt-8 pt-6 border-t border-gray-200/80 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900 leading-snug">
                  {namaKepalaSekolah}
                </p>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mt-0.5">
                  Kepala {namaSekolah}
                </p>
              </div>
            </div>
          </div>

          {/* 2. KOLOM KANAN: KARTU PROFIL ESTETIK & INTERAKTIF (STICKY DI ATAS) */}
          <div className="w-full lg:w-4/12 flex justify-center order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-blue-950/5 border border-white/60 relative flex flex-col items-center text-center">
              {/* Badge Status Resmi */}
              <div className="absolute -top-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                Pimpinan Sekolah
              </div>

              {/* Wadah Foto dengan Animasi Melayang & Zoom */}
              <div className="relative mt-2 mb-5">
                {/* Pendaran Warna Halus */}
                <div className="absolute inset-0 bg-blue-400/25 rounded-full blur-xl animate-pulse"></div>

                {/* Lingkaran Luar Berputar Perlahan */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-2.5 rounded-full border-2 border-dashed border-blue-400/40 pointer-events-none"
                />

                {/* Elemen Foto Interaktif */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onClick={() => setIsZoomed(true)}
                  title="Klik untuk memperbesar foto"
                  className="relative w-56 h-56 rounded-full p-1.5 bg-gradient-to-tr from-blue-600 via-sky-400 to-amber-300 shadow-lg cursor-pointer group"
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white relative">
                    <img
                      src={fotoKepalaSekolah}
                      alt={namaKepalaSekolah}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
                    />

                    {/* Overlay Ikon Kaca Pembesar Saat Hover */}
                    <div className="absolute inset-0 bg-blue-950/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                      <svg
                        className="w-7 h-7 mb-1 drop-shadow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                      <span className="text-[11px] font-semibold drop-shadow tracking-wide">
                        Perbesar Foto
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Keterangan di Bawah Foto untuk Mengunci Keseimbangan Tampilan */}
              <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
                {namaKepalaSekolah}
              </h3>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">
                Kepala Sekolah
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{namaSekolah}</p>

              {/* Kutipan Singkat di Bagian Bawah Kartu */}
              <div className="mt-4 pt-3 border-t border-gray-100 w-full">
                <p className="text-xs italic text-gray-500 leading-relaxed">
                  "Menuntun potensi, mendidik dengan hati, dan membangun
                  generasi berkarakter unggul."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MODAL ZOOM POP-UP ELEGAN */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-blue-950/80 backdrop-blur-md cursor-zoom-out"
          >
            {/* Tombol Tutup */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer shadow-lg"
              title="Tutup (Esc)"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Wadah Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-3xl p-4 shadow-2xl border border-white/20 cursor-default overflow-hidden flex flex-col items-center"
            >
              <div className="w-full max-h-[75vh] overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
                <img
                  src={fotoKepalaSekolah}
                  alt={namaKepalaSekolah}
                  className="w-full h-auto max-h-[75vh] object-contain rounded-2xl shadow-inner"
                />
              </div>

              <div className="w-full pt-4 pb-2 text-center">
                <h4 className="text-lg font-bold text-gray-900">
                  {namaKepalaSekolah}
                </h4>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                  Kepala {namaSekolah}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
