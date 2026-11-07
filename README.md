# KC Streetcar Executive Observability Dashboard

**Live Demo:** [champlin92.github.io/kc-streetcar-dashboard](https://champlin92.github.io/kc-streetcar-dashboard/)  
**Author:** [Max Ballard](https://champlin92.github.io/resume-website/) — IT Manager, InfraOps & Operations Automation Leader

---

## Overview

The **KC Streetcar Executive Dashboard** is a real-time operational observability and telemetry demonstration modeled around the Kansas City Streetcar transit network. Built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**, it demonstrates how high-velocity operational telemetry (modeled on [GTFS-Realtime](https://gtfs.org/realtime/) vehicle feeds) and historical baseline data can be unified into an actionable, single-pane-of-glass executive view.

While this project uses a simulated telemetry engine in the browser so it can run reliably as a zero-backend static deployment, its architecture and UX reflect real-world **Enterprise Infrastructure & Operations Observability** principles: translating noisy, low-level system state into immediate service-level clarity.

---

## Key Dashboard Capabilities

### 1. Live On-Time Performance (OTP) Telemetry
* **Rolling Time-Series Monitoring:** Polls fleet state on a 3-second interval (`T-57s` to `T-0`), plotting real-time network schedule adherence.
* **SLA Visibility:** Gives operators and leadership an immediate visual trend line to distinguish isolated hiccups from systemic network degradation.

### 2. Historical Ridership Context (3-Month Baseline)
* **Macro-Level Demand Curve:** Displays 12 weeks of aggregated historical ridership data (**May W1 – Jul W4**, totaling **431,000+ riders** across the quarter, peaking during mid-summer demand at 42,100 weekly riders).
* **Why Historical Data Is Paired with Live Telemetry:** Real-time metrics in a vacuum can be misleading. A spike in vehicle occupancy or a minor schedule variance looks very different during a peak summer ridership week (~42k riders/wk) versus an early-spring baseline (~28.5k riders/wk). Pairing historical throughput baselines with live operational metrics allows teams to correlate **capacity utilization** with **service reliability** and plan maintenance windows around historical demand.

### 3. Active Fleet Availability & Asset Health
* **Fleet Readiness Tracking:** Tracks the 6-car fleet (`Cars #801–#806`) across active corridor stops (*Union Station*, *Crossroads*, *Power & Light*, *Metro Center*, and *City Market*) versus units offline at the *Maintenance Facility*.
* **Dynamic Threshold Alerting:** Automatically shifts visual health indicators from **Operational (Emerald)** to **Degraded Capacity (Amber)** when active in-service availability drops to `4 / 6` vehicles or fewer.

### 4. Live Fleet Positions, Occupancy & Automated Incident Detection
* **Granular Asset Table:** Surfaces per-vehicle operational status (`In-Service`, `Delayed`, `Maintenance`), current stop location, real-time passenger load percentage (`Occupancy` progress bars with >70% high-load indicators), and schedule variance (`On Time` vs. `+N min`).
* **Automated Anomaly Panel (`Live Incidents`):** Continuously evaluates fleet telemetry to automatically trigger active incident banners when vehicles report schedule variances, or confirm `All network segments clear` when operating within normal SLA parameters.

---

## Why Observability Dashboards Like This Are Necessary

In large-scale operations—whether managing a metropolitan transit fleet or supporting infrastructure and POS ecosystems across **3,600+ retail locations**—raw data is rarely the bottleneck. The bottleneck is **signal-to-noise ratio**.

1. **Bridging Raw Telemetry and Executive Decision-Making**
   Raw JSON payloads, server logs, and batch job exit codes are essential for L3 engineering, but they create cognitive overload during an active incident. A well-engineered observability dashboard distills thousands of data points into four core questions:
   * *Is the system healthy right now?* (On-Time Performance & Active Incidents)
   * *What is our current capacity vs. demand?* (Active Fleet & Passenger Occupancy vs. Historical Ridership)
   * *Where is the exact point of failure?* (Per-Vehicle Status & Stop Location)
   * *Do we need to intervene or reroute resources?* (Automated Delay Detection)

2. **Shifting from Reactive Triage to Proactive Operations**
   Without unified observability, operations teams learn about failures only after downstream users—store associates, customers, or transit riders—report an outage. By correlating real-time health telemetry with automated anomaly thresholds, teams can detect degradation early, route alerts directly to the right engineering tier, and suppress cascading downstream impact before a minor delay becomes a Sev-1 outage.

3. **De-Siloing Operational Knowledge**
   Embedded contextual tooltips (`InfoTooltip`) and clear visual status indicators ensure that L1/L2 support, L3 systems engineers, and non-technical stakeholders all interpret system health using the exact same definitions and SLA baselines.

---

## Technical Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, configured for Static Export)
* **UI & Language:** [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Data Visualization:** [Recharts 3](https://recharts.org/) (`ResponsiveContainer`, `LineChart`, `BarChart`)
* **Icons:** [Lucide React](https://lucide.dev/)
* **CI/CD:** GitHub Actions workflow (`.github/workflows/nextjs.yml`) automatically building and deploying to GitHub Pages on every push to `main`.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the local development server at http://localhost:3000
npm run dev

# Build static production export into ./out
npm run build
```

---

*Disclaimer: This dashboard is an engineering and observability portfolio demonstration. While modeled on Kansas City Streetcar stops, fleet identifiers, and seasonal ridership patterns, the live telemetry stream is simulated client-side and does not represent official KC Streetcar Authority operational feeds.*
