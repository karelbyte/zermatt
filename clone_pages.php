<?php

$source = 'c:/www/zermatt/resources/js/Pages/additives';
$targets = [
    'fibers' => ['Additive' => 'Fiber', 'additive' => 'fiber', 'Aditivo' => 'Fibra', 'aditivo' => 'fibra', 'Aditivos' => 'Fibras', 'aditivos' => 'fibras'],
    'waterproofings' => ['Additive' => 'Waterproofing', 'additive' => 'waterproofing', 'Aditivo' => 'Impermeabilizante', 'aditivo' => 'impermeabilizante', 'Aditivos' => 'Impermeabilizantes', 'aditivos' => 'impermeabilizantes']
];

foreach ($targets as $dir => $replacements) {
    if (!is_dir("c:/www/zermatt/resources/js/Pages/$dir")) {
        mkdir("c:/www/zermatt/resources/js/Pages/$dir", 0777, true);
    }
    
    foreach (['index.tsx', 'create.tsx', 'edit.tsx'] as $file) {
        $content = file_get_contents("$source/$file");
        foreach ($replacements as $search => $replace) {
            $content = str_replace($search, $replace, $content);
        }
        file_put_contents("c:/www/zermatt/resources/js/Pages/$dir/$file", $content);
    }
}

echo "Files cloned successfully.\n";
