<?php
// model 用來處理資料，不涉及任何使用者介面，例如資料庫存取

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelOrder extends Model
{
    use HasFactory;

    protected $table = 'hotel_orders';
    protected $primaryKey = 'oid';
    public $incrementing = true;
    protected $keyType = 'string';
    protected $fillable = [
        'checkin', 'checkout', 'room_type', 'nightday', 'sameroom', 
        'roomquantity', 'room_total', 'pid', 'name'
    ];

    public function pet()
    {
        return $this->belongsTo(PetInfo::class, 'pid', 'pid');
    }

    // uid主鍵(hotel_orders)、uid外鍵(pet_info)
    public function user()
    {
        return $this->belongsTo(UserInfo::class, 'uid', 'uid');
    }
}


