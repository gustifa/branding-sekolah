<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicController;
use App\Models\Presensi;
use Inertia\Inertia;
use App\Models\ProfilSekolah;
use App\Models\GuruStaff;
use App\Models\SaranaPrasarana;
use App\Models\Post;
use App\Models\ProgramKeahlian; // Tambahkan ini
// Pastikan model sudah di-import
use App\Models\Siswa;
use App\Models\Rombel;            // Sesuaikan dengan model rombongan belajar Anda
use Illuminate\Support\Facades\Schema;

// Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/', function () {
    return Inertia::render('Home', [
        'posts' => Post::where('status', 'published') // sesuaikan nilai 'published' sesuai value di database
            ->latest()
            ->take(3)
            ->get(),
        'profil' => ProfilSekolah::first(),
        'programs' => ProgramKeahlian::all(),
        'dataGuru' => GuruStaff::all(),
        'statistik' => [
            'totalSiswa'   => Schema::hasTable('siswas') ? Siswa::count() : 0,
            'totalGuru'    => Schema::hasTable('guru_staff') ? GuruStaff::count() : 0,
            'totalRombel'  => Schema::hasTable('rombels') ? Rombel::count() : 0,
            'totalProgram' => Schema::hasTable('program_keahlians') ? ProgramKeahlian::count() : 0,
        ],
    ]);
})->name('home');


// Tambahkan baris ini untuk halaman baca artikel
Route::get('/berita/{slug}', [PublicController::class, 'show'])->name('berita.show');

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/kiosk', function () {
    return view('kiosk');
});

Route::get('/kehadiran', function () {
    $hariIni = now()->toDateString();

    // Ambil data presensi hari ini, urutkan dari yang terbaru melakukan scan
    $presensiHariIni = Presensi::with('siswa')
        ->where('tanggal', $hariIni)
        ->orderBy('updated_at', 'desc')
        ->get();

    return Inertia::render('Kehadiran', [
        'presensi' => $presensiHariIni,
        'tanggal' => now()->translatedFormat('l, d F Y') // Format: Senin, 19 September 2026
    ]);
});

// Route::get('/profil', function () {
//     return Inertia::render('Profil', [
//         // Mengambil data profil pertama (karena sejarah/visi misi biasanya hanya 1 baris data)
//         'profil' => ProfilSekolah::first(),
//         // Mengambil semua data guru & staff
//         'guruStaff' => GuruStaff::orderBy('kategori')->get(),
//         // Mengambil semua data fasilitas
//         'sarpras' => SaranaPrasarana::all()
//     ]);
// });



// Route::get('/berita/{slug}', function ($slug, Post $post) {
//     // Ambil postingan terkait berdasarkan category_id yang sama (selain postingan saat ini)
//     $relatedPosts = Post::where('category_id', $post->category_id)
//         ->where('id', '!=', $post->id)
//         ->where('status', 'published')
//         ->when($post->category_id, function ($query) use ($post) {
//             $query->where('category_id', $post->category_id);
//         })
//         ->latest()
//         ->take(3)
//         ->get();
//     // Mencari berita berdasarkan slug, jika tidak ada kembalikan 404
//     $post = Post::where('slug', $slug)->firstOrFail();


//     return Inertia::render('BeritaDetail', [
//         'post' => $post->load(['category', 'tags', 'author']),
//         'relatedPosts' => $relatedPosts,
//     ]);
// });

// Route::get('/berita', [App\Http\Controllers\PublicController::class, 'berita'])->name('berita.index');

// Halaman Utama / Beranda
Route::get('/', [PublicController::class, 'home'])->name('home');

// Halaman Daftar Berita (Dukungan filter ?kategori=... dan ?arsip=...)
Route::get('/berita', [PublicController::class, 'berita'])->name('berita');

// Halaman Baca Detail Berita
Route::get('/berita/{slug}', [PublicController::class, 'beritaDetail'])->name('berita.detail');

// Halaman Guru & Tenaga Kependidikan
Route::get('/guru-staf', [PublicController::class, 'guruStaf'])->name('guru-staf');

// Halaman Profil Sekolah
Route::get('/profil', [PublicController::class, 'profil'])->name('profil');

Route::get('/guru-staf', function () {
    return Inertia::render('Frontend/DirektoriGuru', [
        // Mengambil semua data guru, bisa diganti paginate(12) jika data sangat banyak
        'dataGuru' => GuruStaff::all()
    ]);
});

Route::get('/siswa', function () {
    return Inertia::render('Frontend/DirektoriSiswa', [
        // Mengambil semua data siswa
        'dataSiswa' => Siswa::all()
    ]);
});


