
<h1 align="center" style="border-bottom: none; height: 200px;">
    <a style="height: 200px; max-width: 200px;" href="https://conveyor.open.ug" target="_blank">
        <img alt="Conveyor CI Logo" src="https://conveyor.open.ug/logos/logo.svg" style="height: 200px; max-width: 200px;">
    </a>
</h1>

<div align="center">

![Docker Pulls](https://img.shields.io/docker/pulls/openug/conveyor.svg?maxAge=604800)
[![Go Report Card](https://goreportcard.com/badge/github.com/open-ug/conveyor)](https://goreportcard.com/report/github.com/open-ug/conveyor)
[![License](https://img.shields.io/github/license/open-ug/conveyor.svg)](https://github.com/open-ug/conveyor/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/open-ug/conveyor)](https://github.com/open-ug/conveyor/releases)
[![Maintainability](https://qlty.sh/badges/229750f3-9423-4ea6-8528-8e0f8cf854b5/maintainability.svg)](https://qlty.sh/gh/open-ug/projects/conveyor)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/10999/badge)](https://www.bestpractices.dev/projects/10999)

</div>

---

# Conveyor CI

**A headless workflow orchestration engine for building custom CI/CD, automation, and delivery platforms.**

Conveyor CI is a lightweight control plane for platform teams that want to build their own CI/CD systems, deployment platforms, internal developer platforms, or automation backends.

It is not an all-in-one CI/CD product like Jenkins, GitHub Actions, GitLab CI, or Argo Workflows. Conveyor does not provide a built-in dashboard, hosted runners, or an opinionated execution environment. Instead, it provides the orchestration layer: workflow state, job lifecycle management, event-driven execution, log streaming, and APIs that you can embed into your own platform.

You bring the execution logic. Conveyor manages the orchestration.

## Why Conveyor CI?

Many CI/CD and workflow systems are built as complete platforms. They usually bundle together:

- A user interface
- Pipeline orchestration
- Job scheduling
- Execution environments or runners
- Storage
- Logs
- Authentication and access control
- Infrastructure-specific assumptions

That works well when you want to adopt a complete CI/CD system.

Conveyor CI is designed for a different use case: building your own platform.

It gives platform developers a small, embeddable orchestration core that can be connected to custom execution environments through drivers. This makes it useful when you need full control over where workloads run, how they run, and how the developer experience is exposed.

## Use Cases

Conveyor CI is designed for platform builders, infrastructure teams, and product teams building automation into their own systems.

Common use cases include:

- Internal Developer Platforms that need custom build and deployment workflows
- PaaS platforms that provide “deploy from Git” or “build from source” features
- SaaS products that need background job orchestration or task execution
- Custom CI/CD platforms with organization-specific execution rules
- Edge, IoT, or air-gapped environments where standard CI/CD systems are too heavy or too restrictive
- Systems that need to orchestrate jobs across Kubernetes, bare metal, virtual machines, or custom infrastructure

## Project Status

Conveyor CI is under active development.

The project currently focuses on the core orchestration runtime, SDK design, workflow execution primitives, driver integration model, and log streaming. Some advanced capabilities, such as full DAG execution, secrets management, RBAC, namespacing, and observability improvements, are part of the roadmap.

For current progress, see the project roadmap:

- [Roadmap](https://conveyor.open.ug/docs/contributing/roadmap)
- [GitHub Milestones](https://github.com/open-ug/conveyor/milestones)

## Architecture

Conveyor CI separates orchestration from execution.

The control plane is responsible for managing workflow and job state. Drivers are responsible for actually running the workload.

| Component                     | Responsibility                                                                       | Provided By |
| ----------------------------- | ------------------------------------------------------------------------------------ | ----------- |
| **Control Plane**             | Job lifecycle management, state persistence, queuing, retries, log aggregation, APIs | Conveyor CI |
| **SDK**                       | Typed interface for interacting with the engine                                      | Conveyor CI |
| **Drivers (Execution Logic)** | The code that actually runs workloads                                                | **You**     |

Conveyor does **not** ship drivers, you define execution. This separation gives you, Infrastructure independence, Security model control, Hardware flexibility, Multi-environment support.

## Core Capabilities

Conveyor CI provides the orchestration primitives required to build serious CI systems:

* Job Lifecycle Management: creation, scheduling, retries, cancellation.
* State Persistence: durable workflow state tracking
* Event-Driven Execution: reactive architecture for scaling systems.
* Real-Time Log Streaming: aggregated and streamed logs.
* Declarative Workflows: define pipelines as structured configurations.
* API-First Design: fully accessible via HTTP.
* Embeddable Runtime: small Go binary, minimal resource footprint.

No UI. No opinionated runners. No vendor lock-in.

Just orchestration.

### Why This Design?

Most CI/CD platforms bundle UI, Execution environment, Orchestration logic, Storage, Scheduling, Opinionated infrastructure assumptions. Conveyor extracts the **orchestration layer** and leaves execution to you. This enables:

* Running on edge devices
* Air-gapped military networks
* Custom hardware
* Multi-cloud abstraction
* Fully white-labeled CI platforms

It’s the missing middle layer between Infrastructure and Developer-facing CI platforms.

## Installation

Conveyor CI is Linux-first and distributed as a lightweight Go binary.

```bash
curl -fsSL conveyor.open.ug/install | sh
```

More installation options and configuration guides are available in the [official documentation](https://conveyor.open.ug/docs/installation).


### Example Use Case

You are building an Internal Developer Platform. You want:

* Teams to push code
* Pipelines to trigger
* Jobs to execute inside Kubernetes
* Logs to stream back to your web dashboard

With Conveyor:

* Conveyor handles orchestration, state, and events.
* Your Kubernetes driver handles execution.
* Your UI consumes Conveyor’s API.

Clean separation. Clear ownership.

### Contributing

Please 🌟 star the project if you like it.

Contributions are welcome! Please read [contributing guide](https://conveyor.open.ug/docs/contributing/how-to-contribute) and follow the governance model to submit PRs, issues, or feature requests.

### License

Apache License 2.0, see [LICENSE](./LICENSE).
Copyright © 2024 - Present, Conveyor CI Authors.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopen-ug%2Fconveyor.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopen-ug%2Fconveyor?ref=badge_large)
