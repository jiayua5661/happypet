<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use finfo;

class UserinfoController extends Controller
{
    function show_userinfo(Request $request){
        // echo $request->input('uid');
        $data = DB::select('select * from user_info where uid=?', [$request->input('uid')]);
        $result = collect($data)->map(function($row) {
            return [
                'user_name' => $row->cname,  // 將 cname 對應到 user_name
                'user_gender' => $row->sex,
                'user_email' => $row->email,
                'user_phone1' => $row->cellphone,
                'user_phone2' => $row->cellphone2,
                'user_address' => $row->address,
            ];
        });
        return response()->json($data);

    }

    function edit_userinfo(Request $request) {
        // 準備要更新的資料
        $updatedData = [
            'cname' => $request->input('user_name'),
            'user_gender' => $request->input('user_gender'),
            'user_email' => $request->input('user_email'),
            'user_phone1' => $request->input('user_phone1'),
            'user_phone2' => $request->input('user_phone2'),
            'user_address' => $request->input('user_address')
        ];
    
        // 更新資料庫
        $updateResult = DB::table('user_info')
            ->where('uid', $request->input('uid'))
            ->update($updatedData);
    
        if ($updateResult) {
            return response()->json(["message" => "資料更新成功！"]);
        } else {
            return response()->json(["error" => "資料更新失敗，再試一次"]);
        }
    }
}
