<?php

if(!isset($_SESSION)) session_start();

$imgDir = $_SERVER['DOCUMENT_ROOT'] . '/_images/' . $_SESSION["website_login_session"]["memberId"];
$imgPath = $imgDir . '/' . $_FILES["upload"]["name"];
$imgRelativePath = '/_images/'  . $_SESSION["website_login_session"]["memberId"] . '/' . $_FILES["upload"]["name"];

if (!file_exists($imgDir)) {
    mkdir($imgPath, 0777, true);
}

if(file_exists($imgPath))
{
    // $msg = $_FILES["upload"]["name"] . " already exists. ";
    $msg = "檔案已存在";
}
else
{
    move_uploaded_file($_FILES["upload"]["tmp_name"], $imgPath);

    // $msg = "Stored in: " . $imgPath;
    $msg = "上傳成功";
}

$output = '<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(' . $_GET['CKEditorFuncNum']. ', "' . $imgRelativePath . '","' . $msg . '");</script>';
echo $output;
