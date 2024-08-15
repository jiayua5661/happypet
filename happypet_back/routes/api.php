<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


use App\Http\Controllers\SeriesProductInsertController;
use App\Http\Controllers\DetailProductInsertController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// main_info區 查詢產品系列號是否已有、類別下拉選單
Route::get('/product_back/info/select/{seriesID?}', function ($seriesID = null) {
    $seriesIDCount = DB::scalar("SELECT count(*) FROM product_series WHERE series_id = ?", [$seriesID]);
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
    foreach ($categories as $category) {
        $categoryArr[] = $category['category_id'] . "-" . $category['description'];
    }
    // print_r($categories);

    return response()->json([
        'message' => $message,
        'categories' => $categoryArr,
    ]);
});
// 產品主要資訊插入(系列產品)
Route::post('/product_back/info/create', [SeriesProductInsertController::class, 'store']);
// 產品詳細資訊：查詢系列編號

Route::post('/product_back/detail/show', function (Request $request) {
    $pdSeries = $request->input('pdSeries');
    Log::info('查詢產品系列ID:', ['pdSeries' => $pdSeries]); // 日誌查詢的ID
    $existPdSeries = DB::table('product_series')
        ->select('series_id', 'series_name')
        ->where('series_id', $pdSeries)
        ->first(); //// 使用 first() 取得單一結果
    if ($existPdSeries) {

        return response()->json($existPdSeries);
    } else {
        return response()->json(["error" => "查無此系列產品"]);
    }
});
// php artisan make:controller DetailProductInsertController
Route::post('/product_back/detail/create', [DetailProductInsertController::class, 'store']);


//////////////////////////////////// HUEI ////////////////////////////////////////


Route::get("/shelves", function (Request $request) {
    $status= $request->input('status');
    $shelves_products = DB::select("select * from VW_shelves where shelves_status=?",[$status]);
    return response(json_encode($shelves_products))
        ->header("content-type", "application/json")
        ->header("charset", "utf-8")
        ->header("Access-Control-Allow-Origin", "*")     
        ->header("Access-Control-Allow-Methods", "GET");
});

Route::put("/shelves/status_update/{product_id}", function (Request $request, $product_id) {
    $status = $request->input('status');
    $price = $request->input('price');
    $inventory = $request->input('inventory');
    $shelves_product_update = DB::update("update product set shelves_status =? , price = ? , update_date= now() where product_id =?", [$status, $price, $product_id]);
    $shelves_inventory_update = DB::update("update product_warehouse set inventory =? where product_id =?", [$inventory, $product_id]);
    if (($shelves_product_update + $shelves_inventory_update) > 0) {
        return response()->json(['message' => 'Product updated successfully']);
    } else {
        return response()->json(['message' => 'No product found or updated'], 404);
    }
});


Route::post("/orders_search", function (Request $request) {
    $status = $request->input('status');
    $searchOrdernumber = $request->input('searchOrdernumber');
    $phone = $request->input('phone');
    $sql = "select * FROM orders ";

    if ($status == 'all') {
        if (Str::length($searchOrdernumber)) {
            $sql = $sql . "where order_number like ? ";
            $orders = DB::select($sql, [$searchOrdernumber]);
        } elseif (Str::length($phone)) {
            $sql = $sql . "where user_phone like ? ";
            $orders = DB::select($sql, [$phone]);
        } else {
            $orders = DB::select($sql);
        }
    } else {
        if (Str::length($searchOrdernumber)) {
            $sql = $sql . "where order_status=? and  order_number like ?";
            $orders = DB::select($sql, [$status, $searchOrdernumber]);
        } else {
            $sql = $sql . "where order_status=?";
            $orders = DB::select($sql, [$status]);
        }
    }

    return response(json_encode($orders))
        ->header("content-type", "application/json")
        ->header("charset", "utf-8")
        ->header("Access-Control-Allow-Origin", "*")
        ->header("Access-Control-Allow-Methods", "POST");
});

