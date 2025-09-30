<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    
    public function index()
    {
        return Post::with('author:id,name')->latest()->get();
    }

    public function show($id)
    {
        return Post::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:posts',
            'body' => 'required|string',
            'author_id' => 'required|exists:authors,id'
        ]);

        $post = Post::create($validated);

        return $post->load('author:id,name');
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:posts,title,'. $post->id,
            'body' => 'required|string',
            'author_id' => 'required|integer|exists:authors,id',
        ]);

        $post->update($validated);

        return $post->load('author:id,name');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json(['message' => 'Post eliminado']);
    }
}
