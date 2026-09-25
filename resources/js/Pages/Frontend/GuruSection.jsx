import React from "react";
import { Link } from "@inertiajs/react";

export default function GuruSection({ dataGuru = [], namaSekolah }) {
  return (
    <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Guru & Staff Pilihan
          </h2>
          <p className="text-gray-500 mt-1">
            Tenaga pendidik profesional di {namaSekolah}.
          </p>
        </div>
        <Link
          href="/guru-staf"
          className="mt-4 md:mt-0 inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition"
        >
          Lihat Semua Guru & Staff →
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {dataGuru.slice(0, 4).map((guru) => {
          const fotoUrl = guru.foto
            ? `/storage/${guru.foto}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama)}&background=1e293b&color=fff&size=300`;

          return (
            <Link
              key={guru.id}
              href="/guru-staf"
              className="w-full sm:w-[270px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col"
            >
              <div className="w-full h-64 bg-gray-100 overflow-hidden relative">
                <img
                  src={fotoUrl}
                  alt={guru.nama}
                  className="object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {guru.nama}
                </h3>
                <p className="text-sm font-semibold text-blue-600 mt-1 truncate">
                  {guru.jabatan || guru.mata_pelajaran || "Guru / Staff"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {dataGuru.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Belum ada data guru yang ditampilkan.</p>
        </div>
      )}
    </section>
  );
}
