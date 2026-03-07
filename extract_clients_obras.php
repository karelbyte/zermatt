<?php

function getDbfHeader($filename)
{
    if (!file_exists($filename))
        return null;
    $handle = fopen($filename, "rb");
    $header = fread($handle, 32);
    $data = unpack("Cversion/Cy/Cm/Cd/Inum_records/vheader_len/vrecord_len", $header);
    fclose($handle);
    return $data;
}

function getDbfFields($filename)
{
    $handle = fopen($filename, "rb");
    fseek($handle, 32);
    $fields = [];
    while (true) {
        $byte = fread($handle, 1);
        if (ord($byte) == 0x0D || ord($byte) == 0)
            break;
        $fieldData = $byte . fread($handle, 31);
        $field = unpack("a11name/a1type/Voffset/Clen/Cdec", $fieldData);
        $fields[] = $field;
    }
    fclose($handle);
    return $fields;
}

function convertToUtf8($data)
{
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = convertToUtf8($value);
        }
    } elseif (is_string($data)) {
        return mb_convert_encoding($data, 'UTF-8', 'ISO-8859-1');
    }
    return $data;
}

function readDbf($filename)
{
    $header = getDbfHeader($filename);
    $fields = getDbfFields($filename);
    if (!$header)
        return [];

    $handle = fopen($filename, "rb");
    fseek($handle, $header['header_len']);

    $records = [];
    for ($i = 0; $i < $header['num_records']; $i++) {
        $record = [];
        $deleteFlag = fread($handle, 1);
        if (feof($handle))
            break;
        foreach ($fields as $field) {
            $value = fread($handle, $field['len']);
            $fieldName = trim($field['name']);
            $record[$fieldName] = trim($value);
        }
        if ($deleteFlag === ' ' || $deleteFlag === "\x20") {
            $records[] = $record;
        }
    }
    fclose($handle);
    return $records;
}

$clientesDbf = "D:\\project\\Planta\\Replanta\\clientes.dbf";
$obrasDbf = "D:\\project\\Planta\\Replanta\\obras.dbf";

$clientesRows = readDbf($clientesDbf);
$obrasRows = readDbf($obrasDbf);

$data = [];
foreach ($clientesRows as $c) {
    $clave = $c['CLAVE_CLI'] ?? '';
    $nombre = $c['NOMBRE'] ?? '';

    if (empty($nombre))
        continue;

    $works = [];
    foreach ($obrasRows as $o) {
        if (($o['CLAVE_CLI'] ?? '') === $clave && !empty($clave)) {
            $desc = $o['DESCRI'] ?? null;
            if (!empty($desc)) {
                $works[] = ['description' => $desc];
            }
        }
    }

    $data[] = [
        'name' => $nombre,
        'works' => $works
    ];
}

// Convert all data to UTF-8 before encoding
$data = convertToUtf8($data);

$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json === false) {
    echo "JSON Encode Error: " . json_last_error_msg() . "\n";
    // Try to fix common issues or just encode with IGNORE
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_PARTIAL_OUTPUT_ON_ERROR);
}

if (file_put_contents("C:\\www\\zermatt\\clients_obras_data.json", $json)) {
    echo "File clients_obras_data.json created with " . count($data) . " clients.\n";
    echo "File size: " . filesize("C:\\www\\zermatt\\clients_obras_data.json") . " bytes\n";
} else {
    echo "Failed to write file.\n";
}
