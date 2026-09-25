import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ScrollToTop from "@/Components/ScrollToTop";

export default function Berita({ posts, filters = {} }) {
  const { props } = usePage();
  const dataPengaturan = props.pengaturanWeb || {};
  const namaSekolah = dataPengaturan.nama_sekolah || "SD NEGERI 59 PAYAKUMBUH";

  // Data postingan (mendukung pagination standar Laravel maupun array)
  const dataBerita = posts?.data || (Array.isArray(posts) ? posts : []);
  const links = posts?.links || [];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col justify-between">
      <Head>
        <title>{`Berita & Informasi - ${namaSekolah}`}</title>
        <meta
          name="description"
          content={`Kumpulan berita, artikel, dan pengumuman resmi ${namaSekolah}`}
        />
        {dataPengaturan.favicon && (
          <link
            rel="icon"
            type="image/png"
            href={`/storage/${dataPengaturan.favicon}`}
          />
        )}
      </Head>

      {/* 1. NAVBAR STICKY TERTINGGI (Melayang & Tertahan di Atas Saat Scroll) */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 border-b border-gray-100">
        <Navbar />
      </header>

      {/* 2. KONTEN UTAMA */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* HEADER: JUDUL DAN DESKRIPSI DI TENGAH */}
        <div className="mb-12 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
            Berita & Informasi Terbaru
          </h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ikuti terus perkembangan, prestasi, dan pengumuman terbaru seputar
            kegiatan di lingkungan sekolah kami.
          </p>

          {/* Tag Filter Aktif (Arsip atau Kategori) */}
          {(filters.kategori || filters.arsip) && (
            <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Filter Aktif:
              </span>
              {filters.kategori && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Kategori: {filters.kategori}
                </span>
              )}
              {filters.arsip && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  Arsip: {filters.arsip}
                </span>
              )}
              <Link
                href="/berita"
                className="text-xs text-red-600 hover:text-red-800 font-semibold underline ml-2"
              >
                Reset Filter
              </Link>
            </div>
          )}
        </div>

        {/* DAFTAR KARTU BERITA: OTOMATIS RATA TENGAH SECARA SIMETRIS */}
        {dataBerita.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {dataBerita.map((item) => (
              <div
                key={item.id}
                className="w-full sm:w-[350px] lg:w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Gambar Thumbnail Berita */}
                <div className="h-52 bg-gray-100 overflow-hidden relative">
                  <img
                    src={
                      item.featured_image
                        ? item.featured_image.startsWith("http")
                          ? item.featured_image
                          : `/storage/${item.featured_image}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.title,
                          )}&size=600&background=0D8ABC&color=fff`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                  {item.category && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow">
                      {item.category.name}
                    </span>
                  )}
                </div>

                {/* Informasi & Cuplikan Konten */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Baris Tanggal & Jumlah Tayangan / Views */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {/* Ikon dan Jumlah Pengunjung yang Melihat Berita */}
                    <span
                      title="Jumlah pembaca"
                      className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-gray-400"
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
                      {(item.views ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition">
                    <Link href={`/berita/${item.slug}`}>{item.title}</Link>
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-3 mb-5 flex-grow leading-relaxed">
                    {item.meta_description ||
                      (item.content
                        ? item.content
                            .replace(/<[^>]*>?/gm, "")
                            .substring(0, 140)
                        : "Baca selengkapnya mengenai berita atau informasi ini di halaman detail.")}
                  </p>

                  <Link
                    href={`/berita/${item.slug}`}
                    className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 gap-1.5"
                  >
                    Baca Selengkapnya &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tampilan Jika Data Berita Kosong */
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-gray-600 font-medium">
              Tidak ada berita yang ditemukan untuk kriteria ini.
            </p>
            <Link
              href="/berita"
              className="mt-4 inline-block px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              Kembali ke Semua Berita
            </Link>
          </div>
        )}

        {/* 3. PAGINATION */}
        {links.length > 3 && (
          <div className="mt-12 flex justify-center flex-wrap gap-1.5">
            {links.map((link, index) => {
              if (!link.url) {
                return (
                  <span
                    key={index}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              }
              return (
                <Link
                  key={index}
                  href={link.url}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                    link.active
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* 4. FOOTER & TOMBOL SCROLL KE ATAS */}
      <Footer />
      <ScrollToTop />
    </div>
  );
}
