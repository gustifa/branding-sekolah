import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/Components/Animations";

export default function StatistikSection({ statistik = {} }) {
  const items = [
    { label: "Siswa Aktif", value: statistik.totalSiswa ?? 0 },
    { label: "Guru & Staff", value: statistik.totalGuru ?? 0 },
    { label: "Rombongan Belajar", value: statistik.totalRombel ?? 0 },
    { label: "Program Keahlian", value: statistik.totalProgram ?? 0 },
  ];

  return (
    <div className="bg-blue-600 py-10 relative z-20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x md:divide-blue-400"
        >
          {items.map((stat, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="mb-6 md:mb-0">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
