<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\GuruStaff;
use App\Models\Post;
use App\Models\ProfilSekolah;
use App\Models\ProgramKeahlian;
use App\Models\Rombel;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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
            'totalSiswa'   => Siswa::count(),
            'totalGuru'    => GuruStaff::count(),
            'totalRombel'  => Rombel::count(),
            'totalProgram' => ProgramKeahlian::count(),
        ];

        return Inertia::render('Home', [
            'posts'     => $posts,
            'programs'  => $programs,
            'dataGuru'  => $dataGuru,
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

        // Filter berdasarkan Arsip Bulan & Tahun (Format: YYYY-MM untuk PostgreSQL)
        if ($request->filled('arsip')) {
            $query->whereRaw("TO_CHAR(created_at, 'YYYY-MM') = ?", [$request->arsip]);
        }

        // Filter Pencarian Judul
        if ($request->filled('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        $posts = $query->paginate(9)->withQueryString();

        return Inertia::render('Berita', [
            'posts'   => $posts,
            'filters' => $request->only(['kategori', 'arsip', 'search']),
        ]);
    }

    /**
     * Halaman Detail Berita (Baca Artikel)
     * Mengelola penghitungan tayangan (views), status like, dan komentar
     */
    public function beritaDetail($slug)
    {
        // Ambil data post beserta relasi kategori, tag, penulis, dan komentar terbaru
        $post = Post::with([
            'category',
            'tags',
            'author',
            'comments' => function ($q) {
                $q->latest();
            }
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        // 1. Logika Penghitung Kunjungan (Views Counter)
        // Mencegah penambahan berulang dalam satu sesi penjelajahan
        $sessionKey = 'viewed_post_' . $post->id;
        if (!Session::has($sessionKey)) {
            $post->increment('views');
            Session::put($sessionKey, true);
        }

        // 2. Status Like Sesi Ini
        $isLiked = Session::get('liked_post_' . $post->id, false);

        // 3. Ambil 3 Berita Terkait Berdasarkan Kategori yang Sama
        $relatedPosts = Post::with(['category'])
            ->where('id', '!=', $post->id)
            ->when($post->category_id, function ($q) use ($post) {
                $q->where('category_id', $post->category_id);
            })
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('BeritaDetail', [
            'post'         => $post,
            'relatedPosts' => $relatedPosts,
            'isLiked'      => (bool) $isLiked,
        ]);
    }

    /**
     * Aksi Beri Suka / Batal Suka (Toggle Like)
     */
    public function toggleLike($slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        $likeSessionKey = 'liked_post_' . $post->id;

        if (Session::has($likeSessionKey)) {
            // Jika sudah di-like sebelumnya, maka kurangi (Unlike)
            if ($post->likes > 0) {
                $post->decrement('likes');
            }
            Session::forget($likeSessionKey);
        } else {
            // Berikan Like
            $post->increment('likes');
            Session::put($likeSessionKey, true);
        }

        return back();
    }

    /**
     * Simpan Komentar Baru dari Pengunjung
     */
    public function storeComment(Request $request, $slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'nama'     => 'required|string|max:60',
            'komentar' => 'required|string|max:1000',
        ]);

        Comment::create([
            'post_id'  => $post->id,
            'nama'     => strip_tags($validated['nama']),
            'komentar' => strip_tags($validated['komentar']),
        ]);

        return back();
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
