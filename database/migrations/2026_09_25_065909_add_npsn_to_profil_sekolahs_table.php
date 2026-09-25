<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('profil_sekolahs', function (Blueprint $table) {
            $table->string('npsn', 50)->nullable()->after('nama_sekolah');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profil_sekolahs', function (Blueprint $table) {
            $table->dropColumn('npsn');
        });
    }
};
