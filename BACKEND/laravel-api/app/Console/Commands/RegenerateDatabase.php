<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

class RegenerateDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'regenerate:db';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reinicia la base de datos, ejecuta seeds y configura Passport';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->warn('🚨 Regenerando base de datos desde cero...');

        // 1. Limpiar claves antiguas de Passport
        $this->removePassportKeys();

        // 2. Eliminar oauth_clients y personal_clients si existen
        if (Schema::hasTable('oauth_clients')) {
            DB::table('oauth_clients')->truncate();
        }

        if (Schema::hasTable('oauth_personal_access_clients')) {
            DB::table('oauth_personal_access_clients')->truncate();
        }

        // 3. Migraciones frescas
        $this->call('migrate:fresh');
        $this->info('✅ Migraciones ejecutadas');

        // 4. Ejecutar seeders
        $this->call('db:seed');
        $this->info('✅ Seeders ejecutados');

        // 5. Generar nuevas claves de Passport
        $this->call('passport:keys', ['--force' => true]);
        $this->info('🔐 Nuevas claves generadas');

        // 6. Crear cliente Personal Access
        $this->call('passport:client', [
            '--personal' => true,
            '--name' => 'Laravel Personal Access Client',
            '--no-interaction' => true,
        ]);

        // 7. Crear cliente Password Grant
        $this->call('passport:client', [
            '--password' => true,
            '--name' => 'Laravel Password Grant Client',
            '--provider' => 'users',
            '--no-interaction' => true,
        ]);

        // 8. Limpiar cachés
        $this->call('optimize:clear');

        $this->info('🎉 Todo listo. El sistema fue reiniciado correctamente.');

        return SymfonyCommand::SUCCESS;
    }

    protected function removePassportKeys(): void
    {
        $this->info('🧹 Eliminando claves antiguas de Passport...');

        $keys = [
            storage_path('oauth-private.key'),
            storage_path('oauth-public.key'),
        ];

        foreach ($keys as $key) {
            if (File::exists($key)) {
                File::delete($key);
                $this->line("🗑️  Eliminada: $key");
            }
        }
    }
}
