<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        return Author::all();
    }

    public function show($id)
    {
        return Author::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        return Author::create($validated);
    }

    public function update(Request $request, $id)
    {
        $post = Author::findOrFail($id);

        $post->update($request->only(['name']));

        return $post;
    }

    public function destroy($id)
    {
        $post = Author::findOrFail($id);
        $post->delete();

        return response()->json(['message' => 'Autor eliminado']);
    }
}
