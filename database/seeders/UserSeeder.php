<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'id' => 1,
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('123123'),
                'is_admin' => true,
            ],
            [
                'id' => 2,
                'name' => 'test',
                'email' => 'test@test.com',
                'password' => Hash::make('test1234'),
                'is_admin' => false,
            ],
        ]);
    }
}
