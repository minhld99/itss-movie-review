<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
   
    protected $fillable = [
        'title',
        'poster_path',
        'backdrop_path',
        'release_date',
        'vote_average',
        'runtime',
        'overview',
    ];
}
