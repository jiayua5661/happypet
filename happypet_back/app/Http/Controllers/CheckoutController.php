<?php

namespace App\Http\Controllers;
// require __DIR__.'/../../vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Termwind\Components\Dd;
use TsaiYiHua\ECPay\Checkout;
use TsaiYiHua\ECPay\Services\StringService;

class CheckoutController extends Controller
{
    //
    protected $checkout;

    public function __construct(Checkout $checkout)
    {
        $this->checkout = $checkout;
    }

    public function sendOrder(Request $request)
    {

        $formData = [
            'UserId' =>  3, // 用戶ID , Optional
            'ItemDescription' => '產品簡介',
            'ItemName' => 'Product Name # 333',
            'TotalAmount' => '2000',
            'PaymentMethod' => 'Credit', // ALL, Credit, ATM, WebATM
        ];


        return $this->checkout->setNotifyUrl(route('notify'))->setReturnUrl(route('return'))->setPostData($formData)->send();
    }

    // public function sendview(Request $request)
    // {
    //     // $test = $request->input('id');
    //    }

    public function handleOrderResult(Request $request) {}

    public function payOK(Request $request) {
        return redirect('http://localhost/happypet/happypet_front/40_product/front/payOK.html');
    }

    public function notifyUrl(Request $request)
    {
        $serverPost = $request->post();
        $checkMacValue = $request->post('CheckMacValue');
        unset($serverPost['CheckMacValue']);
        $checkCode = StringService::checkMacValueGenerator($serverPost);
        if ($checkMacValue == $checkCode) {
            return '1|OK';
        } else {
            return '0|FAIL';
        }
    }

    public function returnUrl(Request $request)
    {
        $serverPost = $request->post();
        $checkMacValue = $request->post('CheckMacValue');
        unset($serverPost['CheckMacValue']);
        $checkCode = StringService::checkMacValueGenerator($serverPost);
        if ($checkMacValue == $checkCode) {
            if (!empty($request->input('redirect'))) {
                return redirect($request->input('redirect'));
            } else {

                //付款完成，下面接下來要將購物車訂單狀態改為已付款
                //目前是顯示所有資料將其DD出來
                // dd($this->checkoutResponse->collectResponse($serverPost));
                return redirect()->route('payOK');
            }
        }
    }
}
