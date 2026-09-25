<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\HasAvatar;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'avatar_url'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements HasAvatar
{
    use HasRoles, HasFactory, Notifiable;

    /**
     * Dapatkan URL avatar untuk Filament Panel
     */
    public function getFilamentAvatarUrl(): ?string
    {
        // 1. Jika pengguna memiliki file foto profil yang diunggah
        if (!empty($this->avatar_url)) {
            return Storage::url($this->avatar_url);
        }

        // 2. Fallback: Avatar modern dengan inisial nama, background biru gelap, & teks putih
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=FFFFFF&background=1E3A8A&bold=true';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isOnline(): bool
    {
        return Cache::has('user-is-online-' . $this->id);
    }
}
