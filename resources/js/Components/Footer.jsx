import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Footer() {
  const { props } = usePage();
  const dataPengaturan = props.pengaturanWeb || {};
  const categories = props.footerCategories || [];
  const archives = props.footerArchives || [];

  const namaSekolah = dataPengaturan.nama_sekolah || "SD NEGERI 59 PAYAKUMBUH";
  const slogan =
    dataPengaturan.slogan || "Berkarakter, Inovatif, Menjangkau Masa Depan";
  const alamat =
    dataPengaturan.alamat ||
    "Pakan Sinayan, Payakumbuh Barat, Payakumbuh City, West Sumatra 26224";
  const telepon = dataPengaturan.telepon || "085274817886";
  const email = dataPengaturan.email || "fauzangustifa@gmail.com";

  return (
    <footer className="bg-[#1b3582] text-white pt-14 pb-8 border-t-4 border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Kolom 1: Profil Sekolah */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold uppercase tracking-wider text-white">
              {namaSekolah}
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">{slogan}</p>
          </div>

          {/* Kolom 2: Arsip */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              ARSIP
            </h3>
            <ul className="space-y-2.5 text-sm text-blue-100">
              {archives.length > 0 ? (
                archives.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/berita?arsip=${item.month_key}`}
                      className="hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-xs text-blue-300 group-hover:translate-x-1 transition-transform">
                        &gt;
                      </span>
                      <span>{item.formatted_date}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-blue-200">Belum ada arsip.</li>
              )}
            </ul>
          </div>

          {/* Kolom 3: Kategori */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              KATEGORI
            </h3>
            <ul className="space-y-2.5 text-sm text-blue-100">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/berita?kategori=${cat.slug}`}
                      className="hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-xs text-blue-300 group-hover:translate-x-1 transition-transform">
                        &gt;
                      </span>
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-blue-200">Belum ada kategori.</li>
              )}
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              KONTAK
            </h3>
            <div className="space-y-3 text-sm text-blue-100">
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 mt-0.5">📍</span>
                <span className="leading-snug">{alamat}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-pink-400">📞</span>
                <span>{telepon}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-blue-300">✉️</span>
                <span className="break-all">{email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="pt-8 border-t border-blue-800/60 text-center text-xs text-blue-200">
          <p>
            © {new Date().getFullYear()} {namaSekolah}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
