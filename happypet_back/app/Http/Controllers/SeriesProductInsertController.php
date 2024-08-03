<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class SeriesProductInsertController extends Controller
{
    //
    function store(Request $request){

        try {

            // 開啟事務
            DB::beginTransaction();
            $request->validate([
                'coverimg' => 'required|file|mimes:jpeg,png,jpg|max:16384', // 最大 16MB
                'imgs.*' => 'required|file|mimes:jpeg,png,jpg|max:16384', 
                'descimgs.*' => 'required|file|mimes:jpeg,png,jpg|max:16384', 
            ]);

            $pdSeries = $request->input('pdSeries');
            $category = $request->input('category');
            $pdName = $request->input('pdName');
            $description1 = $request->input('description1');
            $description2 = $request->input('description2');
            $description3 = $request->input('description3');
            $description4 = $request->input('description4');
            $description5 = $request->input('description5');


            $coverimg = $request->file('coverimg');
            $imgs = $request->file('imgs');
            $descimgs = $request->file('descimgs');
            if($imgs && count($imgs) > 8 ){
                return response()->json(["error"=>"其他圖片不可以超過8張"]);
                DB::rollBack();
            }

            if(empty($description1)){
                DB::rollBack();
                return response()->json(["error" => "至少輸入一條敘述"]);
            }
            if(strlen($pdSeries) != 11){
                DB::rollBack();
                return response()->json(["error" => "產品系列編號為11碼"]);
            }
            $n = DB::insert("INSERT INTO product_series(id,category_id,name,description1,description2,description3,description4,description5)
            VALUES(?,?,?,?,?,?,?,?)",[$pdSeries,$category,$pdName,$description1,$description2,$description3,$description4,$description5]);
            

        
            // $sql = DB::insert("INSERT INTO product_seriesimg(series_id,img,pic_category_id,created_at)
            //         VALUES(?,?,?,NOW())",[]);

            // 處理封面圖
            // if ($coverimg['error'] === UPLOAD_ERR_OK) {
            // if ($request->hasFile($coverimg) && $coverimg->isValid() ){
            if ($coverimg && $coverimg->isValid() ){
                // $fileContent = file_get_contents($coverimg['tmp_name']);
                $fileContent = $coverimg->get();
                Log::info("封面圖片if有效");
                Log::info("封面圖片有效，檔案大小: " . strlen($fileContent));
                DB::insert("INSERT INTO product_seriesimg(series_id,img,pic_category_id,created_at)
                    VALUES(?,?,?,NOW())",[$pdSeries, $fileContent, 1]);
                // $stmt->execute([$pdSeries, $fileContent, 1]);
            }else{

                DB::rollBack();
                return response()->json(["error"=>"封面圖片上傳失敗"]);
            }

            

            // 處理其他圖片(8張)
            // if (!empty($imgs['tmp_name'][0])) {
            if ($imgs){
            // if ($request->hasFile($imgs)){
                // foreach ($imgs['tmp_name'] as $key => $tmpName) {
                foreach ($imgs as $img) {
                    if ($img->isValid()) {
                        $fileContent = $img->get();
                        Log::info("其他圖片有效，檔案大小: " . strlen($fileContent));
                        DB::insert("INSERT INTO product_seriesimg(series_id,img,pic_category_id,created_at)
                                    VALUES(?,?,?,NOW())",[$pdSeries, $fileContent, 2]);
                    }else{
                        DB::rollBack();
                        return response()->json(["error"=>"其他圖片上傳失敗"]);
                    }
                }
            }
            // 處理敘述圖片
            // if ($request->hasFile($descimgs)){
            if ($descimgs){
                foreach ($descimgs as $descimg) {
                    if ($descimg->isValid()) {
                        $fileContent = $descimg->get();
                        Log::info("敘述圖片有效，檔案大小: " . strlen($fileContent));

                        DB::insert("INSERT INTO product_seriesimg(series_id,img,pic_category_id,created_at)
                                    VALUES(?,?,?,NOW())",[$pdSeries, $fileContent, 3]);
                    }else{
                        DB::rollBack();
                        return response()->json(["error"=>"敘述圖片上傳失敗"]);
                    }
                }
            }
            DB::commit();
            return response()->json(["message" => "產品系列新增成功"]);
            // echo json_encode(["message" => "產品系列新增成功"]);
        }catch(\Exception $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(["error" => "發生錯誤222"]);
        }
    }
}