Route::post("/orders_detail_search", function (Request $request) {
    $order_number = $request->input('order_number');
    $sql = "select * FROM vw_orderdetail where order_number= ?";
    $order_details = DB::select($sql, [$order_number]);
    foreach ($order_details as &$order) {
        if (!empty($order->product_pic)) {
            $order->product_pic = base64_encode($order->product_pic);
        }
    }

    return response(json_encode($order_details))
        ->header("content-type", "application/json")
        ->header("charset", "utf-8")
        ->header("Access-Control-Allow-Origin", "*")
        ->header("Access-Control-Allow-Methods", "POST");
});




Route::put("/orders/note_update/{order_number}", function (Request $request, $order_number) {
    $note = $request->input('note');
    $note = $note ?? null;
    $order_status = $request->input('order_status');
    $note_update = DB::update("update orders set note =? , order_status=?  where order_number =?", [$note, $order_status, $order_number]);

    if ($note_update > 0) {
        return response()->json(['message' => 'Product updated successfully']);
    } else {
        return response()->json(['message' => 'No product found or updated'], 404);
    }
});


Route::post("/orderdetailwithuid", function (Request $request) {
    $uid = $request->input('uid');

    $sql = "select * FROM vw_orderdetail where uid= ? and buy_status='N'";

    $order_details = DB::select($sql, [$uid]);

    foreach ($order_details as &$order) {
        if (!empty($order->product_pic)) {
            $order->product_pic = base64_encode($order->product_pic);
        }
    }

    return response(json_encode($order_details))
        ->header("content-type", "application/json")
        ->header("charset", "utf-8")
        ->header("Access-Control-Allow-Origin", "*")
        ->header("Access-Control-Allow-Methods", "POST");
});


Route::delete("/orderdetail_delete", function (Request $request) {
    $uid = $request->input('uid');
    $pid = $request->input('product_id');

    $sql = "delete FROM shopping_cart_item where uid= ? and product_id =?";

    $delete_item = DB::delete($sql, [$uid, $pid]);

    if ($delete_item > 0) {
        return response()->json(['message' => 'Product updated successfully']);
    } else {
        return response()->json(['message' => 'No product found or updated'], 404);
    }
});


Route::post("/userinfoforbill", function (Request $request) {
    $uid = $request->input('uid');
    $sql = "select * FROM users where uid= ?";
    $userinfo = DB::select($sql, [$uid]);

    return response(json_encode($userinfo))
        ->header("content-type", "application/json")
        ->header("charset", "utf-8")
        ->header("Access-Control-Allow-Origin", "*")
        ->header("Access-Control-Allow-Methods", "POST");
});


Route::post("/orderinsert", function (Request $request) {
    $order_number = $request->input('order_number');
    $user_name = $request->input('user_name');
    $user_phone = $request->input('user_phone');
    $user_email = $request->input('user_email');
    $consignee_name = $request->input('consignee_name');
    $consignee_phone = $request->input('consignee_phone');
    $send = $request->input('send');
    $send_address = $request->input('send_address');
    $invoice = $request->input('invoice');
    $pay = $request->input('pay');
    $total = $request->input('total');

    $sql = "insert INTO orders (order_number, user_name, user_phone, user_email, consignee_name, consignee_phone, send, send_address, invoice, pay, total, order_status, create_time, note)
            VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '2', now(), NULL);";

    $orders = DB::insert($sql, [$order_number, $user_name, $user_phone, $user_email, $consignee_name, $consignee_phone, $send, $send_address, $invoice, $pay, $total]);

    if ($orders > 0) {
        return response()->json($orders);
    } else {
        return response()->json($orders, 404);
    }
});


Route::post("/productqupdate", function (Request $request) {
    $nupdatedata = $request->input('nupdatedata');

    foreach ($nupdatedata as $product) {
        if ($product['product_id']) {
            $sql = "update shopping_cart_item 
            SET  quantity=?
            WHERE product_id=? and order_number =? ;";
            $pupdate = DB::update($sql, [$product['quantity'], $product['product_id'], $product['order_number']]);
        }

        // DB::table('shopping_cart_item')->where('product_id', 1)->update(['quantity' => $product['quantity']]);
    }
    if ($pupdate > 0) {
        return response()->json(['message' => 'Product updated successfully']);
    } else {
        return response()->json(['message' => 'No product found or updated'], 404);
    }
});
//////////////////////////////////// HUEI ////////////////////////////////////////