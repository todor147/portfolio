---
title: EV Route Optimizer
tagline: A* routing for electric vehicles, with live charging stops
description: An Android app that plans multi-stop EV road trips end-to-end — real-time charging station insertion via OpenChargeMap, GraphHopper road routing, Open-Meteo weather effects, OBD-II Bluetooth SoC reading, and turn-by-turn MapLibre navigation. Built with Jetpack Compose and a custom A* engine over a (waypoint × SoC) state space.
image: ev-route-optimizer.png
tags: ["kotlin", "android", "jetpack-compose", "maps", "ev", "routing"]
stack: ["Kotlin 2.2", "Jetpack Compose", "Material 3", "MapLibre", "Room", "Koin", "Retrofit", "WorkManager"]
githubUrl: https://github.com/todor147/ev-route-optimizer
featured: true
order: 4
problem: "Every popular EV navigation app treats charging stops as an afterthought — they slot in a single stop along the fastest road, ignoring your current battery level, your charger type, real-time station availability, ambient temperature effects on range, and the compound cost of going above 80% SoC on a tapered charge curve. The result is routes that look fast on paper but leave you range-anxious on the motorway."
approach: "Built a custom A* search engine over a two-dimensional state space: (waypoint index × state-of-charge). Each node is a (location, SoC) pair; edges are road segments whose energy cost comes from a physics model accounting for speed-dependent aerodynamic drag, rolling resistance, elevation gradient, temperature derating, and HVAC overhead. The charging model applies a non-linear taper above 80% SoC. Four optimisation modes (Fastest, Fewest Stops, Balanced, Eco) weight the heuristic differently. The engine dominance-prunes states, so it never expands a node if a cheaper path to the same location at higher SoC already exists."
contribution: "Sole developer — A* engine, energy and charging models, all four API integrations (GraphHopper, OpenChargeMap, Open-Meteo, Photon), OBD-II Bluetooth SoC reader, Room caching, WorkManager prefetch, calendar integration, and the full Compose UI with MapLibre navigation."
learnings: "The routing problem is harder than it looks because SoC is not just a constraint — it is part of the search state. Treating it that way (rather than post-processing a road route) is what allows the engine to find routes that would never emerge from a road-distance-only search: a slightly longer road segment that bypasses a detour to a slow charger, or a route that arrives at a fast charger with exactly enough margin to charge quickly and press on. The other hard lesson was the energy model: an overly aggressive speed-consumption curve caused the engine to over-insert stops on motorways. Calibrating it against real-world EV consumption data (80% rolling resistance, 20% aerodynamic drag growing with v²) brought the stop count in line with what drivers actually experience."
---

## Screenshots

<div class="screenshot-grid">
  <img src="/assets/ev-route-optimizer-plan.png" alt="Plan Route — origin, destination, battery parameters and connector type" />
  <img src="/assets/ev-route-optimizer-itinerary.png" alt="Route Itinerary — charging stops, durations, arrival SoC, and quality score" />
  <img src="/assets/ev-route-optimizer.png" alt="Turn-by-turn Navigation — MapLibre map with route line and speed/ETA HUD" />
</div>

> A multi-stop EV route planner that treats charging as a first-class citizen of the search — not a post-processing step bolted onto a road-distance result.

EV Route Optimizer plans electric-vehicle road trips end-to-end: you enter origin, destination, battery parameters, and connector type; the engine finds the optimal sequence of charging stops and returns a full itinerary with charge durations, arrival SoC at each stop, and a quality score versus the unconstrained baseline.

The app integrates four live APIs — **GraphHopper** for road segments and elevation, **OpenChargeMap** for real-time charging station data, **Open-Meteo** for temperature and weather, and **Photon** for geocoding — and reads current state-of-charge directly from the vehicle via an **OBD-II ELM327 Bluetooth** adapter.

## How the routing engine works

The A* search operates over a **(waypoint, SoC)** state space. Every node is a `(location, battery%)` pair. Edges are road segments whose cost is computed from a physics-based energy model:

- **Speed-dependent drag** — rolling resistance (~80%) plus aerodynamic drag (~20%) growing with v². Calibrated to real EV consumption curves so the engine doesn't over-insert stops on motorways.
- **Elevation factor** — net gravitational work per segment, signed (uphill costs, downhill recovers).
- **Temperature derating** — cold-battery and HVAC overhead extracted from Open-Meteo forecasts at the departure time.
- **Charging model** — non-linear taper above 80% SoC reflects real fast-charger behaviour; cold-battery derate applies to charging speed.

**Dominance pruning** ensures the engine never re-expands a `(location, SoC)` pair if it has already found a path to the same location at equal or higher SoC for equal or lower cost.

## Four optimisation modes

| Mode | What it optimises |
|---|---|
| **Fastest** | Minimise total trip time including charge sessions |
| **Fewest Stops** | Minimise number of charging stops |
| **Balanced** | Weighted blend of time and comfort margin |
| **Eco** | Minimise energy cost; prefers lower speeds and gentler charge profiles |

## Key features

- **Live charging station insertion** — OpenChargeMap filtered by connector type, minimum power, and a 6-hour freshness TTL.
- **OBD-II SoC reading** — ELM327 Bluetooth adapter; non-blocking I/O with a 3.5s timeout; circuit-breaker after 5 consecutive failures.
- **Offline fallback** — Room-cached routes (55m coordinate tolerance) and stations serve results when the network is unavailable.
- **WorkManager prefetch** — background job pre-warms station and route caches for saved trips before departure.
- **Calendar integration** — reads upcoming events with location fields and surfaces them as one-tap trip suggestions.
- **Turn-by-turn navigation** — MapLibre map with route polyline, location tracking, and a speed/ETA heads-up display.
- **Sensor calibration** — persistent efficiency calibration from real trips to refine the energy model over time.

## Engineering highlights

- Custom A* over a two-dimensional state space — not a wrapper around any existing routing library.
- Physics energy model calibrated to real EV consumption data, not a lookup table.
- Non-blocking OBD serial I/O (`available()` polling + deadline loop) to avoid indefinite blocking on `InputStream.read()`.
- Room coordinate matching at 0.0005° (~55 m) to avoid serving cached routes for wrong locations.
- `Dispatchers.Default` for CPU-bound JSON serialisation; `Dispatchers.IO` for all network and database work.
- MVVM + Repository + Koin DI throughout; WorkManager `try-finally` ensures DB handles are always closed.
