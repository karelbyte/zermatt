<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('users/create', [
            'modules' => config('modules'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::query()->create($request->validated());

        return redirect()->route('users.index')
            ->with('status', __('Usuario creado correctamente.'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user,
            'modules' => config('modules'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = collect($request->validated())->except('password')->all();
        $user->fill($data);

        if ($request->filled('password')) {
            $user->password = $request->validated('password');
        }

        $user->save();

        return redirect()->route('users.index')
            ->with('status', __('Usuario actualizado correctamente.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')
            ->with('status', __('Usuario eliminado correctamente.'));
    }
}
