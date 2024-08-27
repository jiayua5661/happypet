<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;


class getSupmkController extends Controller
{
    //
  
    function getinfo(Request $request)
    {
        // echo session('data');
        // print_r(session('data')) ;
        $data = session('data', ['default_value']);
        return response()->json($data)
            ->header('Content-Type', 'application/json')
            ->header('Charset', 'utf-8')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type');

    }
    function returninfo_(Request $request)
    {
        $data = $request->all();
        $jsonData = json_encode($data);
        $encodedData = urlencode($jsonData);
        $storename = $request->input('storename');
        // return response()->json($data);
        // ->header('Access-Control-Allow-Origin', '*')
        // ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        // ->header('Access-Control-Allow-Headers', 'Content-Type');
        // session(['data'=>$data]);
        Session::put('data',  $data);
        // session(['data'=>'5787']);
        // print_r(session('data')) ;

        return redirect()->to('http://localhost/happypet/happypet_front/40_product/front/checkout_counter.html?spumark=' . urlencode($encodedData));
        // return redirect('http://localhost/happypet/happypet_front/40_product/front/checkout_counter.html');
            // ->with(session('data'))
            // ->header('Access-Control-Allow-Origin', '*')
            // ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            // ->header('Access-Control-Allow-Headers', 'Content-Type');
    }
}
