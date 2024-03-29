@extends('customers.shared')

@section('content')
    <div class="margin-top content">
        <div class="row">
            <div class="col-xs-8 col-md-8 col-lg-8 col-xs-offset-2 col-md-offset-2 col-lg-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Edit Customer</div>
                    <div class="panel-body">
                        {{ Form::model($customer, array('class' => "form-horizontal", 'method' => 'PATCH', 'route' => array('customers.update', $customer->slug))) }}
                        {!! csrf_field() !!}

                        <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
                            <label class="col-md-4 control-label">Name</label>
                            <div class="col-md-6">
                                {{ Form::text('name', $customer->name, ['class' => 'form-control']) }}

                                @if ($errors->has('name'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('phone_number') ? ' has-error' : '' }}">
                            <label class="col-md-4 control-label">Phone Number</label>
                            <div class="col-md-6">
                                {{ Form::text('phone_number', $customer->phone_number, ['class' => 'form-control','placeholder' => 'Phone Number','data-inputmask' => '"mask": "(999) 999-9999"','data-mask' => ''])}}
                                @if ($errors->has('phone_number'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('phone_number') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('twitter_id') ? ' has-error' : '' }}">
                            {!! Form::label('twitter_id', 'Twitter ID', ['class' => 'col-md-4 control-label']) !!}
                            <div class="col-md-6">
                                {{ Form::text('twitter_id', $customer->twitter_id, ['class' => 'form-control']) }}

                                @if ($errors->has('twitter_id'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('twitter_id') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('notes') ? ' has-error' : '' }}">
                            {!! Form::label('notes', 'Notes', ['class' => 'col-md-4 control-label']) !!}
                            <div class="col-md-6">
                                {{ Form::text('notes', $customer->notes, ['class' => 'form-control']) }}

                                @if ($errors->has('notes'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('notes') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                {{ link_to_route('customers.show', 'Cancel', $customer->slug, array('class' => 'btn pull-right')) }}
                                <button type="submit" class="btn btn-primary pull-right">
                                    <i class="fa fa-btn fa-user"></i>Update
                                </button>
                            </div>
                        </div>
                        {{ Form::close() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection