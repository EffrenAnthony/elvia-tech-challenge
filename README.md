# Elvia Tech Challenge – Product Engineer

## Part 1: Planning (written response)

## 1. High-Level Architecture

This feature has two responsibilities:

1. **Proactive contact** – sending a WhatsApp message on a student’s graduation day.
2. **Interactive conversation** – collecting job preferences and responding with a curated list.

### System Overview

The architecture includes the following components:

- **Graduation Webhook (Express/FastAPI/Nest JS)**
  - Exposes a POST endpoint for client systems (e.g. educational institutions) to notify us when a student graduates.
  - Registers the student and triggers the first WhatsApp message using WhatsApp Cloud API.

- **WhatsApp API**
  - Sends the first proactive message to the student.
  - Enables two-way messaging with the student.

- **Conversation Handler**
  - **Option A: Simple decision-tree bot** (for MVP)
    - Predefined set of questions and logic handled inside the backend.

  - **Option B: Botpress or LLM integration**
    - Visual, flexible flow builder for conversational logic.
    - Can later integrate LLMs like OpenAI to improve engagement and natural language understanding.

- **Matching Engine**
  - Once preferences are collected, queries the job database and returns relevant offers.

- **Database (MongoDB or PostgreSQL)**
  - Stores student info, conversation context, and job listings.

### System Diagram

```
Client System
   │
   └──▶ POST /api/start-conversation
               │
               ▼
      [Trigger Backend Graduation Webhook]
               │
   ┌────────────┴─────────────┐
   ▼                          ▼
[Store user in DB]      [Send message via WhatsApp Cloud API]
                                   │
                                   ▼
                    Student replies on WhatsApp
                    [POST /api/whatsapp-webhook]
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
         [Option A: Decision Tree]     [Option B: Botpress or LLM Flow]
                        │                         │
                        └────────────┬────────────┘
                                     ▼
                     Send preferences to Matching Engine
                                     ▼
                            Query Job Listings DB
                                     ▼
                       Send personalized job list via WhatsApp
```

### Technologies Chosen

| Component          | Technology                                                              | Reasoning                                                                     |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| API Backend        | Python + FastAPI or <br>JavaScript + Express or <br>TypeScript + NestJS | Fast, modern, async-ready, escalable                                          |
| Messaging          | WhatsApp Cloud API                                                      | Free-tier available, simple integration                                       |
| Conversation Logic | Decision Tree or Botpress/LLM                                           | Botpress is open-source and highly flexible/LLM can be integrated with OpenAI |
| DB                 | MongoDB or PostgreSQL                                                   | MongoDB for agility in MVP; PostgreSQL for production queries                 |
| Infrastructure     | AWS / Azure                                                             | Potential use of Lambda / Functions in production                             |

> Regarding my backend framework choice, I would recommend any of the previous options. However, for this technical challenge my choice is **Javascript + Express** because of its simplicity, familiarity quick development, and the ability to easily scale and deploy.

---

## 2. Handling Ambiguity & Assumptions

### Questions to the Product Manager:

1. How is the graduation event triggered? Do we have API access or integration with the educational institution's system?
2. Are we allowed to use third-party services like Botpress, WhatsApp Cloud API, or even LLMs with associated costs?
3. In case of graduation date changes, cancellations, or student dropouts, how do we manage the update?
4. Do we have access to a fallback mechanism, such as a student-facing platform where they can update their graduation status?
5. How should we handle responses like "I don't know yet"? Do we continue the conversation or drop it?

### Key Assumptions:

- We assume institutions have integrated with our webhook and can trigger the graduation event.
- We assume usage of third-party services (at least free-tier options) is permitted.
- We assume students will receive messages via WhatsApp using Cloud API.
- If a student responds with uncertainty, we prefer to continue the conversation by exploring their interests, educational background, and routines to help guide them.

---

## 3. The Trigger Mechanism

To send the initial message on graduation day, we rely on an **event-driven mechanism**:

- We expose a `POST /api/start-conversation` endpoint that clients (institutions) call when a student graduates.
- This avoids the need for cron jobs and ensures data is real-time.

If institutions cannot trigger the event directly:

- We could provide a student platform where they register their graduation date.
- Then, a daily cron job could run to find students graduating that day and trigger the message.

However, relying on real-time webhook integration is the preferred and more reliable method.

---

## 4. Scrappy vs. Scalable

### The MVP (Scrappy)

- We assume the client (institution) integrates with our webhook to trigger graduation events.
- Our Backend handles the webhook and messages students via WhatsApp Cloud API.
- A simple decision-tree handles conversation logic for collecting job preferences.
- Matching logic filters jobs from a small MongoDB or PostgreSQL instance.

### The Vision (Scalable)

To support 100,000+ users, we would:

1. Move from a monolith to microservices:
   - Graduation Service
   - Messaging Service
   - Conversation Service
   - Matching Service

2. Use queue-based systems (e.g., AWS SQS) to decouple services.
3. Use serverless functions (AWS Lambda or Azure Functions) for isolated operations like sending messages.
4. Transition to a more scalable DB setup (managed PostgreSQL or sharded MongoDB).

### Anticipated Complications:

- Migrating from monolith to microservices must be done in stages to avoid user impact.
- During the transition, syncing databases and orchestrating traffic between monolith and microservices may cause issues.
- We must ensure message delivery is idempotent and resilient to failure.
- As the user base grows, managing concurrent requests and state across services (especially conversations) becomes more complex.

---

## Part 2: Building (coding task)

For implementation details, code structure, and testing instructions, see:

[README_TECH.md](./README_TECH.md)
