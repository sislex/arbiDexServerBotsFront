# AGENTS.md — ArbiDex Server Bots Frontend

## Stack & Versions
Angular 20 (standalone components, **no NgModules**), NgRx 20 (Store + Effects), ag-Grid 34, ag-Charts 13 (community + enterprise), Angular Material 20, RxJS 7, socket.io-client 4.
All components use `standalone: true`. **Never create NgModules.**

## Commands
```bash
npm start              # dev server → http://localhost:4200
npm run build          # production build
npm test               # Karma / Jasmine unit tests
npm run storybook      # Storybook → http://localhost:6006
npm run start:docker   # docker-compose up --build -d  (port 8230)
```

## File-Naming Convention
Kebab-case, **without** `.component.ts` suffix:
```
sidebar-container.ts   # NOT sidebar-container.component.ts
price-chart.ts         # NOT price-chart.component.ts
```
Templates / styles: `price-chart.html`, `price-chart.scss`.
Storybook: `sidebar.stories.ts` next to the component.

## Prettier
Config in `package.json`: `printWidth: 100`, `singleQuote: true`, angular parser for `*.html`.

---

## Architecture Overview

### 1. Component / Container Pattern (strict)
| Layer | Directory | Rules |
|-------|-----------|-------|
| **Component** (dumb) | `src/app/components/` | No Store, no services. Only `@Input()` / `@Output() emitter`. |
| **Container** (smart) | `src/app/containers/` | Injects Store / services; passes data to components via inputs; handles `emitter` events. |

**Example — creating a new feature:**
```
src/app/components/my-widget/
  my-widget.ts          # @Input data, @Output emitter
  my-widget.html
  my-widget.scss
  my-widget.stories.ts  # optional Storybook story

src/app/containers/my-widget-container/
  my-widget-container.ts   # inject(Store), select data, dispatch actions
  my-widget-container.html
  my-widget-container.scss
```

### 2. Event System
All emitted events are objects with a string key `event: 'ComponentName:EVENT_TYPE'`:
```ts
// Component emits:
this.emitter.emit({ event: 'MyWidget:ITEM_SELECTED', data: item });
// Container handles:
onEvent($event: any) {
  if ($event.event === 'MyWidget:ITEM_SELECTED') { /* dispatch */ }
}
```

### 3. Two NgRx Feature Slices (`src/app/+state/`)

| Slice | Key | Files | Responsibility |
|-------|-----|-------|----------------|
| `servers` | `SERVERS_FEATURE_KEY` | `servers.actions.ts`, `servers.reducer.ts`, `servers.selectors.ts`, `servers.effects.ts`, `configs.ts` | All remote data: server info, bots, rules, bot details, prices |
| `view` | `VIEW_FEATURE_KEY` | `view.actions.ts`, `view.reducer.ts`, `view.selectors.ts`, `view.effects.ts` | UI state: sidebar open/closed, active tab, tab list |

#### Async state wrapper
Every API field uses `emptyAsyncResponse<T>()` from `configs.ts`:
```ts
{ startTime: null, loadingTime: null, isLoading: false, isLoaded: false, response: T }
```
Base interface: `src/app/models/api.ts` → `API`. Extended types in `src/app/models/servers.ts`.

#### Tab-driven loading
`ServersEffects.loadDataByTab$` reacts to `setActiveServer` and dispatches load actions based on the current active tab:
- `'bots'` → `loadBotControlList`
- `'server data'` → `loadServerList` + `loadBotTypesList` + `loadJobTypesList`
- `'rules'` → `getRulesList`

**To add a new tab:**
1. Add the tab name to `tabList` in `src/app/+state/view/view.reducer.ts`
2. Add a `case` in `loadDataByTab$` in `servers.effects.ts`
3. Create corresponding container + component

### 4. Dynamic Backend URL
`ServerDataService` (`src/app/services/server-data.service.ts`) has **no hardcoded base URL**. It builds `http://<ip>:<port>` from the `getActiveServerIpPort` NgRx selector at runtime. All HTTP calls use private `get/post/put` helpers that pipe through `baseUrl$`.

