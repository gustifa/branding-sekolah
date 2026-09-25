<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\DashboardStatsOverview;
use App\Models\ProfilSekolah;
use BezhanSalleh\FilamentShield\FilamentShieldPlugin;
use Filament\AvatarProviders\UiAvatarsProvider;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            // Nama Brand Dinamis dari Profil Sekolah
            ->brandName(fn () => ProfilSekolah::first()?->nama_sekolah ?? 'Portal Admin')
            // Logo Brand Dinamis (Opsional: otomatis tampil jika ada logo di database)
            ->brandLogo(function () {
                $logo = ProfilSekolah::first()?->logo;
                return $logo ? asset('storage/' . $logo) : null;
            })
            ->brandLogoHeight('2.5rem')
            // Favicon Dinamis dari Profil Sekolah
            ->favicon(function () {
                $favicon = ProfilSekolah::first()?->favicon;
                return $favicon ? asset('storage/' . $favicon) : asset('favicon.ico');
            })
            // Skema Warna Utama
            ->colors([
                'primary' => Color::Amber,
            ])
            // Avatar Provider Bawaan (Warna-warni sesuai nama pengguna)
            ->defaultAvatarProvider(UiAvatarsProvider::class)
            // Struktur Grup Navigasi Sidebar
            ->navigationGroups([
                'Data Induk',
                'Manajemen Web',
                'Operasional & Presensi',
                'Filament Shield',
                'Pengaturan',
                'Sistem',
            ])
            // Resource & Page Discovery
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            // Widget Discovery
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
                // DashboardStatsOverview::class,
            ])
            // Middleware Standar Filament
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            // Plugin Filament
            ->plugins([
                FilamentShieldPlugin::make(),
            ]);
    }
}
