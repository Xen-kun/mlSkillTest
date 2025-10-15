<?php
header('Content-Type: application/json');

$apiUrl = 'http://worldtimeapi.org/api/timezone/Asia/Manila';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);

if (curl_errno($ch)) {

    date_default_timezone_set('Asia/Manila');
    echo json_encode([
        'success' => true,
        'currentTime' => date('Y-m-d H:i:s'),
        'note' => 'Using local server time (API failed)'
    ]);
} else {
    $data = json_decode($response, true);
    if (isset($data['datetime'])) {
        echo json_encode([
            'success' => true,
            'currentTime' => $data['datetime']
        ]);
    } else {
        date_default_timezone_set('Asia/Manila');
        echo json_encode([
            'success' => true,
            'currentTime' => date('Y-m-d H:i:s'),
            'note' => 'Using local server time (invalid API response)'
        ]);
    }
}

curl_close($ch);
