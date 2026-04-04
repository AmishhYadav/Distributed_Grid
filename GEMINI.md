<!-- GSD:project-start source:PROJECT.md -->
## Project

**Decentralized Energy Microgrid Simulation**

An interactive web dashboard visualizing a decentralized energy microgrid simulation. Multiple smart household nodes, equipped with solar panels and batteries, use Random Forest machine learning on synthetic data to predict energy demand and autonomously negotiate power sharing, storage, or requests without a central controller.

**Core Value:** Demonstrate efficient, autonomous, and resilient decentralized grid energy sharing driven by real-time localized machine learning predictions.

### Constraints

- **Execution**: The P2P negotiation must truly avoid a central controller; nodes should message peers directly or via a simulated message bus masking as P2P.
- **Visuals**: The dashboard must meet premium UI aesthetic requirements (dynamic layouts, responsive metrics, high user impression).
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Overview
## Languages
- Target languages have not been instantiated.
- Currently, only the GSD toolset internal scripts exist (JavaScript/Node.js for `.agent`).
## Runtime
- N/A for application.
- Node.js is utilized for `.agent/get-shit-done/bin/gsd-tools.cjs`.
## Frameworks
- None active in the primary workspace.
## Package Management
- No `package.json`, `Cargo.toml`, `go.mod`, or `requirements.txt` detected.
## Infrastructure
- Local development environment.
## Recommendations
- Needs initialization of the core tech stack through `/gsd-new-project`.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Overview
## Code Style
- Linting: None configured.
- Formatting: None configured.
- Rules: To be established.
## Naming Conventions
- Variables: N/A
- Functions: N/A
- Classes: N/A
## Error Handling
- N/A
## Best Practices
- Initialize standard linting config based on the chosen stack in the future.
- Use strict typing where applicable.
- Ensure consistent spacing and syntax.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Current State
## High-Level Pattern
- N/A
## Data Flow
- N/A
## Major Components
- Project boilerplate (`.agent` and `.claude` directories).
- Core application components: Missing.
## Entry Points
- Currently, the only operational entry point is the GSD tool via CLI commands.
## Abstractions
- None within the application domain.
## Evolution
- To be updated once `/gsd-new-project` provisions the scaffolding.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.agent/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
