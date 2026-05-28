<!DOCTYPE html>
<html>

<body style="font-family: sans-serif; text-align: center; padding: 80px;">
    <h1>403 - Forbidden</h1>
    <p>You don't have permission to access this page.</p>
    <form method="POST" action="/logout" style="display:inline">
        @csrf
        <button type="submit">Logout</button>
    </form>
</body>

</html>
