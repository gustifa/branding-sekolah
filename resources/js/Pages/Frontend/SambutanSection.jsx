import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/Components/Animations";

export default function SambutanSection({ dataPengaturan, namaSekolah }) {
  return (
    <div id="profil" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-64 h-64 bg-gray-300 rounded-full border-8 border-blue-100 overflow-hidden shadow-xl hover:scale-105 transition-transform duration-500">
              <img
                src={
                  dataPengaturan?.foto_kepala_sekolah
                    ? `/storage/${dataPengaturan.foto_kepala_sekolah}`
                    : "https://ui-avatars.com/api/?name=KS&size=256&background=0D8ABC&color=fff"
                }
                alt="Kepala Sekolah"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
              Sambutan Pimpinan
            </h3>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Selamat Datang di Website Resmi {namaSekolah}
            </h2>
            {dataPengaturan?.sambutan_kepala_sekolah ? (
              <div
                className="prose text-gray-600 leading-relaxed text-justify max-w-none"
                dangerouslySetInnerHTML={{
                  __html: dataPengaturan.sambutan_kepala_sekolah,
                }}
              />
            ) : (
              <p className="text-gray-500 italic">
                Sambutan belum ditambahkan di panel admin.
              </p>
            )}
            <div className="mt-6 font-bold text-gray-900">
              <p>{dataPengaturan?.nama_kepala_sekolah || "Kepala Sekolah"}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
