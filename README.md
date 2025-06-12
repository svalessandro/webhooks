# Webhooks Integration

This application synchronizes orders and status updates between **Bling** and **Foody**.

## Available Endpoints

- `POST /webhook/bling` – Receives order notifications from Bling and forwards them to Foody.
- `POST /webhook/bling/status` – Receives status updates from Bling and notifies Foody.
- `POST /webhook/foody` – Receives status updates from Foody and updates Bling.
- `GET /oauth/callback` – Callback used to obtain Bling OAuth tokens.

## Required Environment Variables

| Variable | Description |
| --- | --- |
| `FOODY_OPEN_DELIVERY_URL` | Base URL for Foody APIs. |
| `FOODY_CLIENT_ID` | OAuth client ID for Foody. |
| `FOODY_CLIENT_SECRET` | OAuth client secret for Foody. |
| `FOODY_TOKEN_URL` | URL to obtain Foody tokens. |
| `BLING_API_BASE_URL` | Base URL for Bling APIs. |
| `BLING_CLIENT_ID` | OAuth client ID for Bling. |
| `BLING_CLIENT_SECRET` | OAuth client secret for Bling. |
| `BLING_TOKEN_URL` | URL to obtain Bling tokens. |
| `BLING_REFRESH_TOKEN` | Refresh token used to access Bling APIs. |
| `PORT` | Port in which the server will run (default `8080`). |

Make sure all variables above are defined in an `.env` file or your environment before starting the server.
