<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\GuruStaff;
use App\Models\Post;
use App\Models\ProfilSekolah;
use App\Models\ProgramKeahlian;
use App\Models\Rombel;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Halaman Beranda (Home)
     */
    public function home()
    {
        // 1. Data Postingan Terbaru (Maksimal 6)
        $posts = Post::with(['category', 'tags', 'author'])
            ->latest()
            ->take(6)
            ->get();

        // 2. Data Program Unggulan / Keahlian
        $programs = ProgramKeahlian::all();

        // 3. Data Guru & Staff (Maksimal 4 untuk cuplikan depan)
        $dataGuru = GuruStaff::take(4)->get();

        // 4. Statistik Sekolah
        $statistik = [
            'totalSiswa' => Siswa::count(),
            'totalGuru' => GuruStaff::count(),
            'totalRombel' => Rombel::count(),
            'totalProgram' => ProgramKeahlian::count(),
        ];

        return Inertia::render('Home', [
            'posts' => $posts,
            'programs' => $programs,
            'dataGuru' => $dataGuru,
            'statistik' => $statistik,
        ]);
    }

    /**
     * Halaman Daftar Berita & Filter Kategori / Arsip
     */
    public function berita(Request $request)
    {
        $query = Post::with(['category', 'tags', 'author'])->latest();

        // Filter berdasarkan slug Kategori
        if ($request->filled('kategori')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->kategori);
            });
        }

        // Filter berdasarkan Arsip Bulan & Tahun (PostgreSQL)
        if ($request->filled('arsip')) {
            $query->whereRaw("TO_CHAR(created_at, 'YYYY-MM') = ?", [$request->arsip]);
        }

        // Filter Pencarian Teks (Opsional jika ada fitur cari)
        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        $posts = $query->paginate(9)->withQueryString();

        return Inertia::render('Berita', [
            'posts' => $posts,
            'filters' => $request->only(['kategori', 'arsip', 'search']),
        ]);
    }

    /**
     * Halaman Detail Berita (Baca Artikel)
     */
    public function beritaDetail($slug)
    {
        $post = Post::with(['category', 'tags', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Ambil 3 postingan terkait berdasarkan kategori yang sama
        $relatedPosts = Post::with(['category'])
            ->where('id', '!=', $post->id)
            ->when($post->category_id, function ($q) use ($post) {
                $q->where('category_id', $post->category_id);
            })
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('BeritaDetail', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Halaman Daftar Guru & Staff Lengkap
     */
    public function guruStaf()
    {
        $guruStaf = GuruStaff::all();

        return Inertia::render('GuruStaf', [
            'guruStaf' => $guruStaf,
        ]);
    }

    /**
     * Halaman Profil Sekolah
     */
    public function profil()
    {
        return Inertia::render('Profil');
    }
}
