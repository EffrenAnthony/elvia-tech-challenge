import { Router } from 'express';
import { startConversation, whatsappWebhook } from '../controllers/conversation.controller.js';

const router = Router();

// POST /api/start-conversation
router.post('/start-conversation', startConversation);

// POST /api/whatsapp-webhook
router.post('/whatsapp-webhook', whatsappWebhook);

export default router;
