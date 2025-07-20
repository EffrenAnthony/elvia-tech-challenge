export const QUESTIONS = [
  '¿Qué tipo de trabajo buscas? (full-time/part-time o I don\'t know yet)',
  '¿Prefieres trabajo remoto o presencial? (remote/on-site)',
  '¿Cuál es tu área de estudio? (marketing, diseño, desarrollo, business, etc)',
];


export const FIRST_ANSWERS = ['full-time', 'part-time', "i don't know yet"];
export const SECOND_ANSWERS = ['remote', 'on-site'];
export const THIRD_ANSWERS = ['marketing', 'diseño', 'desarrollo', 'business'];

export const STRINGS = {
  initial: (name) => `¡Hola ${name}! Felicidades por tu graduación 🎓. ¿Listo para encontrar tu próximo trabajo? ${QUESTIONS[0]}`,
  invalidJobType: 'Por favor responde "full-time", "part-time" o "I don\'t know yet".',
  invalidWorkModel: 'Por favor responde "remote" o "on-site".',
  invalidArea: 'Por favor responde con un área válida: marketing, diseño, desarrollo, business.',
  thanks: '¡Gracias! Aquí tienes algunas ofertas que pueden interesarte:',
  recommend: '¡Genial! te recomiendo estos trabajos según tu área de estudio:',
  finished: 'Conversación finalizada.',
  studentNotFound: 'Student not found',
  conversationStarted: 'Conversation started',
  conversationNotStarted: 'Conversation not started',
};
