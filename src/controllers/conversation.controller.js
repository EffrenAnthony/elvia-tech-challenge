import { simulateLatency } from '../utils/latency.js';
import { students, jobs } from '../data/mockData.js';
import { handleConversationReply, getInitialMessage, getJobMatches } from '../services/conversation.service.js';
import { STRINGS } from '../utils/constants.js';
import { conversationStates } from '../store/conversation.store.js';


export const startConversation = async (req, res) => {
  const { studentId } = req.body;
  const student = students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ message: STRINGS.studentNotFound });
  }
  // Simulate sending first message
  const message = getInitialMessage(student);
  // Initialize state
  conversationStates[studentId] = { step: 0, preferences: {} };
  await simulateLatency();
  return res.json({ message: STRINGS.conversationStarted, sent: message });
};

export const whatsappWebhook = async (req, res) => {
  const { studentId, text } = req.body;
  const student = students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ message: STRINGS.studentNotFound });
  }
  if (!conversationStates[studentId]) {
    return res.status(400).json({ message: STRINGS.conversationNotStarted });
  }
  const state = conversationStates[studentId];
  const reply = await handleConversationReply(state, text);
  // If finished, show job matches
  if (reply.done) {
    const matches = await getJobMatches(state.preferences, jobs);
    conversationStates[studentId] = undefined;
    return res.json({ message: reply.message, jobs: matches });
  } else {
    // Continue conversation
    state.step = reply.nextStep;
    state.preferences = reply.preferences;
    return res.json({ message: reply.message });
  }

};
