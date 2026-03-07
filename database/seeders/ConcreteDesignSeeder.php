<?php

namespace Database\Seeders;

use App\Models\ConcreteType;
use App\Models\Design;
use Illuminate\Database\Seeder;

class ConcreteDesignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                "type" => "N",
                "concept" => "NORMAL",
                "description" => "RESISTENCIA NORMAL 28 DIAS",
                "designs" => [
                    ["FC" => 100, "REVE" => 18, "AGREGA" => 20, "CEMENTO" => 200, "GRAVA" => 1010, "ARENA" => 970, "LAGUA" => 160],
                    ["FC" => 150, "REVE" => 14, "AGREGA" => 38, "CEMENTO" => 230, "GRAVA" => 900, "ARENA" => 980, "LAGUA" => 182],
                    ["FC" => 200, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 250, "GRAVA" => 880, "ARENA" => 1040, "LAGUA" => 182],
                    ["FC" => 200, "REVE" => 14, "AGREGA" => 10, "CEMENTO" => 260, "GRAVA" => 945, "ARENA" => 965, "LAGUA" => 180],
                    ["FC" => 350, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 350, "GRAVA" => 920, "ARENA" => 900, "LAGUA" => 181],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 275, "GRAVA" => 850, "ARENA" => 1045, "LAGUA" => 181],
                    ["FC" => 400, "REVE" => 18, "AGREGA" => 20, "CEMENTO" => 440, "GRAVA" => 912, "ARENA" => 732, "LAGUA" => 195],
                    ["FC" => 250, "REVE" => 18, "AGREGA" => 20, "CEMENTO" => 300, "GRAVA" => 900, "ARENA" => 965, "LAGUA" => 186],
                    ["FC" => 400, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 390, "GRAVA" => 895, "ARENA" => 880, "LAGUA" => 185],
                    ["FC" => 200, "REVE" => 14, "AGREGA" => 12, "CEMENTO" => 275, "GRAVA" => 910, "ARENA" => 965, "LAGUA" => 180],
                    ["FC" => 250, "REVE" => 16, "AGREGA" => 20, "CEMENTO" => 300, "GRAVA" => 910, "ARENA" => 925, "LAGUA" => 181],
                    ["FC" => 250, "REVE" => 12, "AGREGA" => 40, "CEMENTO" => 250, "GRAVA" => 1185, "ARENA" => 820, "LAGUA" => 160],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 40, "CEMENTO" => 265, "GRAVA" => 1100, "ARENA" => 855, "LAGUA" => 180],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 10, "CEMENTO" => 320, "GRAVA" => 869, "ARENA" => 943, "LAGUA" => 201],
                    ["FC" => 30, "REVE" => 12, "AGREGA" => 0, "CEMENTO" => 200, "GRAVA" => 0, "ARENA" => 156, "LAGUA" => 150],
                    ["FC" => 250, "REVE" => 10, "AGREGA" => 20, "CEMENTO" => 275, "GRAVA" => 1005, "ARENA" => 910, "LAGUA" => 160],
                    ["FC" => 200, "REVE" => 10, "AGREGA" => 20, "CEMENTO" => 220, "GRAVA" => 1009, "ARENA" => 921, "LAGUA" => 150],
                    ["FC" => 200, "REVE" => 18, "AGREGA" => 20, "CEMENTO" => 260, "GRAVA" => 950, "ARENA" => 960, "LAGUA" => 180],
                    ["FC" => 150, "REVE" => 14, "AGREGA" => 10, "CEMENTO" => 265, "GRAVA" => 855, "ARENA" => 1035, "LAGUA" => 180],
                    ["FC" => 150, "REVE" => 18, "AGREGA" => 20, "CEMENTO" => 230, "GRAVA" => 1015, "ARENA" => 937, "LAGUA" => 170],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 12, "CEMENTO" => 310, "GRAVA" => 890, "ARENA" => 955, "LAGUA" => 191],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 38, "CEMENTO" => 310, "GRAVA" => 880, "ARENA" => 1000, "LAGUA" => 191],
                    ["FC" => 150, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 230, "GRAVA" => 890, "ARENA" => 1050, "LAGUA" => 182],
                    ["FC" => 150, "REVE" => 10, "AGREGA" => 20, "CEMENTO" => 260, "GRAVA" => 1015, "ARENA" => 937, "LAGUA" => 150],
                    ["FC" => 300, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 320, "GRAVA" => 900, "ARENA" => 910, "LAGUA" => 185],
                    ["FC" => 100, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 180, "GRAVA" => 900, "ARENA" => 1070, "LAGUA" => 190],
                    ["FC" => 100, "REVE" => 0, "AGREGA" => 0, "CEMENTO" => 450, "GRAVA" => 0, "ARENA" => 750, "LAGUA" => 210],
                    ["FC" => 200, "REVE" => 16, "AGREGA" => 20, "CEMENTO" => 260, "GRAVA" => 1009, "ARENA" => 921, "LAGUA" => 165],
                ]
            ],
            [
                "type" => "RR14D",
                "concept" => "R. RAPIDA",
                "description" => "RESISTENCIA RAPIDA 100%14 DIAS",
                "designs" => [
                    ["FC" => 300, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 325, "GRAVA" => 925, "ARENA" => 905, "LAGUA" => 182],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 300, "GRAVA" => 900, "ARENA" => 940, "LAGUA" => 190],
                ]
            ],
            [
                "type" => "M",
                "concept" => "MORTERO",
                "description" => "MORTERO NORMAL",
                "designs" => [
                    ["FC" => 0, "REVE" => 0, "AGREGA" => 0, "CEMENTO" => 400, "GRAVA" => 0, "ARENA" => 1500, "LAGUA" => 280],
                ]
            ],
            [
                "type" => "RF",
                "concept" => "R. FLUIDO",
                "description" => "RELLENO FLUIDO CALIDAD BASE",
                "designs" => [
                    ["FC" => 25, "REVE" => 20, "AGREGA" => 0, "CEMENTO" => 200, "GRAVA" => 0, "ARENA" => 1546, "LAGUA" => 200],
                    ["FC" => 0, "REVE" => 20, "AGREGA" => 0, "CEMENTO" => 295, "GRAVA" => 0, "ARENA" => 1575, "LAGUA" => 220],
                ]
            ],
            [
                "type" => "MR-38",
                "concept" => "MR-38 R3D",
                "description" => "MODULO FLEXION 3DIAS",
                "designs" => [
                    ["FC" => 0, "REVE" => 12, "AGREGA" => 20, "CEMENTO" => 325, "GRAVA" => 1033, "ARENA" => 805, "LAGUA" => 172],
                ]
            ],
            [
                "type" => "MR-42",
                "concept" => "MR-42",
                "description" => "MODULO DE FLEXION A 28 DIAS",
                "designs" => [
                    ["FC" => 0, "REVE" => 12, "AGREGA" => 40, "CEMENTO" => 270, "GRAVA" => 1150, "ARENA" => 805, "LAGUA" => 171],
                    ["FC" => 0, "REVE" => 12, "AGREGA" => 20, "CEMENTO" => 250, "GRAVA" => 1100, "ARENA" => 800, "LAGUA" => 171],
                    ["FC" => 350, "REVE" => 12, "AGREGA" => 40, "CEMENTO" => 300, "GRAVA" => 1010, "ARENA" => 900, "LAGUA" => 171],
                ]
            ],
            [
                "type" => "MR403",
                "concept" => "MR-40",
                "description" => "MODULO FLEXION 3DIAS 100%",
                "designs" => [
                    ["FC" => 0, "REVE" => 12, "AGREGA" => 20, "CEMENTO" => 365, "GRAVA" => 1060, "ARENA" => 810, "LAGUA" => 171],
                ]
            ],
            [
                "type" => "RR3D",
                "concept" => "R.RAPIDA",
                "description" => "RESIST. RAPIDA 100% 3 DIAS",
                "designs" => [
                    ["FC" => 350, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 425, "GRAVA" => 920, "ARENA" => 900, "LAGUA" => 191],
                    ["FC" => 200, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 360, "GRAVA" => 950, "ARENA" => 905, "LAGUA" => 183],
                    ["FC" => 300, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 370, "GRAVA" => 932, "ARENA" => 865, "LAGUA" => 181],
                    ["FC" => 250, "REVE" => 16, "AGREGA" => 10, "CEMENTO" => 370, "GRAVA" => 840, "ARENA" => 915, "LAGUA" => 180],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 360, "GRAVA" => 933, "ARENA" => 850, "LAGUA" => 182],
                ]
            ],
            [
                "type" => "ME",
                "concept" => "MORTERO ESTABILIZADO",
                "description" => "MORTERO ESTABILIZADO A 4 HORAS",
                "designs" => [
                    ["FC" => 0, "REVE" => 14, "AGREGA" => 0, "CEMENTO" => 300, "GRAVA" => 0, "ARENA" => 1500, "LAGUA" => 210],
                ]
            ],
            [
                "type" => "MR",
                "concept" => "NORMAL",
                "description" => "F",
                "designs" => []
            ],
            [
                "type" => "MR40R",
                "concept" => "MR-40",
                "description" => "MODULO DE FLEXION A 24 HRS.",
                "designs" => []
            ],
            [
                "type" => "RF RR",
                "concept" => "RELLENO FLUIDO RR",
                "description" => "RELLENO FLUIDO, TIRO DIRECTO",
                "designs" => []
            ],
            [
                "type" => "RR7D",
                "concept" => "R.RAPIDA 7 DIAS",
                "description" => "R,RAPIDA 100 % A 7 DIAS, CON S",
                "designs" => [
                    ["FC" => 250, "REVE" => 16, "AGREGA" => 20, "CEMENTO" => 335, "GRAVA" => 945, "ARENA" => 895, "LAGUA" => 185],
                    ["FC" => 300, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 340, "GRAVA" => 895, "ARENA" => 945, "LAGUA" => 181],
                    ["FC" => 200, "REVE" => 16, "AGREGA" => 20, "CEMENTO" => 285, "GRAVA" => 960, "ARENA" => 925, "LAGUA" => 180],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 325, "GRAVA" => 935, "ARENA" => 890, "LAGUA" => 186],
                ]
            ],
            [
                "type" => "RR24H",
                "concept" => "RR-24 HRS.",
                "description" => "RESISTENCIA RAPIDA A 24 HRS.",
                "designs" => [
                    ["FC" => 300, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 415, "GRAVA" => 940, "ARENA" => 930, "LAGUA" => 185],
                    ["FC" => 200, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 340, "GRAVA" => 935, "ARENA" => 890, "LAGUA" => 184],
                    ["FC" => 250, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 460, "GRAVA" => 890, "ARENA" => 795, "LAGUA" => 188],
                ]
            ],
            [
                "type" => "MR-48",
                "concept" => "MR-48",
                "description" => "MR-48 NORMAL 28 DIAS",
                "designs" => [
                    ["FC" => 0, "REVE" => 12, "AGREGA" => 20, "CEMENTO" => 340, "GRAVA" => 1070, "ARENA" => 790, "LAGUA" => 175],
                    ["FC" => 0, "REVE" => 14, "AGREGA" => 20, "CEMENTO" => 355, "GRAVA" => 1050, "ARENA" => 780, "LAGUA" => 177],
                ]
            ],
            [
                "type" => "RR",
                "concept" => "R,RAPIDA",
                "description" => "RESIST.RAPIDA 100% A 48 HRS.",
                "designs" => []
            ]
        ];

        foreach ($data as $item) {
            $concreteType = ConcreteType::updateOrCreate(
                ['type' => $item['type']],
                [
                    'concept' => $item['concept'],
                    'description' => $item['description'],
                    'active' => true,
                ]
            );

            foreach ($item['designs'] as $d) {
                Design::updateOrCreate(
                    [
                        'concrete_type_id' => $concreteType->id,
                        'fc' => $d['FC'],
                        'slump' => $d['REVE'],
                        'added' => $d['AGREGA'],
                    ],
                    [
                        'cement' => (float) $d['CEMENTO'],
                        'gravel' => (float) $d['GRAVA'],
                        'sand' => (float) $d['ARENA'],
                        'water' => (float) $d['LAGUA'],
                    ]
                );
            }
        }
    }
}
