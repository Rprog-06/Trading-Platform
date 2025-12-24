Live Link for demo:https://trading-platform-frontend-sigma.vercel.app
demo:
email:xyz@gmail.com
password:Rizwan@25
Youtube Link:https://youtu.be/sceS4He93m0
## Architecture Overview

This trading platform follows a microservices-based architecture with real-time communication.

### Services

1. **Frontend (Next.js)**
   - User interface for trading
   - Receives real-time updates via WebSockets

2. **API Gateway**
   - Handles authentication and REST APIs
   - Publishes order commands to Redis

3. **Execution Service**
   - Subscribes to order commands
   - Decrypts Binance API keys
   - Places market orders using Binance API
   - Publishes order execution results

4. **Event Service**
   - Subscribes to execution events
   - Streams real-time order updates to clients

### Communication

- **Redis Pub/Sub**
  - `commands:order:submit` → Order requests
  - `events:order:status` → Execution results

### Order Execution Flow

1. User submits order from frontend
2. API Gateway publishes order command to Redis
3. Execution Service places order on Binance
4. Executed price is calculated as:
5. Execution result is published to Redis
6. Event Service pushes update to frontend

### Key Benefits

- Loose coupling between services
- Real-time updates
- Horizontally scalable
- Production-ready design

Frontend
   ↓
API Gateway
   ↓  (publish)
Redis: commands:order:submit
   ↓  (subscribe)
Execution Service
   ↓  (publish)
Redis: events:order:status
   ↓  (subscribe)
Event Service
   ↓
Frontend (WebSocket)
Deployed frontend on Vercel and all other services on Railway
Security
Binance API keys are encrypted in the database
Keys are decrypted only inside Execution Service
No sensitive data exposed to frontend
