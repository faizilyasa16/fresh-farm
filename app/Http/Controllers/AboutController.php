<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function company(): Response
    {
        return Inertia::render('About/Kami');
    }

    public function contact(): Response
    {
        return Inertia::render('About/Hubungi');
    }

    public function location(): Response
    {
        return Inertia::render('About/Lokasi');
    }

    public function delivery(): Response
    {
        return Inertia::render('About/Pengiriman');
    }

    public function guarantee(): Response
    {
        return Inertia::render('About/Garansi');
    }
}
