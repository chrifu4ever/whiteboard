<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $uploadDir = '../files/';
    $uploadFilePath = $uploadDir . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $uploadFilePath)) {
        echo json_encode(['status' => 'success', 'message' => 'File uploaded successfully.']);
        
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload file.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No file uploaded.']);
}
?>