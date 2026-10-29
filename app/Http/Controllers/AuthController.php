<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email atau kata sandi yang Anda masukkan tidak sesuai.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))->with('success', 'Selamat datang kembali di Fresh Farm.');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone_number' => ['required', 'string', 'max:25'],
            'role' => ['required', Rule::in(['buyer', 'seller'])],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:1000'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Nama lengkap atau nama kandang wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.unique' => 'Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.',
            'phone_number.required' => 'Nomor WhatsApp aktif wajib diisi.',
            'role.in' => 'Peran pengguna harus sebagai pembeli atau peternak.',
            'city.required' => 'Kota atau kabupaten wajib diisi.',
            'address.required' => 'Alamat lengkap wajib diisi.',
            'password.min' => 'Kata sandi minimal terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'role' => $validated['role'],
            'city' => $validated['city'],
            'address' => $validated['address'],
            'password' => $validated['password'],
            'email_verified_at' => $validated['role'] === 'buyer' ? now() : null,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        $welcomeMessage = $user->isSeller()
            ? 'Akun mitra peternak berhasil dibuat. Silakan tambahkan data ternak kandang Anda.'
            : 'Akun pembeli berhasil dibuat. Selamat menjelajahi ternak terverifikasi.';

        return redirect()->route('dashboard')->with('success', $welcomeMessage);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('marketplace.home')->with('success', 'Anda telah keluar dari sesi akun.');
    }
}
