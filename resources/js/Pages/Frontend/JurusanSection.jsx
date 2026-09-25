import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/Components/Animations";

export default function JurusanSection({ programs = [] }) {
  return (
    <div id="jurusan" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
            Program Unggulan
          </h3>
          <h2 className="text-3xl font-bold text-gray-900">
            Konsentrasi Keahlian
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className={`max-w-6xl mx-auto gap-8 ${
            programs.length === 1
              ? "flex justify-center"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {programs.length > 0 ? (
            programs.map((program) => (
              <motion.div
                key={program.id}
                variants={fadeInUp}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-blue-600 text-center ${
                  programs.length === 1 ? "w-full max-w-md" : ""
                }`}
              >
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {program.icon ? (
                    <img
                      src={`/storage/${program.icon}`}
                      alt={program.singkatan}
                      className="w-full h-full object-cover p-2"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {program.singkatan || "Prog"}
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {program.nama_program}
                </h4>
                <p className="text-gray-600 text-sm">{program.deskripsi}</p>
              </motion.div>
            ))
          ) : (
            <div className="w-full text-center text-gray-500">
              Belum ada data program keahlian.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
