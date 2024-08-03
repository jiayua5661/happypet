<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\SeriesProductInsertController; 
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// main_info區 查詢產品系列號是否已有、類別下拉選單
Route::get('/product_back/info/select/{seriesID?}',function($seriesID = null){
    $seriesIDCount = DB::scalar("SELECT count(*) FROM product_series WHERE id = ?",[$seriesID]);
    $categories = DB::select('SELECT id,description FROM product_category');
    // $categories->toArray();
    // Cannot use object of type stdClass as array ，解決↓ (編碼在解碼為Array)
    $categories = json_decode(json_encode($categories), true);

    // 預設message為null
    $message = null;
    if ($seriesID !== null && $seriesIDCount > 0) {
        // return response()->json(["message" => "此產品系列編號已使用"]);
        $message = (["message" => "此產品系列編號已使用"]);
        // echo json_encode($row['id']);
    } 
    $categoryArr = [];
    foreach($categories as $category){
        $categoryArr[] = $category['id']."-".$category['description'];    
    }
    // print_r($categories);

    return response()->json([
        'message'=>$message,
        'categories'=>$categoryArr
    ]);
 
});
// 產品主要資訊插入(系列產品)
Route::post('/product_back/info/create',[SeriesProductInsertController::class,'store']);