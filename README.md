# 💬 Chatify - A Scalable Real-Time Chat Application

Chatify is a scalable, real-time chat application built with a microservices architecture. It supports 1-to-1 and group chats, friend request management, group creation and invitations, global user search, and reliable real-time messaging.

## 🧠 Architecture & Service Responsibilities

- **api-server**: Handles user authentication (JWT-based), friend request logic, group creation, and invitation functionality.
- **ws-server**: Manages WebSocket connections for 1-to-1 and group messaging, and sends real-time updates for messages, requests, and invites.
- **data-patch-service**: Consumes messages from Kafka, holds them in memory until a threshold is reached, and performs bulk insertion into PostgreSQL. Failed inserts are retried via a Kafka retry topic.

## 🔄 System Flow

1. **User Authentication & Features**: 
   - Handled by `api-server` (login, signup, logout, friend requests, group operations).
2. **Real-time Messaging**:
   - WebSocket connection is established with `ws-server` when a user starts a chat.
   - Messages are temporarily cached in Redis and then published to Kafka.
3. **Message Persistence**:
   - `data-patch-service` consumes Kafka messages, aggregates them in memory, and performs bulk inserts into PostgreSQL.
   - If the insert fails, the messages are re-published to a Kafka retry topic and retried.

## 🧱 Stack Overview

- **Frontend**: React.js + TypeScript, Redux Toolkit, RTK Query, Material UI, React Router DOM, Socket.io Client
- **Backend**: Node.js, Express.js, Prisma, PostgreSQL, TypeScript
- **Real-time & Messaging**: Socket.io, Redis, Kafka
- **Monorepo Tooling**: Turborepo

## 🐳 Docker, ☸️ Kubernetes & CI/CD

- All three services (`api-server`, `ws-server`, `data-patch-service`) have their own `Dockerfile`s for containerized builds.
- Kubernetes manifests are provided for:
  - `api-server`, `ws-server`, `data-patch-service`
  - Redis, Kafka, PostgreSQL (self-hosted)
  - ConfigMaps for environment variables
- A GitHub Actions workflow (`.github/workflows/deploy.yml`) is set up for Continuous Deployment (CD):
  - On every push to main or relevant services, Docker images are built and automatically pushed to Docker Hub.

📦 Kubernetes YAML files are available in a separate repo:  
👉 [Kubernetes Deployment Manifests](https://github.com/Rajdiwate/ops/tree/main/chatify) 

---
