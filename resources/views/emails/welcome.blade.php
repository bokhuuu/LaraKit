<x-mail::message>
# Welcome to {{ config('app.name') }}

Hi {{ $user->name }},

Your account has been created successfully. You can now log in to the admin panel.

<x-mail::button :url="route('login')">
Log In to Panel
</x-mail::button>

Thanks,
{{ config('app.name') }}
</x-mail::message>
