<?php

namespace Database\Factories;

use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),   // título de ejemplo
            'body'  => $this->faker->paragraph(4),  // contenido de ejemplo
            'author_id' =>  Author::inRandomOrder()->first()->id,
        ];
    }
}
