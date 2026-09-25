import React, { useRef } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/Components/Animations";

export default function BeritaSection({ posts = [] }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id="berita" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Judul & Navigasi */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4"
        >
          <div>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1.5">
              Informasi
            </h3>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Berita Sekolah Terkini
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {posts.length > 3 && (
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("prev")}
                  aria-label="Geser ke kiri"
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-blue-600 hover:text-white text-gray-700 flex items-center justify-center transition shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scroll("next")}
                  aria-label="Geser ke kanan"
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-blue-600 hover:text-white text-gray-700 flex items-center justify-center transition shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
            <Link
              href="/berita"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1"
            >
              Lihat Semua Berita &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Konten Kartu Berita (Posisinya Otomatis ke Tengah) */}
        {posts.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className={`flex gap-8 overflow-x-auto pb-6 scrollbar-hide scroll-smooth ${
              posts.length < 3 ? "justify-center" : "justify-start"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-full sm:w-[350px] lg:w-[370px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Gambar Thumbnail */}
                <div className="h-52 bg-gray-100 overflow-hidden relative">
                  <img
                    src={
                      post.featured_image
                        ? post.featured_image.startsWith("http")
                          ? post.featured_image
                          : `/storage/${post.featured_image}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.title)}&background=random`
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow">
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Deskripsi & Judul */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-2">
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <h4 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition">
                    <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                  </h4>

                  <p className="text-gray-500 text-sm line-clamp-3 mb-5 flex-grow leading-relaxed">
                    {post.meta_description ||
                      "Baca selengkapnya mengenai berita ini di halaman detail."}
                  </p>

                  {/* Tag Berita */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 mb-4 border-t border-gray-100">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/berita/${post.slug}`}
                    className="mt-auto inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 gap-1.5"
                  >
                    Baca Selengkapnya &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">
              Belum ada berita yang diterbitkan saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
