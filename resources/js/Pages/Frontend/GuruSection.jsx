import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/Components/Animations";

export default function GuruSection({ dataGuru = [], namaSekolah }) {
  const [selectedGuru, setSelectedGuru] = useState(null);

  // Kunci tatalan latar belakang dan sokong kekunci ESC untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedGuru(null);
    };

    if (selectedGuru) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGuru]);

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Tajuk Bahagian */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
              Tenaga Pendidik
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Guru & Staff Pilihan
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Tenaga pendidik profesional di {namaSekolah || "SDN 59 PAYAKUMBUH"}.
          </p>
        </div>
        <Link
          href="/guru-staf"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Lihat Semua Guru & Staff &rarr;
        </Link>
      </div>

      {/* Senarai Kad Guru dengan Animasi Stagger & Hover Elegan */}
      {dataGuru && dataGuru.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {dataGuru.slice(0, 4).map((guru) => {
            const fotoUrl = guru.foto
              ? guru.foto.startsWith("http")
                ? guru.foto
                : `/storage/${guru.foto}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  guru.nama,
                )}&background=1e293b&color=fff&size=400`;

            const jabatanTeks =
              guru.jabatan || guru.mata_pelajaran || "Guru / Staff";

            return (
              <motion.div
                key={guru.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedGuru(guru)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 cursor-pointer group flex flex-col relative"
              >
                {/* Bekas Foto dengan Efek Zoom & Lapisan Bayang */}
                <div className="w-full h-72 bg-slate-900 overflow-hidden relative flex items-center justify-center">
                  <img
                    src={fotoUrl}
                    alt={guru.nama}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Lapisan Gradient Lembut */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Lencana Tersembunyi yang Muncul Semasa Tetikus Dihala */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-blue-900 text-xs font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Lihat Profil
                    </span>
                  </div>
                </div>

                {/* Butiran Nama & Jawatan */}
                <div className="p-6 text-center flex-grow flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {guru.nama}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 mt-1 truncate">
                    {jabatanTeks}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">
            Belum ada data guru yang dipaparkan.
          </p>
        </div>
      )}

      {/* MODAL POPUP DETAIL GURU & STAFF (MODERN LIGHTBOX) */}
      <AnimatePresence>
        {selectedGuru && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedGuru(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-blue-950/80 backdrop-blur-md cursor-pointer"
          >
            {/* Butang Tutup (ESC / Pangkah) */}
            <button
              onClick={() => setSelectedGuru(null)}
              className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-sm shadow-xl"
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

            {/* Kad Popup Maklumat Terperinci */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-white/20 cursor-default overflow-hidden flex flex-col items-center"
            >
              {/* Bingkai Foto Guru */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl bg-slate-900 border-4 border-gray-50 mb-5 relative group">
                <img
                  src={
                    selectedGuru.foto
                      ? selectedGuru.foto.startsWith("http")
                        ? selectedGuru.foto
                        : `/storage/${selectedGuru.foto}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedGuru.nama,
                        )}&background=1e293b&color=fff&size=500`
                  }
                  alt={selectedGuru.nama}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Nama & Jawatan Rasmi */}
              <h3 className="text-2xl font-extrabold text-gray-900 text-center">
                {selectedGuru.nama}
              </h3>
              <span className="mt-1 px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
                {selectedGuru.jabatan ||
                  selectedGuru.mata_pelajaran ||
                  "Guru / Staff"}
              </span>

              {/* Data Maklumat Tambahan (NIP / Email / Deskripsi jika wujud) */}
              <div className="w-full mt-6 space-y-3 pt-5 border-t border-gray-100 text-sm">
                {selectedGuru.nip && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400 font-medium">NIP</span>
                    <span className="text-gray-800 font-semibold">
                      {selectedGuru.nip}
                    </span>
                  </div>
                )}
                {selectedGuru.mata_pelajaran && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400 font-medium">
                      Mata Pelajaran
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {selectedGuru.mata_pelajaran}
                    </span>
                  </div>
                )}
                {selectedGuru.pendidikan && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400 font-medium">
                      Pendidikan
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {selectedGuru.pendidikan}
                    </span>
                  </div>
                )}
                {selectedGuru.bio && (
                  <div className="mt-2 text-center text-gray-500 text-xs italic bg-gray-50 p-3 rounded-xl">
                    "{selectedGuru.bio}"
                  </div>
                )}
              </div>

              {/* Butang Tindakan */}
              <button
                onClick={() => setSelectedGuru(null)}
                className="mt-6 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
