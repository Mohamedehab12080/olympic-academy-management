# Production deployment

This deployment keeps the existing backend routes unchanged. There is no `/api` prefix.

## Request flow

```text
Browser -> Cloudflare Tunnel -> Caddy 127.0.0.1:8080
                              -> Angular static build
                              -> Spring Boot 127.0.0.1:7002
```

Caddy distinguishes Angular navigation from API calls by the browser's `Accept` header. This is required because Angular pages and Spring controllers share paths such as `/auth/activate`.

## Build

Build Angular from `olympic-academy-working`:

```powershell
npm ci
npm run build -- --configuration production
```

The production bundle must not contain `localhost:7002`.

Build Spring Boot from the repository root:

```powershell
.\mvnw.cmd -Ppackage -DskipTests package
```

## Configuration

Create Windows environment variables based on `production.env.example`. Never commit real passwords. The production profile intentionally fails at startup when required database, mail, or frontend URL variables are absent.

Run the backend with:

```powershell
java -jar <application-jar> --spring.profiles.active=production
```

Run Caddy from the repository root with:

```powershell
caddy run --config .\deployment\Caddyfile
```

For a temporary connectivity test:

```powershell
cloudflared tunnel --url http://127.0.0.1:8080
```

Set `APP_FRONTEND_URL` to the generated HTTPS URL before starting Spring Boot so activation and password-reset emails use the public address. Quick Tunnel URLs change after restart; use a named tunnel and your own hostname for real use.

## Security and operations

- Keep Spring Boot bound to `127.0.0.1:7002` in production.
- Do not expose MySQL port `3306` or Spring Boot port `7002` publicly.
- Keep bootstrap user creation disabled after initial setup.
- Rotate credentials that previously existed in source or logs.
- Use Cloudflare Access with MFA for staff-only deployments.
- Store daily backups off the server and test restoration regularly.
- Run the application, Caddy, and `cloudflared` as automatically restarting services.
- Use a UPS and wired office connection; office power or internet failure stops remote access.
