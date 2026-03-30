# AGENTS.md — ArbiDex Server Bots Frontend

## Stack
Angular 20 (standalone components, no NgModules), NgRx 20 (Store + Effects), ag-Grid 34, Angular Material, RxJS 7. All components use `standalone: true`.

## Developer Commands
```bash
npm start              # dev server → http://localhost:4200
npm run build          # production build
npm test               # Karma/Jasmine unit tests
npm run storybook      # Storybook → http://localhost:6006
npm run start:docker   # docker-compose up --build -d  (exposes port 8230)
```

## Architecture Overview

### Two NgRx feature slices (src/app/+state/)
| Slice | Key | Responsibility |
|-------|-----|----------------|
| `servers` | `SERVERS_FEATURE_KEY` | All remote data: server info, bots, rules, bot details |
| `view` | `VIEW_FEATURE_KEY` | UI state: sidebar open/closed, active tab, tab list |

Tab-driven data loading: `ServersEffects.loadDataByTab$` reacts to `setActiveServer` and dispatches different load actions depending on the current active tab (`'bots'` → `loadBotControlList`, `'server data'` → `loadServerList + loadBotTypesList + loadJobTypesList`, `'rules'` → `getRulesList`).

### Async state shape
Every API-backed field uses the `emptyAsyncResponse<T>()` factory (see `src/app/+state/servers/configs.ts`), which wraps responses in:
```ts
{ startTime: null, loadingTime: null, isLoading: false, isLoaded: false, response: T }
```
The base `API` interface lives in `src/app/models/api.ts`. Derived interfaces in `models/servers.ts` extend it (e.g. `IServerDataAPI`, `IRuleListAPI`).

### Dynamic backend URL
`ServerDataService` (`src/app/services/server-data.service.ts`) has **no hardcoded base URL**. It builds `http://<ip>:<port>` at runtime from the `getActiveServerIpPort` NgRx selector. All HTTP methods (`get`, `post`, `put`) are private helpers that pipe through `baseUrl$`.

### Server list config
Hardcoded in `src/app/+state/servers/configs.ts`:
- `LOCAL_SERVER` → `127.0.0.1:3000`
- `FIRST_REAL_SERVER` → `45.135.182.251:1001` (default route target)

## Component / Container Pattern

- **`src/app/components/`** — pure "dumb" UI components. No Store access. Communicate only via `@Input()` / `@Output() emitter`.
- **`src/app/containers/`** — "smart" wrappers that inject the Store and/or services, pass data down via `@Input`, and handle `emitter` events.

### Event naming convention
All emitted events use a `'ComponentName:EVENT_TYPE'` string:
```ts
// from Actions component
{ event: 'Actions:ACTION_CLICKED' }
// from AgGrid component
{ event: 'AgGrid:DOUBLE_CLICKED_ROW', row: $event }
// from Tabs component
{ event: 'Tabs:TAB_CLICKED', data: tabName }
```
Containers pattern-match on `$event.event` inside handler methods.

### ag-Grid cell renderer containers
Several containers implement `ICellRendererAngularComp` (ag-Grid Angular interface) for use directly as cell renderers inside `ColDef.cellRenderer`:
- `IndicatorContainer` — colored status dot, maps status string → color via `cellRendererParams.colorMapping`
- `PauseBotContainer`, `RestartBotContainer`, `LaunchControlContainer` — action buttons; they call `params.onAction(event, data)` to bubble events up to the parent container

Column definitions (including cell renderer assignments) live in `src/app/components/+stabs/` files (e.g. `bot-control-panel-stabs.ts`).

## Routing
```
/server/:ipPort/tab/:tabId   → SidebarContainer  (main view)
/server/:ipPort/:botId       → BotInfoPageContainer
**                           → redirects to /server/45.135.182.251:1001/tab/bots
```
`SidebarContainer.ngOnInit` reads `ipPort` and `tabId` from `ActivatedRoute.paramMap` and dispatches `setActiveTab` + `setActiveServer`.

## Key Files Reference
| Path | Purpose |
|------|---------|
| `src/app/+state/servers/configs.ts` | Server list, `emptyAsyncResponse`, empty state shapes |
| `src/app/+state/servers/servers.effects.ts` | All HTTP side-effects, tab-driven loading logic |
| `src/app/services/server-data.service.ts` | Single HTTP service; all backend API endpoints |
| `src/app/models/api.ts` | Base async wrapper interface |
| `src/app/components/+stabs/` | ag-Grid ColDef definitions with cell renderer wiring |
| `api.stabs.ts` (root) | Commented-out documentation of all backend REST endpoints |
| `src/app/+state/view/view.reducer.ts` | Tab list definition (`tabList`) — add new tabs here |

## Formatting
Prettier config (in `package.json`): `printWidth: 100`, `singleQuote: true`, angular parser for `.html`. File names use kebab-case **without** `.component.ts` suffix (e.g. `sidebar-container.ts`, `ag-grid.ts`).

