<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $fillable = [
        'name',
        'description',
        'video_url',
        'preview_image_url',
        'muscle_group_id',
    ];

    public function muscleGroup()
    {
        return $this->belongsTo(MuscleGroup::class);
    }
}
