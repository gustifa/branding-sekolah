<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Filament\Resources\PostResource\RelationManagers;
use App\Models\Post;
use App\Services\GeminiService;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use FilamentTiptapEditor\Enums\TiptapOutput;
use FilamentTiptapEditor\TiptapEditor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';

    // Masukkan ke dalam grup dropdown (Folder)
    protected static ?string $navigationGroup = 'Manajemen Web';

    // Atur urutan menu (angka lebih kecil = posisi lebih atas)
    protected static ?int $navigationSort = 10;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Otomatis mengisi author_id dengan admin yang sedang login
                Hidden::make('author_id')
                    ->default(fn () => auth()->id()),

                Grid::make(3)->schema([
                    // ================= KOLOM KIRI: KONTEN UTAMA (2/3) =================
                    Section::make('Konten Berita')
                        ->schema([
                            TextInput::make('title')
                                ->label('Judul Berita')
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn (string $operation, $state, Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                            TextInput::make('slug')
                                ->required()
                                ->unique(ignoreRecord: true),

                            TiptapEditor::make('content')
                                ->label('Isi Berita')
                                ->profile('default')
                                ->output(TiptapOutput::Html)
                                ->disk('public')
                                ->directory('posts/content-images')
                                ->maxContentWidth('5xl')
                                ->required()
                                ->columnSpanFull(),
                        ])->columnSpan(2),

                    // ================= KOLOM KANAN: PENGATURAN & SEO (1/3) =================
                    Grid::make(1)->schema([
                        Section::make('Publikasi')
                            ->schema([
                                Select::make('status')
                                    ->options([
                                        'draft' => 'Draft',
                                        'published' => 'Dipublikasikan',
                                        'archived' => 'Diarsipkan',
                                    ])
                                    ->default('draft')
                                    ->required(),

                                DateTimePicker::make('published_at')
                                    ->label('Tanggal Publikasi'),

                                // GAMBAR UTAMA DENGAN AKSI GENERATE AI
                                FileUpload::make('featured_image')
                                    ->label('Gambar Utama (Thumbnail)')
                                    ->image()
                                    ->disk('public')
                                    ->directory('posts/thumbnails')
                                    ->live()
                                    ->hintAction(
                                        Action::make('generateWithAi')
                                            ->label('✨ Buat Berita dengan AI')
                                            ->icon('heroicon-m-sparkles')
                                            ->color('success')
                                            ->visible(fn (Get $get) => filled($get('featured_image')))
                                            ->requiresConfirmation()
                                            ->modalHeading('Buat Berita Otomatis dari Foto')
                                            ->modalDescription('AI akan menganalisis foto kegiatan ini lalu mengisi Judul, Slug, Isi Berita (Tiptap Editor), dan Meta SEO secara otomatis. Lanjutkan?')
                                            ->modalSubmitActionLabel('Ya, Buat Berita')
                                            ->action(function (Get $get, Set $set) {
                                                $image = $get('featured_image');

                                                if (!$image) {
                                                    Notification::make()
                                                        ->title('Unggah gambar terlebih dahulu!')
                                                        ->danger()
                                                        ->send();
                                                    return;
                                                }

                                                // Tangani format array jika Livewire mengembalikan multiple/array upload
                                                if (is_array($image)) {
                                                    $image = array_values($image)[0] ?? null;
                                                }

                                                try {
                                                    Notification::make()
                                                        ->title('Sedang memproses...')
                                                        ->body('AI sedang menganalisis foto dan merangkai berita.')
                                                        ->info()
                                                        ->send();

                                                    // Panggil Service Gemini
                                                    $aiResult = GeminiService::generatePostFromImage($image);

                                                    // Isi field form secara instan
                                                    $set('title', $aiResult['title']);
                                                    $set('slug', Str::slug($aiResult['title']));
                                                    $set('content', $aiResult['content']);

                                                    if (!empty($aiResult['meta_description'])) {
                                                        $set('meta_description', $aiResult['meta_description']);
                                                        $set('meta_title', $aiResult['title']);
                                                    }

                                                    Notification::make()
                                                        ->title('Berhasil Dibuat!')
                                                        ->body('Judul, Isi Berita, dan SEO berhasil terisi otomatis.')
                                                        ->success()
                                                        ->send();

                                                } catch (\Exception $e) {
                                                    Notification::make()
                                                        ->title('Gagal membuat berita')
                                                        ->body($e->getMessage())
                                                        ->danger()
                                                        ->send();
                                                }
                                            })
                                    ),
                            ]),

                        Select::make('category_id')
                            ->label('Kategori')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->label('Nama Kategori')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique(table: 'categories', column: 'slug'),
                            ]),

                        Select::make('tags')
                            ->label('Tag Berita')
                            ->multiple()
                            ->relationship('tags', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->label('Nama Tag')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique(table: 'tags', column: 'slug'),
                            ]),

                        Section::make('Pengaturan SEO')
                            ->schema([
                                TextInput::make('meta_title')
                                    ->label('Meta Title (Opsional)'),
                                Textarea::make('meta_description')
                                    ->label('Meta Description')
                                    ->maxLength(160),
                                TextInput::make('meta_keywords')
                                    ->label('Meta Keywords'),
                            ]),

                    ])->columnSpan(1),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('featured_image')
                    ->label('Gambar')
                    ->disk('public'),

                TextColumn::make('title')
                    ->searchable()
                    ->label('Judul'),

                BadgeColumn::make('status')
                    ->colors([
                        'danger' => 'draft',
                        'success' => 'published',
                        'warning' => 'archived',
                    ]),

                TextColumn::make('author.name')
                    ->label('Penulis'),

                TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('category.name')
                    ->label('Kategori')
                    ->sortable()
                    ->badge(),

                TextColumn::make('tags.name')
                    ->label('Tag')
                    ->badge()
                    ->separator(', '),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
