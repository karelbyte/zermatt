<?php

function readDbfFields($filename)
{
    if (!file_exists($filename))
        return [];
    $handle = fopen($filename, "rb");
    fseek($handle, 32);
    $fields = [];
    while (true) {
        $byte = fread($handle, 1);
        if (ord($byte) == 0x0D || ord($byte) == 0)
            break;
        $fieldData = $byte . fread($handle, 31);
        $field = unpack("a11name/a1type/Voffset/Clen/Cdec", $fieldData);
        $fields[] = trim($field['name']);
    }
    fclose($handle);
    return $fields;
}

echo "Clients Fields:\n";
print_r(readDbfFields("D:\\project\\Planta\\Replanta\\clientes.dbf"));
echo "\nObras Fields:\n";
print_r(readDbfFields("D:\\project\\Planta\\Replanta\\obras.dbf"));