**To add a new API endpoint:**
```ts
// In server-data.service.ts
getMyData(): Observable<MyType> {
  return this.get<MyType>('/my-endpoint');
}
```

### 5. Server List
Hardcoded in `src/app/+state/servers/configs.ts`:
- `LOCAL_SERVER` → `127.0.0.1:3000`
- `FIRST_REAL_SERVER` → `45.135.182.251:1001` (default redirect target)

### 6. Routing
```
/server/:ipPort/tab/:tabId   → SidebarContainer (main view with tabs)
/server/:ipPort/:botId       → BotInfoPageContainer (bot detail page)
**                           → redirects to /server/45.135.182.251:1001/tab/bots
```
`SidebarContainer.ngOnInit` reads route params and dispatches `setActiveTab` + `clearActiveElementData` + `setActiveServer`.

---

## ag-Grid Integration

### ColDef files
Column definitions live in `src/app/components/+stabs/` (e.g. `bot-control-panel-stabs.ts`, `server-data-stabs.ts`).

### Custom cell renderer containers
Containers implementing `ICellRendererAngularComp`:
- `IndicatorContainer` — status dot, color via `cellRendererParams.colorMapping`
- `PauseBotContainer`, `RestartBotContainer`, `LaunchControlContainer` — action buttons; call `params.onAction(event, data)` to bubble events

### AgGrid component
`src/app/components/ag-grid/ag-grid.ts` — generic wrapper. Register modules at top of file:
```ts
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
```

---

## ag-Charts Integration (Price Charts)

### Module registration (required in every file using ag-charts)
```ts
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
import { AllEnterpriseModule } from 'ag-charts-enterprise';
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
```

### PriceChart component (`src/app/components/price-chart/`)
Reusable dumb component. Inputs:
```ts
@Input() data: PricePoint[]           // { time: number, [key]: number }
@Input() series: PriceSeriesConfig[]  // { key, name, color }
@Input() hiddenKeys: string[]
@Input() streaming: boolean           // enables 500ms tick-by-tick replay
```
Uses dark Binance-style theme (`#161a25` background). Lines use `interpolation: { type: 'step', position: 'end' }` for perpendicular steps (no diagonal lines). Zoom + navigator enabled on X axis.

### Price key system
Keys follow the pattern `source|symbol|field` (e.g. `binance|ETHUSDC|bidPrice`, `kucoin|ETH-USDT|askPrice`).
The symbol format varies by exchange, so keys are **discovered at runtime** via `GET /prices/keys`.

Job config provides `source`, `token0`, `token1` (e.g. `{ source: "kucoin", token0: "ETH", token1: "USDT" }`).
Use `findPriceKeys(allKeys, source, token0, token1)` from `price-key-utils.ts` to resolve actual pipe-separated keys.

Utility functions in `src/app/services/price-key-utils.ts`:
- `findPriceKeys()` — discover bid/ask keys from available keys by source + tokens
- `formatPipeKeyName()` — pipe key → human-readable name (e.g. `'Kucoin ETH-USDT Bid'`)
- `buildSeriesFromPipeKeys()` — pipe keys → `PriceSeriesConfig[]`
- `rawKeyToUrlKey()` — flat key → pipe-separated for API (legacy)
- `formatKeyName()` — flat key → human-readable name (legacy)
- `buildSeriesFromKeys()` — flat keys → `PriceSeriesConfig[]` (legacy)
- `PRICE_COLORS` — color palette array

### Two chart containers
| Container | Data source | Purpose |
|-----------|-------------|---------|
| `PriceChartContainer` | REST API (`/prices/key/:key`) | Historical data, static display |
| `PriceChartLiveContainer` | REST + WebSocket (socket.io `/prices` namespace) | Historical load, then live updates |

#### WebSocket protocol (socket.io)
```ts
const socket = io('http://<ip>:<port>/prices');
socket.emit('subscribe', { keys: ['binance|ETHUSDC|bidPrice', 'mexc|ETHUSDT|askPrice'] });
socket.on('priceChange', ({ key, point }: { key: string; point: { t: number; v: number } }) => {
  // key = 'kucoin|ETH-USDT|bidPrice', point.t = timestamp ms, point.v = price
});
```
Live container buffers ticks and flushes every 500ms, keeping max 300 points with auto-scroll.

