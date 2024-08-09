<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Http\Controllers\SeriesProductController; 
use App\Http\Controllers\DetailProductInsertController; 
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// main_info區 查詢產品系列號是否已有、類別下拉選單
Route::get('/product_back/info/select/{seriesID?}',function($seriesID = null){
    $seriesIDCount = DB::scalar("SELECT count(*) FROM product_series WHERE series_id = ?",[$seriesID]);
    $categories = DB::select('SELECT category_id,description FROM product_category');
    
    // Log::info('我是seriesIDCount',['seriesIDCount',$seriesIDCount]);
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
Route::post('/product_back/info/update/{seriesID?}',function($seriesID = null){
    $seriesProduct = DB::select("SELECT * FROM  product_series ps 
                                JOIN product_seriesimg psi 
                                ON ps.series_id  = psi.series_id
                                WHERE ps.series_id = ?",[$seriesID]);
    foreach($seriesProduct as &$spdImg){
        // print_r($pd);
        if(isset($spdImg->img)){
            $mime_type = (new finfo(FILEINFO_MIME_TYPE))->buffer($spdImg->img);
            $spdImg->img = base64_encode($spdImg->img);
            $src = "data:{$mime_type};base64,{$spdImg->img}";
            $spdImg->img = $src;
        }
    };
    return response()->json([
        'seriesProduct'=>$seriesProduct,
    ]);
});

// 產品主要資訊插入(系列產品)
// Route::post('/product_back/info/update',[SeriesProductController::class,'update']);

Route::prefix('/product_back/info')->group(function () {
    Route::post('/create',[SeriesProductController::class,'store'] );
    Route::post('/update',[SeriesProductController::class,'update']);
});

// 產品主要資訊插入(系列產品)
Route::post('/product_back/info/create',[SeriesProductController::class,'store']);
// 產品詳細資訊：查詢系列編號
Route::post('/product_back/detail/show',function(Request $request) {
    $pdSeries = $request->input('pdSeries');
    // Log::info('查詢產品系列ID:', ['pdSeries' => $pdSeries]); // 日誌查詢的ID
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
    // return view('product1')->with('jsonString', json_encode($products, JSON_UNESCAPED_UNICODE));
});

// 查詢此產品資訊(product_item.html)
Route::get('/product/{c}/{seriesProduct}',function($c,$seriesProduct){
    // $products = DB::select("SELECT * FROM seriespdimg_view WHERE product_id like '{$c}%' and series_AINUM = '{$seriesProduct}'");
    $products = DB::select("SELECT * FROM seriespdimg_view WHERE product_id like ? and series_ai_id = ?", ["{$c}%", $seriesProduct]);
    $productImgs = DB::select("SELECT psi.*,spv.series_ai_id
                                FROM seriespdimg_view spv
                                JOIN product_series ps
                                ON spv.series_ai_id = ps.series_ai_id
                                JOIN product_seriesimg psi 
                                ON ps.series_id = psi.series_id 
                                WHERE spv.series_ai_id = ?
                                GROUP BY psi.id ,psi.series_id,psi.img,psi.pic_category_id ,psi.create_date 
                            ",[$seriesProduct]);
    // $category = DB::scalar("SELECT description FROM product_category WHERE id = '{$c}'");
    $category = DB::scalar("SELECT description FROM product_category WHERE category_id = ?",["{$c}"]);

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
    foreach($productImgs as &$pdImg){
        // print_r($pd);
        if(isset($pdImg->img)){
            $mime_type = (new finfo(FILEINFO_MIME_TYPE))->buffer($pdImg->img);
            $pdImg->img = base64_encode($pdImg->img);
            $src = "data:{$mime_type};base64,{$pdImg->img}";
            $pdImg->img = $src;
        }
    }
    // return response()->json($products);
    return response()->json([
        'products' => $products,
        'productImgs' => $productImgs,
        'categoryName' => $category
    
    ]);
});

// 插入購物車
Route::get('/product/insert/{poductID}/{quantity}',function($poductID,$quantity){
    // 會傳回異動筆數
    if(!isset($poductID) || !isset($quantity)){
        echo '尚未選擇產品';
    }else{
        $pdCount = DB::scalar("SELECT count(*) FROM shopping_cart_item WHERE product_id = ?",[$poductID]);
        // echo 'pdCount'.json_encode($pdCount);
        // echo 'pdCount'.$pdCount;
        // echo $pdCount;
        if($pdCount >= 1){
            $n = DB::update("UPDATE shopping_cart_item 
                            SET quantity = quantity + ?
                            WHERE product_id = ?",[$quantity,$poductID]);

            echo $n;
        }else{
            // $n = DB::insert("insert into userinfo (uid,cname) values(?,?)",[$uid,$cname]);
            DB::select("call giveOrderNumber(@current_order)");
            $callProcedure = DB::select('select @current_order');
            
            Log::info('callProcedure:', $callProcedure); // 日誌查詢的ID
            // Log::info('orderNumber_1 :', $callProcedure[0]->{'@current_order'}); // 日誌查詢的ID
            $orderNumber = $callProcedure[0]->{'@current_order'}; //取得orderNumber
            Log::info('orderNumber_2 :', ['orderNumber' => $orderNumber]); // 日誌查詢的ID
            Log::info('今天日期:', ['今天日期' => now()]); 

            $n = DB::insert("INSERT INTO shopping_cart_item(order_number,uid,product_id,quantity,create_time)
                        VALUES(?,'qwe123',?,?,NOW())",[$orderNumber,$poductID,$quantity]);
            // echo "異動筆數".$n;
            echo $n;
        }
    }
});
// 查詢購物車
Route::get('/productcart/{uid}',function($uid){
    session(['uid' => 'qwe123']);
    $uid = session('uid');
    // $_SESSION["uid"] = 'qwe123';
    $totalAmount = DB::scalar("SELECT COALESCE(SUM(quantity), 0) FROM shopping_cart_item WHERE uid = '{$uid}'");
    echo $totalAmount;
});

// 產品入庫
Route::post('/product_back/warehouse',function(Request $request){
    $productID = $request->input('productID');
    $action = $request->input('action');
    
    if($action === 'fetch'){
        $products = DB::select("SELECT p.product_id,CONCAT_WS(' / ', nullif(ps.series_name,''),nullif(flavor,''),
                                    nullif(weight,''),nullif(size,''),nullif(style,'')) AS full_name
                                FROM product p
                                JOIN product_series ps 
                                ON p.series_ai_id = ps.series_ai_id
                                WHERE p.product_id = ? ",[$productID]);
        if(count($products) > 0){
            // foreach($products as $product){
            return response()->json($products[0]);
            // }
        }else{
            return response()->json(["error" => "查無此產品"]);
        }
    }else if($action === 'insert'){
        // $productID = $request->input('productID');
        $mfd = $request->input('mfd');
        $exp = $request->input('exp');
        $inventory = $request->input('inventory');
        $restockDate = $request->input('restockDate');
        // $data = $request->all();
        // DB::table('product_warehouse')->insert($data);
        try{
            DB::insert("INSERT INTO product_warehouse (product_id,inventory,mfd,exp,restock_date) 
                    VALUES(?,?,?,?,?)",[$productID,$inventory,$mfd,$exp,$restockDate]);
            return response()->json(["message" => "產品已入庫"]);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(["error" => "產品入庫失敗"]);
    
        }
    }
    
});