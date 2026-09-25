<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Post;
use App\Models\ProfilSekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // 1. Data Kategori yang memiliki artikel
        $footerCategories = Category::select('id', 'name', 'slug')
            ->has('posts')
            ->orderBy('name', 'asc')
            ->get();

        // 2. Data Arsip Berita (Agregasi Bulan & Tahun via PostgreSQL)
        $rawArchives = Post::select(
                DB::raw("TO_CHAR(created_at, 'YYYY-MM') as month_key"),
                DB::raw("EXTRACT(YEAR FROM created_at) as year"),
                DB::raw("EXTRACT(MONTH FROM created_at) as month"),
                DB::raw("COUNT(*) as total")
            )
            ->groupBy('month_key', 'year', 'month')
            ->orderBy('month_key', 'desc')
            ->take(12)
            ->get();

        $namaBulan = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $footerArchives = $rawArchives->map(function ($item) use ($namaBulan) {
            $bulan = $namaBulan[(int) $item->month] ?? '';
            return [
                'month_key' => $item->month_key,
                'formatted_date' => "{$bulan} {$item->year}",
                'total' => $item->total,
            ];
        });

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'pengaturanWeb' => ProfilSekolah::first(),
            'footerCategories' => $footerCategories,
            'footerArchives' => $footerArchives,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
