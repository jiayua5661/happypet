<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Http\Controllers\SeriesProductInsertController; 
use App\Http\Controllers\DetailProductInsertController; 
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// main_info區 查詢產品系列號是否已有、類別下拉選單
Route::get('/product_back/info/select/{seriesID?}',function($seriesID = null){
    $seriesIDCount = DB::scalar("SELECT count(*) FROM product_series WHERE series_id = ?",[$seriesID]);
    $categories = DB::select('SELECT category_id,description FROM product_category');
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
        $categoryArr[] = $category['category_id']."-".$category['description'];    
    }
    // print_r($categories);

    return response()->json([
        'message'=>$message,
        'categories'=>$categoryArr,
    ]);
 
});
// 產品主要資訊插入(系列產品)
Route::post('/product_back/info/create',[SeriesProductInsertController::class,'store']);
// 產品詳細資訊：查詢系列編號

Route::post('/product_back/detail/show',function(Request $request) {
    $pdSeries = $request->input('pdSeries');
    Log::info('查詢產品系列ID:', ['pdSeries' => $pdSeries]); // 日誌查詢的ID
    $existPdSeries = DB::table('product_series')
    ->select('series_id','series_name')
    ->where('series_id',$pdSeries)
    ->first(); //// 使用 first() 取得單一結果
    if($existPdSeries){

        return response()->json($existPdSeries);
    }else{
        return response()->json(["error" => "查無此系列產品"]);
    }
});
// php artisan make:controller DetailProductInsertController
Route::post('/product_back/detail/create',[DetailProductInsertController::class,'store']);

// 查詢種類(狗狗、貓貓專區 product.html)
Route::get('/product/{c}',function($c){
    // $products = DB::select('select * from seriespdimg_view');
    // $products = DB::select("SELECT * FROM seriespdimg_view WHERE product_id LIKE '{$c}%'");
    $products = DB::select("SELECT * FROM seriespdimg_view WHERE product_id LIKE ? ",["{$c}%"]);
    // json_decode($products);
    // print_r($products);
    
    foreach($products as &$pd){
        // print_r($pd);
        if(isset($pd->cover_img)){
            $mime_type = (new finfo(FILEINFO_MIME_TYPE))->buffer($pd->cover_img);
            $pd->cover_img = base64_encode($pd->cover_img);
            $src = "data:{$mime_type};base64,{$pd->cover_img}";
           $pd->cover_img = $src;
        }
    }

    // print_r($products);
    return response()->json($products);
    // return response()->json($part);
    // return view('product1')->with('jsonString', json_encode($products, JSON_UNESCAPED_UNICODE));
});