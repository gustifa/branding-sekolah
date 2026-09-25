import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/Components/Animations";

export default function BeritaSection({ posts = [] }) {
  return (
    <div id="berita" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
              Informasi
            </h3>
            <h2 className="text-3xl font-bold text-gray-900">
              Berita Sekolah Terkini
            </h2>
          </div>
          <Link
            href="/berita"
            className="text-blue-600 font-semibold hover:text-yellow-500 hover:underline transition"
          >
            Lihat Semua Berita &rarr;
          </Link>
        </motion.div>

        {posts.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={`gap-8 ${
              posts.length === 1
                ? "flex justify-center"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={fadeInUp}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col ${
                  posts.length === 1 ? "w-full max-w-md" : ""
                }`}
              >
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 transition z-10"></div>
                  <img
                    src={
                      post.featured_image
                        ? `/storage/${post.featured_image}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            post.title,
                          )}&background=random`
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-3 left-3 z-20 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                      {post.category.name}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition">
                    <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                  </h4>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {post.meta_description ||
                      "Baca selengkapnya mengenai berita ini di halaman detail."}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-md transition"
                        >
                          #{tag.name}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-400 self-center">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">
              Belum ada berita yang diterbitkan saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
