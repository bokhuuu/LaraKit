<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>403 — Forbidden</title>
    <style>
        *,
        *::before,
        *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #0a0a0a;
            color: #fafafa;
            font-family: ui-sans-serif, system-ui, sans-serif;
        }

        .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 48px;
            background-color: #111111;
            border: 1px solid #222222;
            border-radius: 12px;
            max-width: 420px;
            width: 90%;
        }

        .code {
            font-size: 72px;
            font-weight: 700;
            color: #fafafa;
            line-height: 1;
        }

        .divider {
            width: 40px;
            height: 2px;
            background-color: #333333;
            border-radius: 999px;
        }

        .title {
            font-size: 18px;
            font-weight: 600;
            color: #fafafa;
        }

        .message {
            font-size: 14px;
            color: #888888;
            text-align: center;
            line-height: 1.6;
        }

        .btn {
            margin-top: 8px;
            padding: 10px 24px;
            background-color: #fafafa;
            color: #0a0a0a;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.15s ease;
        }

        .btn:hover {
            opacity: 0.85;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="code">403</div>
        <div class="divider"></div>
        <div class="title">Access Denied</div>
        <p class="message">You don't have permission to access this page. Contact your administrator if you think this is
            a mistake.</p>
        <form method="POST" action="/logout">
            @csrf
            <button class="btn" type="submit">Logout</button>
        </form>
    </div>
</body>

</html>
