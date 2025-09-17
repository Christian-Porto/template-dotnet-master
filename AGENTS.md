# Repository Guidelines

## Project Structure & Module Organization
- Solution: `ExtensionEventsManager.sln`
- Source: `src/`
  - `Domain/` core entities and enums
  - `Application/` requests, behaviors, mappings, interfaces
  - `Infrastructure/` EF Core DbContext, migrations, services
  - `WebAPI/` ASP.NET Core HTTP API, middleware, filters, `wwwroot/`
  - `Jobs/` background jobs and scheduling
- Tests: `tests/` (`*.UnitTests`, `*.FunctionalTests`)
- Docker: `docker-compose.yaml`, `src/WebAPI/Dockerfile`

## Build, Test, and Development Commands
- Restore: `dotnet restore`
- Build: `dotnet build ExtensionEventsManager.sln -c Debug`
- Run API: `dotnet run --project src/WebAPI`
- Run Jobs: `dotnet run --project src/Jobs`
- Tests: `dotnet test -c Debug`
- Local deps (if used): `docker-compose up -d`
- Apply migrations: `dotnet ef database update --project src/Infrastructure --startup-project src/WebAPI`

## Coding Style & Naming Conventions
- C#/.NET, 4-space indentation, UTF-8 files
- Types/properties/methods: `PascalCase`; locals/params: `camelCase`; private fields: `_camelCase`
- Async methods end with `Async` (e.g., `GetUserAsync`)
- One public type per file; filename matches type
- Prefer DI over statics; keep controllers thin; validate inputs
- Format: `dotnet format` before committing

## Testing Guidelines
- Place tests under `tests/*`; name files `*Tests.cs`
- Use clear Arrange-Act-Assert structure; test public behavior
- Add unit tests for new logic and regression tests for fixed bugs
- Run `dotnet test` locally and ensure passing before PRs

## Commit & Pull Request Guidelines
- Commits: imperative subject (“Add event update endpoint”), concise body, reference issues (e.g., `Closes #123`)
- Scope changes logically; avoid mixed concerns
- PRs: include description, rationale, test evidence (commands/output), migration notes, and screenshots for UI/API docs if relevant
- Ensure CI passes and code is formatted

## Security & Configuration Tips
- Do not commit secrets; use environment variables or User Secrets:
  - `dotnet user-secrets set "TokenSettings:Secret" "..." --project src/WebAPI`
- Local config in `appsettings.Development.json`; production via env vars
- Review `src/WebAPI/nswag.json` and `wwwroot/api/` for API client/spec updates when endpoints change

## Agent-Specific Notes
- This file governs the entire repo. Keep changes minimal, focused, and consistent with the above. Update docs/tests alongside code.
