<?php

namespace App\Http\Controllers;

use App\Models\HotelOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class HotelOrderController extends Controller
{
    

     // 日期訂單
     public function ordersByDate(Request $request)
     {
        // 確保 checkin 參數存在
        if ($request->has('checkin')) {
            $checkinDate = $request->input('checkin');
     
            $orders = DB::select("
                SELECT 
                    o.oid, 
                    u.name AS user_name, 
                    p.pet_name, 
                    o.room_type, 
                    o.checkin, 
                    o.checkout
                FROM hotel_orders o
                LEFT JOIN user_info u ON o.uid = u.uid 
                LEFT JOIN pet_info p ON o.pid = p.pid
                WHERE ? BETWEEN o.checkin AND o.checkout;
            ", [$checkinDate]);
     
            return response()->json($orders);
        }
     
        // 如果沒有提供 checkin 參數，返回空的 JSON
        return response()->json([]);
    }

    // 找當天訂單-後台
    public function allOrders(Request $request)
    {
       
    $orders = HotelOrder::with(['pet', 'user'])->get();
    
           $orders = DB::select("
               SELECT 
                   o.oid, 
                   u.name AS user_name, 
                   p.pet_name, 
                   o.room_type, 
                   o.checkin, 
                   o.checkout
               FROM hotel_orders o
               LEFT JOIN user_info u ON o.uid = u.uid 
               LEFT JOIN pet_info p ON o.pid = p.pid
           ");
    
           return response()->json($orders);
    
       // 如果沒有提供 checkin 參數，返回空的 JSON
       return response()->json([]);
   }
   // 找當天訂單-前端
   public function allOrdersFont(Request $request)
   {
     
   $orders = HotelOrder::with(['pet', 'user'])->get();
   
          return response()->json($orders);
   
      // 如果沒有提供 checkin 參數，返回空的 JSON
      return response()->json([]);
  }
 
    
    // 刪除訂單
    public function destroy($uid)
    {
        // 查找訂單
        $order = HotelOrder::where('uid', $uid)->first();
    
        if ($order) {
            $order->delete();
            return response()->json(['message' => '訂單刪除成功']);
        } else {
            return response()->json(['message' => '訂單刪除失敗'], 404);
        }
    }
    
    // 找空房

    public function checkAvailability(Request $request)
    {

        $checkInDate = $request->query('checkin'); // 使用 query() 方法讀取 GET 請求參數
        $checkOutDate = $request->query('checkout'); // 使用 query() 方法讀取 GET 請求參數
        $totalRoomsPerType = 3;  // 每個房型的總房間數
    
        // 定義所有房型 ,array_merge合併為一個陣列
        $roomTypes = ['深景房', '奢華房', '總統房', '喵皇房'];
    
        $results = DB::select("
        SELECT r.room_type, 
            ($totalRoomsPerType - COALESCE(h.spare_rooms, 0)) AS available_rooms 
        FROM (
            SELECT ? AS room_type
            UNION ALL
            SELECT ? AS room_type
            UNION ALL
            SELECT ? AS room_type
            UNION ALL
            SELECT ? AS room_type
        ) AS r
        LEFT JOIN (
            SELECT 
                room_type, COUNT(*) AS spare_rooms
            FROM hotel_orders 
            WHERE room_type IN ('深景房', '奢華房', '總統房', '喵皇房')
            AND ((? < checkout AND ? >= checkin)
                OR
                (? >= checkin AND ? < checkout))
            GROUP BY room_type
        ) AS h
        ON r.room_type = h.room_type
        WHERE ($totalRoomsPerType - COALESCE(h.spare_rooms, 0)) > 0;
        ", array_merge($roomTypes, [$checkInDate, $checkOutDate, $checkInDate, $checkInDate]));
    
        // 返回 JSON 格式的結果
        return response()->json([
            'room_availability' => $results
        ]);
    }

   // 查詢訂購人
   public function ordersByUser(Request $request)
   {
       // 確保 'name' 參數存在
       if ($request->has('name')) {
           $userName = $request->input('name');
   
           // 使用 DB::select 查詢
           $orders = DB::select("
               SELECT 
                   o.oid, 
                   u.name AS user_name, 
                   p.pet_name, 
                   o.room_type, 
                   o.checkin, 
                   o.checkout
               FROM 
                   hotel_orders o
               LEFT JOIN 
                   user_info u ON o.uid = u.uid
               LEFT JOIN 
                   pet_info p ON o.pid = p.pid
               WHERE 
                   u.name LIKE ?", ['%' . $userName . '%']
           );
   
           // 返回 JSON 格式的訂單數據
           return response()->json($orders);
       }
       
       // 如果沒有提供 'name' 參數，返回空的 JSON
       return response()->json([]);
   }
   // 取得使用者的寵物名稱
   public function userPetName(Request $request)
    {
        // 假設要查詢 UID 為 3 的寵物名稱
        $uid = 3;

        // 從請求中獲取 'uid' 參數->會員登入後再用
        // $uid = $request->input('uid');

        // 使用 DB::select 查詢
        $petNames = DB::select("
         SELECT 
             p.pet_name
         FROM 
            pet_info p
         WHERE 
            p.uid = ?", [$uid]
        );

        // 返回查詢結果作為 JSON
        return response()->json($petNames);
    }

}

    
    




    


    

