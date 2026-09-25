<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'parent_id',
        'nama',
        'komentar',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // Relasi untuk mengambil balasan dari komentar ini
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->oldest();
    }

    // Relasi ke komentar induk
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }
}
