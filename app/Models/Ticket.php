<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Builder;


use Log;
class Ticket extends BaseModel
{

    protected $dates = ['created_at', 'updated_at'];

    // Mass Assignment
    protected $fillable = [
        'name'       , 'description'  , 'customer_id',
        'assigned_to', 'department_id', 'priority_id',
        'vip'
    ];

    // Validations
    protected static $rules = [
        'name'        => 'required',
        'description' => 'required'
    ];

    // Relations
    public function creator()
    {
        return $this->belongsTo( User::class, 'creator_id' );
    }

    public function priority()
    {
        return $this->belongsTo( Priority::class );
    }

    public function department()
    {
        return $this->belongsTo( Department::class );
    }

    public function customer()
    {
        return $this->belongsTo( Customer::class );
    }

    public function assigned_to()
    {
        return $this->belongsTo( User::class, 'assigned_to' );
    }

    public function labels()
    {
        return $this->belongsToMany( Label::class );
    }

    public function comments()
    {
        return $this->hasMany( Comment::class );
    }

    public function invitations()
    {
        return $this->morphMany( Invitation::class, 'invitable' );
    }

    // Scopes
    public function scopeOpen( Builder $query )
    {
        return $query->where( 'open', true );
    }

    public function scopeDone( Builder $query )
    {
        return $query->where( 'open', false );
    }

    public function scopeVIP( Builder $query )
    {
        return $query->where( 'vip', true );
    }

    public function scopeNotAssigned( Builder $query )
    {
        return $query->whereNull('assigned_to');
    }

    public function scopeAssigned( Builder $query )
    {
        return $query->whereNotNull('assigned_to');
    }

    public function scopeOfDepartment( Builder $query, $department_id)
    {
        return $query->where('department_id', $department_id);
    }

    // Methods
    public function canBeClaimed()
    {
        return $this->assigned_to == null;
    }

    public function addComment(){

    }
    public function scopeClosedTickets(Builder $query,$user_id){
        if(User::find($user_id)->hasRole(['Admin'])) {
            return $query->open();
        }
        return $query->where('assigned_to',$user_id)->done();
    }
    public function scopeOpenTickets(Builder $query,$user_id){
        if(User::find($user_id)->hasRole(['Admin'])) {
            return $query->open();
        }
        return $query->where('assigned_to',$user_id)->open();
    }


}
