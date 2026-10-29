<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Fresh Farm adalah marketplace hewan ternak untuk kurban, aqiqah, dan usaha kuliner. Dapatkan sapi, kambing, domba, dan kerbau langsung dari peternak lokal.">
    <title inertia>Fresh Farm | Marketplace Hewan Ternak Terpercaya</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="min-h-screen bg-[#fbfbf9] text-[#1c1917] font-sans antialiased selection:bg-[#2d6a4f] selection:text-white">
    @inertia
</body>
</html>
