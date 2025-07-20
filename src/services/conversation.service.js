
import { simulateLatency } from '../utils/latency.js';
import { QUESTIONS, FIRST_ANSWERS, SECOND_ANSWERS, THIRD_ANSWERS, STRINGS } from '../utils/constants.js';


export function getInitialMessage(student) {
  console.log(`Starting conversation with ${student.name}. Sending initial message: ${QUESTIONS[0]}`);
  return STRINGS.initial(student.name);
}


export function getNextQuestion(step) {
  return QUESTIONS[step] || null;
}

export async function handleConversationReply(state, text) {
  await simulateLatency();
  let { step, preferences } = state;
  const answer = text.trim().toLowerCase();

  switch (step) {
    // Job type or "I don't know yet"
    case 0: {
      if (!FIRST_ANSWERS.includes(answer)) {
        return { message: STRINGS.invalidJobType, nextStep: 0, preferences, done: false };
      }

      // If "I don't know yet", skip to area of study
      if (answer.toLowerCase() === FIRST_ANSWERS[2].trim().toLowerCase()) {
        return { message: getNextQuestion(2), nextStep: 2, preferences, done: false };
      }
      preferences.type = answer;
      return { message: getNextQuestion(1), nextStep: 1, preferences, done: false };
    }
    // Work model (remote/on-site)
    case 1: {
      if (!SECOND_ANSWERS.includes(answer)) {
        return { message: STRINGS.invalidWorkModel, nextStep: 1, preferences, done: false };
      }
      preferences.model = answer;
      return { message: getNextQuestion(2), nextStep: 2, preferences, done: false };
    }
    // Area of study
    case 2: {
      if (!THIRD_ANSWERS.includes(answer)) {
        return { message: STRINGS.invalidArea, nextStep: 2, preferences, done: false };
      }
      preferences.area = answer;
      if (!preferences.type || !preferences.model) {
        return { message: STRINGS.recommend, nextStep: 3, preferences, done: true };
      }
      return { message: STRINGS.thanks, nextStep: 3, preferences, done: true };
    }
    default:
      return { message: STRINGS.finished, nextStep: step, preferences, done: true };
  }
}

export async function getJobMatches(preferences, jobs) {
  await simulateLatency();
  // If no preferences, return all jobs
  if (!preferences.type || !preferences.model) {
    return jobs.filter(job => job.area === preferences.area);
  }
  // If all preferences are set, filter by all three fields
  return jobs.filter(job => job.type === preferences.type && job.model === preferences.model && job.area === preferences.area);
}
