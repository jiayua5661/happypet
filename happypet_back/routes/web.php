<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;

Route::get('/', function () {
    return view('welcome');
});

// Route::get('/send', [CheckoutController::class, 'sendview'])->name('send');

