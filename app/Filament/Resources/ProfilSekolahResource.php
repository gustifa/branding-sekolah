<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProfilSekolahResource\Pages;
use App\Models\ProfilSekolah;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProfilSekolahResource extends Resource
{
    protected static ?string $model = ProfilSekolah::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-library';

    protected static ?string $navigationLabel = 'Profil & Pengaturan Web';

    protected static ?string $pluralModelLabel = 'Profil Sekolah';

    protected static ?string $navigationGroup = 'Pengaturan';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Pengaturan Lengkap')
                    ->tabs([
                        // ================= TAB 1: IDENTITAS SEKOLAH =================
                        Tabs\Tab::make('Identitas Sekolah')
                            ->icon('heroicon-o-academic-cap')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('nama_sekolah')
                                            ->label('Nama Sekolah')
                                            ->required()
                                            ->maxLength(255),

                                        TextInput::make('npsn')
                                            ->label('NPSN')
                                            ->maxLength(50),

                                        TextInput::make('email')
                                            ->label('Email Resmi')
                                            ->email()
                                            ->maxLength(100),

                                        TextInput::make('telepon')
                                            ->label('Nomor Telepon / WhatsApp')
                                            ->tel()
                                            ->maxLength(50),
                                    ]),

                                Textarea::make('alamat')
                                    ->label('Alamat Lengkap')
                                    ->rows(3)
                                    ->maxLength(500),

                                Grid::make(2)
                                    ->schema([
                                        FileUpload::make('logo')
                                            ->label('Logo Sekolah')
                                            ->image()
                                            ->disk('public')
                                            ->directory('pengaturan')
                                            ->imageEditor(),

                                        FileUpload::make('favicon')
                                            ->label('Favicon Browser')
                                            ->image()
                                            ->disk('public')
                                            ->directory('pengaturan'),
                                    ]),
                            ]),

                        // ================= TAB 2: SAMBUTAN KEPALA SEKOLAH =================
                        Tabs\Tab::make('Pimpinan & Sambutan')
                            ->icon('heroicon-o-user')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('nama_kepala_sekolah')
                                            ->label('Nama Kepala Sekolah')
                                            ->maxLength(255),

                                        FileUpload::make('foto_kepala_sekolah')
                                            ->label('Foto Kepala Sekolah')
                                            ->image()
                                            ->disk('public')
                                            ->directory('pengaturan')
                                            ->imageEditor(),
                                    ]),

                                RichEditor::make('sambutan_kepala_sekolah')
                                    ->label('Sambutan Kepala Sekolah')
                                    ->columnSpanFull(),
                            ]),

                        // ================= TAB 3: INTEGRASI AI (GEMINI) =================
                        Tabs\Tab::make('Integrasi AI')
                            ->icon('heroicon-o-sparkles')
                            ->schema([
                                Section::make('Google Gemini AI Vision')
                                    ->description('Masukkan API Key Google Gemini untuk mengaktifkan pembuatan berita dan konten otomatis dari foto kegiatan yang diunggah.')
                                    ->schema([
                                        TextInput::make('gemini_api_key')
                                            ->label('Gemini API Key')
                                            ->password()
                                            ->revealable()
                                            ->placeholder('AIzaSy...')
                                            ->helperText('Dapatkan API Key secara gratis di Google AI Studio (https://aistudio.google.com). Nilai ini tersimpan di database dan otomatis digunakan pada fitur auto-generate berita.')
                                            ->maxLength(255),
                                    ]),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('logo')
                    ->label('Logo')
                    ->disk('public'),

                TextColumn::make('nama_sekolah')
                    ->label('Nama Sekolah')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),

                TextColumn::make('telepon')
                    ->label('Telepon'),

                TextColumn::make('gemini_api_key')
                    ->label('Status API Key AI')
                    ->state(fn (ProfilSekolah $record): string => filled($record->gemini_api_key) ? 'Terpasang ✓' : 'Belum Diatur')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'Terpasang ✓' ? 'success' : 'danger'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProfilSekolahs::route('/'),
            'create' => Pages\CreateProfilSekolah::route('/create'),
            'edit' => Pages\EditProfilSekolah::route('/{record}/edit'),
        ];
    }
}
