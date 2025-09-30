<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $names = [
        'ver usuarios','crear usuarios','editar usuarios','eliminar usuarios',
        'ver posts','crear posts','editar posts','eliminar posts',
        'ver autores','crear autores','editar autores','eliminar autores',
        ];

        foreach ($names as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'api']);
        }
        
        $adminUser = User::query()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('123456789'),
            'email_verified_at' => now()
        ]);

        $employeeUser = User::query()->create([
            'name' => 'employee1',
            'email'=> 'employee1@employee.com',
            'password' => Hash::make('123456789'),
            'email_verified_at' => now()
        ]);

        // Admin
        $roleAdmin = Role::firstOrCreate(['name' => 'super-admin','guard_name' => 'api']);
        $adminUser->assignRole($roleAdmin);
        $permissionsAdmin = Permission::where('guard_name', 'api')->pluck('name');
        $roleAdmin->syncPermissions($permissionsAdmin);

        // Employee
        $roleEmployee = Role::firstOrCreate(['name' => 'employee','guard_name' => 'api']);
        $employeeUser->assignRole($roleEmployee);
        $roleEmployee->syncPermissions(['ver posts','ver autores','crear posts','editar posts','crear autores','editar autores']);
    }
}
