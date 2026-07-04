// Core symptoms shown as one-tap cards on the log screen.
export const GRID_SYMPTOMS = ['Pain', 'Fatigue', 'Nausea', 'Headache'];

// Explicit colors for the most common cancer-recovery symptoms.
const EXPLICIT_COLORS = {
  Pain: '#cc6a44',
  Fatigue: '#c98a3e',
  Nausea: '#5a8f6f',
  Headache: '#8a6db0',
  Dizziness: '#4a86b0',
};

// A wider library so search suggests real chemo-recovery clusters, not just
// the four grid symptoms (nausea variants, neuropathy, taste/mood changes...).
export const SYMPTOM_LIBRARY = [
  'Pain',
  'Fatigue',
  'Nausea',
  'Headache',
  'Dizziness',
  'Vomiting',
  'Shortness of breath',
  'Fever',
  'Chills',
  'Night sweats',
  'Appetite loss',
  'Weight loss',
  'Numbness',
  'Neuropathy (tingling in hands/feet)',
  'Rash',
  'Bruising easily',
  'Insomnia',
  'Anxiety',
  'Low mood',
  'Brain fog',
  'Constipation',
  'Diarrhoea',
  'Mouth sores',
  'Dry mouth',
  'Taste changes',
  'Hair loss',
  'Swelling',
  'Joint pain',
  'Muscle weakness',
  'Cough',
];

// Small curated accent palette (teal-family neighbors) for symptoms outside
// the explicit map, assigned deterministically so a symptom always keeps its color.
const PALETTE = ['#4a86b0', '#8a6db0', '#b0724a', '#4a9ab0', '#9a7dc9', '#6a9e5a', '#c46a8a', '#7a8fc9'];

export function symbolColor(name) {
  if (EXPLICIT_COLORS[name]) return EXPLICIT_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export const DEFAULT_TREATMENTS = ['Chemotherapy', 'Anti-sickness meds', 'Radiotherapy', 'Immunotherapy', 'Hormone therapy'];

export const DEFAULT_APPT_TYPES = ['Scan review', 'Consultation', 'Treatment', 'Blood work'];
