<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Label extends Model
{
    /**
     * The rules used for validation
     *
     * @var array
     */
    protected $rules = [
        'name' => 'required',
        'background_color'=>'required',
        'name_color'=>'required'


    ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'background_color', 'description','name_color'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [

    ];
}
