<div align="center">

# Backend from First Principles

### A Curated High-Yield Production Engineering Manual (18 Core Chapters)

**Network Protocols** • **Kernel Sockets** • **DBMS & Storage** • **Concurrency** • **Real-Time & Distributed Systems**

[Read the Live Manual](https://amankashyapp07.github.io/Backendd/) · [Curriculum Index](https://amankashyapp07.github.io/Backendd/#curriculum) · [Author](https://github.com/AmanKashyapp07)

---

</div>

**Backend from First Principles** is a curated engineering reference manual covering core backend systems, protocols, data architecture, and production engineering — grounded in **JavaScript (Node.js 20+ & Express 5)** with runnable code, architectural diagrams, and real-world case studies.

Curated specifically for **software engineering & distributed systems interviews at top tech companies**, this manual cuts through framework boilerplate to master the foundational systems concepts interviewers actually test:
- How kernel socket buffers work and what bytes look like as they traverse TCP and TLS.
- How connection pools manage contention and how relational databases enforce ACID guarantees under concurrent writes.
- How the Node.js event loop, thread pool, and `libuv` multiplex non-blocking I/O.
- How distributed brokers provide ordering semantics and how task queues provide backpressure under burst traffic.
- How real-world production systems like **NexusIDE** (collaborative cloud IDE) and **MagnusCI** (containerized CI/CD engine) implement these primitives at scale.

---

## Real-World Case Studies

Every major systems concept is backed by production case studies drawn from real infrastructure:

* **Container Sandboxing & Hibernation**: Controlling `/var/run/docker.sock`, cgroup memory/CPU limits, and container pausing/unpausing in **NexusIDE** and **MagnusCI**.
* **Real-Time CRDT State Mesh & Backpressure**: Yjs binary state vectors, `ws.bufferedAmount` congestion control, and terminal micro-batching in **NexusIDE**.
* **Asynchronous Webhook Backpressure**: Redis-backed BullMQ priority queues and stalled-job auto-reclaim under high-velocity webhook bursts in **MagnusCI**.
* **Distributed Locking with Redlock**: Redis `SET NX PX` and atomic Lua release scripts to eliminate multi-pod write races in **NexusIDE**.
* **Worker Threads Offloading**: Preventing event loop stalls during CPU-intensive Merkle DAG SHA-1 hashing via `node:worker_threads` in **NexusIDE**.
* **Cryptographic Ingress Verification**: Raw-body stream capturing and constant-time HMAC-SHA256 signature verification (`crypto.timingSafeEqual`) in **MagnusCI**.
* **High-Throughput Binary Storage**: Storing CRDT state vectors in PostgreSQL `BYTEA` with covering indexes (`INCLUDE`) for zero-heap Index-Only Scans and vectorized `UNNEST` batch inserts in **NexusIDE**.

---

## Curated High-Yield Curriculum

### Part I: The Request Path
1. **HTTP and CORS** — Protocol mechanics, methods, headers, status codes, conditional requests, proxies, and TLS.
4. **Authentication and Authorization** — JWTs, Argon2id hashing, secure HttpOnly sessions, RBAC, and auth flows.
7. **API Design (REST API)** — Idempotency keys, cursor pagination, and standardized error envelopes.

### Part II: State & Machinery
8. **Databases** — Connection pooling, ACID transaction lifecycles, indexing theory, `BYTEA` binary storage, and query optimization.
9. **Caching** — Cache-aside pattern, eviction strategies, Redis sliding window rate limiters, and session storage.
10. **Task Queues and Background Jobs** — Asynchronous job processing, priority queues, retries, and workflows with BullMQ.
12. **Error Handling and Fault-Tolerant Systems** — Centralized error middleware, circuit breakers, and exponential backoff with jitter.
13. **gRPC and Inter-Service Communication** — Protocol Buffers, unary and streaming RPCs with `@grpc/grpc-js`.

### Part III: Running in Production
15. **Logging, Monitoring, and Observability** — Structured JSON logging with Pino, trace propagation, and Prometheus metrics.
16. **Graceful Shutdown** — Signal trapping (`SIGTERM`), socket draining, and reverse-order resource teardown.
17. **Backend Security** — OWASP Top 10 defenses, SQL injection prevention, safe process execution, and Helmet headers.
18. **Backend Scaling and Performance Engineering (Part 1)** — Latency percentiles, V8 profiling, connection pooling, and CPU offloading to `worker_threads`.
19. **Backend Scaling and Performance Engineering (Part 2)** — Stateless session stores, load balancer health probes, and worker clusters.
20. **Concurrency & Parallelism** — Event loop mechanics, race conditions, in-memory mutexes, and distributed locking with Redlock.

### Part IV: Distribution & Scale
21. **Containerization, Deployment, Docker, Kubernetes, and CI/CD** — Multi-stage Dockerfiles, Docker API orchestration, cgroups, and DAG pipelines.
23. **Message Brokers and Event Streaming** — Partitioned Kafka producers, consumer groups with KafkaJS, and outbox patterns.
24. **WebSockets and Real-Time Communication** — Event-driven `ws` servers, heartbeat liveness, socket backpressure, and Redis Pub/Sub backplanes.

### Part V: Personal & Developer Craft
25. **All About Git** — Content-addressable storage, object database internals, Merkle DAGs, plumbing vs porcelain, rebase mechanics, and NexusIDE's CAS engine.

---

## Author

Curated and built by **Aman Kashyap** ([@AmanKashyapp07](https://github.com/AmanKashyapp07)).
