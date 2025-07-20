# Elvia Tech Challenge – Product Engineer (TECH README)

## Technical decisions and structure

- **Stack:** Node.js + Express (ES6 modules), no real database, only in-memory structures.
- **Architecture:**
  - `src/app.js`: Express app configuration and middlewares.
  - `src/server.js`: Entry point.
  - `src/routes/`: API routes.
  - `src/controllers/`: Endpoint logic.
  - `src/services/`: Business and conversation logic.
  - `src/data/`: Mock data.
  - `src/utils/`: Utilities (latency, etc).
- **Security:** Helmet, CORS configured, 404 error handling.
- **Testing:** Jest + Supertest, unit tests for main endpoints.
- **Motivation:** Express is simple, widely adopted, and allows for fast prototyping. ES6 modules are used to keep the code modern and portable.

## Assumptions

- No real persistence or WhatsApp integration required.
- Conversation state is kept in memory (not scalable, but enough for the proof of concept).
- Latency simulation makes the flow more realistic.

## Possible improvements

- Real persistence (MongoDB/PostgreSQL).
- Distributed session management (Redis, etc).
- Real integration with WhatsApp Cloud API.
- More complex conversational flows (Botpress, LLMs).
- More robust validations and error handling.
- Keywords in each job listing to improve matching.

## How to run

> **Requirements:** Node.js v20 or higher (see `.nvmrc` for the recommended version)

1. (Optional) Use the recommended Node version:
   ```bash
   nvm use
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Run the tests:
   ```bash
   npm test
   ```

## How to test the endpoints

### Using curl

**Start conversation**

```bash
curl -X POST http://localhost:3000/api/start-conversation \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1}'
```

**Response:**

```json
{
  "message": "Conversation started",
  "sent": "¡Hola Ana! Felicidades por tu graduación 🎓. ¿Listo para encontrar tu próximo trabajo? ¿Qué tipo de trabajo buscas? (full-time/part-time)"
}
```

**Send WhatsApp reply (first answer)**

```bash
curl -X POST http://localhost:3000/api/whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "text": "part-time"}'
```

**Response:**

```json
{
  "message": "¿Prefieres trabajo remoto o presencial? (remote/on-site)"
}
```

**Send WhatsApp reply (second answer, get jobs)**

```bash
curl -X POST http://localhost:3000/api/whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "text": "remote"}'
```

**Response:**

```json
{
  "message": "¡Gracias! Aquí tienes algunas ofertas que pueden interesarte:",
  "jobs": [
    {
      "id": 102,
      "title": "Analista de mercadeo",
      "type": "part-time",
      "model": "remote"
    }
  ]
}
```

**Send WhatsApp reply (without starting conversation)**

```bash
curl -X POST http://localhost:3000/api/whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "text": "remote"}'
```

**Response:**

```json
{
  "message": "Conversation not started"
}
```

### Using Postman

1. **Start conversation**
   - Method: POST
   - URL: `http://localhost:3000/api/start-conversation`
   - Body (raw, JSON):
     ```json
     {
       "studentId": 1
     }
     ```

2. **Send WhatsApp reply**
   - Method: POST
   - URL: `http://localhost:3000/api/whatsapp-webhook`
   - Body (raw, JSON):
     ```json
     {
       "studentId": 1,
       "text": "full-time"
     }
     ```

## Example: Complete Conversation Flow

Below is a real example of the full conversation flow with requests and responses:

1. **Start conversation**

Request:

```json
{
  "studentId": 1
}
```

Response:

```json
{
  "message": "Conversation started",
  "sent": "¡Hola Ana! Felicidades por tu graduación 🎓. ¿Listo para encontrar tu próximo trabajo? ¿Qué tipo de trabajo buscas? (full-time/part-time/I don't know)"
}
```

2. **First reply (job type)**

Request:

```json
{
  "studentId": 1,
  "text": "part-time"
}
```

Response:

```json
{
  "message": "¿Prefieres trabajo remoto o presencial? (remote/on-site)"
}
```

3. **Second reply (work model)**

Request:

```json
{
  "studentId": 1,
  "text": "remote"
}
```

Response:

```json
{
  "message": "¿Cuál es tu área de estudio? (marketing, diseño, desarrollo, business, etc)"
}
```

4. **Third reply (area of study, get jobs)**

Request:

```json
{
  "studentId": 1,
  "text": "desarrollo"
}
```

Response:

```json
{
  "message": "¡Gracias! Aquí tienes algunas ofertas que pueden interesarte:",
  "jobs": [
    {
      "id": 116,
      "title": "Desarrollador Frontend Junior",
      "type": "full-time",
      "model": "remote",
      "area": "desarrollo"
    },
    {
      "id": 117,
      "title": "QA Tester",
      "type": "part-time",
      "model": "remote",
      "area": "desarrollo"
    },
    {
      "id": 118,
      "title": "Backend Developer",
      "type": "full-time",
      "model": "on-site",
      "area": "desarrollo"
    },
    {
      "id": 119,
      "title": "Ingeniero DevOps",
      "type": "full-time",
      "model": "remote",
      "area": "desarrollo"
    },
    {
      "id": 120,
      "title": "Soporte técnico de software",
      "type": "part-time",
      "model": "on-site",
      "area": "desarrollo"
    }
  ]
}
```

---

### Example: Using "I don't know yet"

1. **Start conversation**

Request:

```json
{
  "studentId": 1
}
```

Response:

```json
{
  "message": "Conversation started",
  "sent": "¡Hola Ana! Felicidades por tu graduación 🎓. ¿Listo para encontrar tu próximo trabajo? ¿Qué tipo de trabajo buscas? (full-time/part-time o I don't know yet)"
}
```

2. **First reply (I don't know yet)**

Request:

```json
{
  "studentId": 1,
  "text": "I don't know yet"
}
```

Response:

```json
{
  "message": "¿Cuál es tu área de estudio? (marketing, diseño, desarrollo, business, etc)"
}
```

3. **Second reply (area of study, get jobs)**

Request:

```json
{
  "studentId": 1,
  "text": "desarrollo"
}
```

Response:

```json
{
  "message": "Mira, te recomiendo estos trabajos según tu área de estudio:",
  "jobs": [
    {
      "id": 116,
      "title": "Desarrollador Frontend Junior",
      "type": "full-time",
      "model": "remote",
      "area": "desarrollo"
    },
    {
      "id": 117,
      "title": "QA Tester",
      "type": "part-time",
      "model": "remote",
      "area": "desarrollo"
    },
    {
      "id": 118,
      "title": "Backend Developer",
      "type": "full-time",
      "model": "on-site",
      "area": "desarrollo"
    },
    {
      "id": 119,
      "title": "Ingeniero DevOps",
      "type": "full-time",
      "model": "remote",
      "area": "desarrollo"
    },
    {
      "id": 120,
      "title": "Soporte técnico de software",
      "type": "part-time",
      "model": "on-site",
      "area": "desarrollo"
    }
  ]
}
```
