import React from "react";
import { Head, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ScrollToTop from "@/Components/ScrollToTop";

// Import Slices
import HeroSection from "./Frontend/HeroSection";
import StatistikSection from "./Frontend/StatistikSection";
import SambutanSection from "./Frontend/SambutanSection";
import GuruSection from "./Frontend/GuruSection";
import JurusanSection from "./Frontend/JurusanSection";
import BeritaSection from "./Frontend/BeritaSection";

export default function Home({
  posts = [],
  programs = [],
  dataGuru = [],
  statistik = {},
}) {
  const { props } = usePage();
  const dataPengaturan = props.pengaturanWeb || {};
  const namaSekolah = dataPengaturan.nama_sekolah || "SMK Negeri 1 Bukittinggi";

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 scroll-smooth relative">
      <Head>
        <title>{`Beranda - ${namaSekolah}`}</title>
        {dataPengaturan.favicon && (
          <link
            rel="icon"
            type="image/png"
            href={`/storage/${dataPengaturan.favicon}`}
          />
        )}
      </Head>

      <Navbar />

      {/* 1. Hero Slider dengan Tombol Navigasi Manual & Notifikasi Berita */}
      <HeroSection dataPengaturan={dataPengaturan} posts={posts} />

      {/* 2. Pita Statistik */}
      <StatistikSection statistik={statistik} />

      {/* 3. Sambutan Kepala Sekolah */}
      <SambutanSection
        dataPengaturan={dataPengaturan}
        namaSekolah={namaSekolah}
      />

      {/* 4. Guru & Staf Pilihan */}
      <GuruSection dataGuru={dataGuru} namaSekolah={namaSekolah} />

      {/* 5. Program Keahlian / Jurusan */}
      <JurusanSection programs={programs} />

      {/* 6. Berita Terkini */}
      <BeritaSection posts={posts} />

      <Footer />
      <ScrollToTop />
    </div>
  );
}
