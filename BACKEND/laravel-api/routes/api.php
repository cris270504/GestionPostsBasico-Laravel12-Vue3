<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    return 'api';
});

// Login público
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:api')->group(
    function () {
        Route::get('/get-user', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        //ROLES
        Route::get('/roles', [RoleController::class, 'index'])->middleware(['permission:ver usuarios']);

        // USERS
        Route::get('/users', [UserController::class, 'index'])->middleware('permission:ver usuarios');
        Route::post('/users', [UserController::class, 'store'])->middleware('permission:crear usuarios');
        Route::get('/users/{user}', [UserController::class, 'show'])->middleware('permission:ver usuarios');
        Route::put('/users/{user}', [UserController::class, 'update'])->middleware('permission:editar usuarios');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('permission:eliminar usuarios');

        // POSTS
        Route::get('/posts', [PostController::class, 'index'])->middleware('permission:ver posts');
        Route::post('/posts', [PostController::class, 'store'])->middleware('permission:crear posts');
        Route::get('/posts/{post}', [PostController::class, 'show'])->middleware('permission:ver posts');
        Route::put('/posts/{post}', [PostController::class, 'update'])->middleware('permission:editar posts');
        Route::delete('/posts/{post}', [PostController::class, 'destroy'])->middleware('permission:eliminar posts');

        // AUTHORS
        Route::get('/authors', [AuthorController::class, 'index'])->middleware('permission:ver autores');
        Route::post('/authors', [AuthorController::class, 'store'])->middleware('permission:crear autores');
        Route::get('/authors/{author}', [AuthorController::class, 'show'])->middleware('permission:ver autores');
        Route::put('/authors/{author}', [AuthorController::class, 'update'])->middleware('permission:editar autores');
        Route::delete('/authors/{author}', [AuthorController::class, 'destroy'])->middleware('permission:eliminar autores');
    }
);
