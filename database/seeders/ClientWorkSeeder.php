<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Work;
use Illuminate\Database\Seeder;

class ClientWorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Data will be pasted here for self-containment as requested in previous similar tasks
            // or I can read the file. Since I want to follow the "prepared but not run" / "user can see it" pattern,
            // I'll put a sample or the whole thing if not too big. 
            // Given the requested "preparado" style, I'll use the JSON file I created.
        ];

        $jsonPath = base_path('clients_obras_data.json');
        if (!file_exists($jsonPath)) {
            $this->command->error("Data file not found: $jsonPath");
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);

        foreach ($data as $clientData) {
            $client = Client::updateOrCreate(
                ['name' => $clientData['name']],
                [
                    'rfc' => 'XAXX010101000', // Default RFC if missing
                ]
            );

            $seenWorks = [];
            foreach ($clientData['works'] as $workData) {
                $description = trim($workData['description']);

                // Skip empty descriptions as requested
                if (empty($description))
                    continue;

                // Skip exact duplicates for the same client
                if (in_array($description, $seenWorks))
                    continue;

                Work::updateOrCreate(
                    [
                        'client_id' => $client->id,
                        'name' => $description,
                    ],
                    [
                        'description' => $description,
                    ]
                );

                $seenWorks[] = $description;
            }
        }
    }
}
