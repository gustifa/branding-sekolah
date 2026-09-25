<?php

namespace App\Services;

use App\Models\ProfilSekolah;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Exception;

class GeminiService
{
    /**
     * Dapatkan API Key secara dinamis:
     * 1. Cek dari database (ProfilSekolah)
     * 2. Fallback ke file .env
     */
    public static function getApiKey(): ?string
    {
        $profil = ProfilSekolah::first();
        if ($profil && !empty($profil->gemini_api_key)) {
            return trim((string) $profil->gemini_api_key);
        }

        $envKey = env('GEMINI_API_KEY');
        return !empty($envKey) ? trim((string) $envKey) : null;
    }

    /**
     * Hasilkan draf berita dari gambar
     */
    public static function generatePostFromImage($image): array
    {
        $apiKey = self::getApiKey();

        if (empty($apiKey)) {
            throw new Exception("API Key Gemini belum diatur! Masukkan API Key pada menu Pengaturan Web atau berkas .env.");
        }

        $imageContent = null;
        $mimeType = 'image/jpeg';

        // 1. Jika berupa file upload sementara (TemporaryUploadedFile)
        if ($image instanceof TemporaryUploadedFile) {
            $realPath =$image->getRealPath();
            if ($realPath && file_exists($realPath)) {$imageContent = file_get_contents($realPath);$mimeType = function_exists('mime_content_type')
                    ? (mime_content_type($realPath) ?: 'image/jpeg')
                    : 'image/jpeg';
            }
        }
        // 2. Jika berupa string path
        elseif (is_string($image)) {$diskName = config('filament.default_filesystem_disk', 'public');
            $disk = Storage::disk($diskName);

            if ($disk->exists($image)) {$imageContent = $disk->get($image);
            } elseif (file_exists($image)) {
                $imageContent = file_get_contents($image);
            } else {
                $fullPath = storage_path('app/public/' . ltrim($image, '/'));
                if (file_exists($fullPath)) {
                    $imageContent = file_get_contents($fullPath);
                }
            }

            if ($imageContent && class_exists(\finfo::class)) {
                $finfo = new \finfo(FILEINFO_MIME_TYPE);$detectedMime = $finfo->buffer($imageContent);
                if ($detectedMime) {
                    $mimeType =$detectedMime;
                }
            }
        }

        if (!$imageContent) {
            throw new Exception("Gambar tidak dapat dibaca oleh server.");
        }

        $base64Image = base64_encode($imageContent);

        // Prompt terstruktur untuk berita sekolah
        $prompt = "Kamu adalah staf humas dan jurnalis resmi sekolah dasar (SD). "
            . "Analisis foto kegiatan sekolah ini, lalu buatkan draf berita yang menarik, formal, dan inspiratif dalam bahasa Indonesia.\n\n"
            . "KEMBALIKAN HANYA FORMAT JSON MURNI (tanpa format markdown tambahan seperti ```json) dengan struktur:\n"
            . "{\n"
            . "  \"title\": \"Judul berita yang padat dan informatif\",\n"
            . "  \"content\": \"<p>Paragraf pembuka berita...</p><p>Paragraf isi mendeskripsikan kegiatan dan suasana foto...</p><p>Paragraf penutup dan harapan...</p>\",\n"
            . "  \"meta_description\": \"Ringkasan singkat maksimal 150 karakter untuk SEO.\"\n"
            . "}";

        // URL Absolut resmi Google Gemini API
        $endpoint = '[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent)';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])
        ->timeout(60)
        ->post($endpoint . '?key=' . urlencode($apiKey), [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                        [
                            'inline_data' => [
                                'mime_type' => $mimeType,
                                'data' => $base64Image,
                            ]
                        ]
                    ]
                ]
            ],
            'generationConfig' => [
                'response_mime_type' => 'application/json',
                'temperature' => 0.7,
            ]
        ]);

        if ($response->failed()) {
            $errorJson = $response->json();
            $pesanError = $errorJson['error']['message'] ?? $response->body();
            throw new Exception("Gemini Error: " . $pesanError);
        }

        $responseData = $response->json();
        $textResult = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

        // Bersihkan formatting markdown jika ada
        $textResult = preg_replace('/^```json\s*/i', '', trim($textResult));$textResult = preg_replace('/\s*```$/', '', $textResult);

        $json = json_decode($textResult, true);

        if (!$json || !isset($json['title'])) {
            throw new Exception("Format respons dari AI tidak valid atau gagal diparsing.");
        }

        return $json;
    }
}