#### CEX Quotes special case
When `jobType === 'get_Cex_Quotes'`, show **one line** — the mid-price `(bid + ask) / 2` instead of separate bid/ask lines.

---

## REST API Endpoints (via ServerDataService)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/info` | Server info |
| GET | `/info/apis` | Available API list |
| GET | `/info/bots-types-list` | Bot type definitions |
| GET | `/info/job-type-list` | Job type definitions |
| GET | `/bots/get-all` | All bots and their status |
| GET | `/bot/:botId/settings` | Bot settings |
| GET | `/bot/:botId/params` | Bot runtime params |
| GET | `/bot/:botId/errors` | Bot error log |
| GET | `/bot/:botId/arbitrage` | Arbitrage events |
| POST | `/bot/:botId/pause` | Pause/resume bot `{ pause: bool }` |
| POST | `/bot/:botId/send-data` | Toggle data saving `{ isSend: bool }` |
| PUT | `/bot/:botId/settings` | Update bot settings `{ data: string }` |
| POST | `/bot/:botId/restart` | Restart bot |
| GET | `/rules/get-all` | All rules |
| GET | `/prices/keys` | Available price keys |
| GET | `/prices/key/:key` | Historical price points by key |

---

## Key Files Quick Reference
| Path | Purpose |
|------|---------|
| `src/app/app.config.ts` | App providers: Store, Effects, Router, HttpClient, AgGrid |
| `src/app/app.routes.ts` | Route definitions |
| `src/app/+state/servers/configs.ts` | Server list, `emptyAsyncResponse`, empty state shapes |
| `src/app/+state/servers/servers.effects.ts` | All HTTP side-effects, tab-driven loading |
| `src/app/+state/servers/servers.selectors.ts` | All selectors (isLoading/isLoaded/error per slice) |
| `src/app/services/server-data.service.ts` | Single HTTP service, dynamic base URL |
| `src/app/services/price-key-utils.ts` | Price key formatting, series builder, color palette |
| `src/app/models/api.ts` | Base `API` interface |
| `src/app/models/servers.ts` | All data model interfaces |
| `src/app/components/+stabs/` | ag-Grid ColDef definitions |
| `src/app/components/price-chart/price-chart.ts` | Reusable chart component (interfaces exported) |
| `src/app/+state/view/view.reducer.ts` | Tab list — add new tabs here |
| `api.stabs.ts` (root) | Commented-out API documentation |

---

## Step-by-Step: Adding a New Feature

### New tab on the main page
1. Add tab name to `tabList` array in `src/app/+state/view/view.reducer.ts`
2. Add load action in `src/app/+state/servers/servers.actions.ts`
3. Add effect case in `servers.effects.ts` → `loadDataByTab$` switch
4. Add API method in `server-data.service.ts`
5. Create component in `src/app/components/my-feature/`
6. Create container in `src/app/containers/my-feature-container/`
7. Wire container into `src/app/containers/tabs-container/tabs-container.html`

### New ag-Grid table
1. Define `ColDef[]` in `src/app/components/+stabs/my-feature-stabs.ts`
2. Create container that selects data from Store and passes `rowData` + `colDefs` to `<app-ag-grid>`

### New bot detail tab
1. Add tab option in `src/app/components/bot-info-page-tabs/`
2. Create container, wire into `bot-info-page-tabs-container.html`
3. Data for active bot is loaded via `setActiveBot` action → selector `getInfoActiveBot` / `getDataActiveBot`

### New chart with live data
1. Reuse `PriceChart` component (`src/app/components/price-chart/`)
2. Create container that loads historical data from REST, then connects socket.io
3. Use `PriceChartLiveContainer` as a reference implementation
4. Discover keys with `findPriceKeys(allKeys, source, token0, token1)` from `price-key-utils.ts`
