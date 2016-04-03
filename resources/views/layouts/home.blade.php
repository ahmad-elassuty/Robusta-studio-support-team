<!doctype html>
<html>
  <head>
    <title>@yield('title', 'Robusta')</title>

    {!! Html::style('assets/css/bootstrap.min.css') !!}
    {!! Html::style('assets/css/AdminLTE.min.css') !!}
    {!! Html::style('assets/css/_all-skins.min.css') !!}
    {!! Html::style('assets/css/font-awesome.min.css') !!}

    @section('styles')
    @show

    {!! Html::script('assets/js/jQuery-2.1.4.min.js') !!}
    {!! Html::script('assets/js/jquery-ui.min.js') !!}
    {!! Html::script('assets/js/bootstrap.min.js') !!}
    {!! Html::script('assets/js/AdminLTE.min.js') !!}

    @section('scripts')
    @show

    <script>
      $.widget.bridge('uibutton', $.ui.button);
    </script>
  </head>

  <body class="hold-transition skin-blue sidebar-mini">
    <div class="wrapper">

      <header class="main-header">
        @include('layout-components.header')
      </header>

      @include('layout-components.sidebar.sidebar')

      <div class="content-wrapper">
        <section class="content-header">
          @include('layout-components.content_header')
        </section>

        <section class="content">
          @yield('content')
        </section>
      </div>

      <footer class="main-footer">
        @include('layout-components.footer')
      </footer>

    </div>

    @section('modals')
    @show

  </body>
</html>