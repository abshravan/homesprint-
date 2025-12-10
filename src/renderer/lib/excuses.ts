export const EXCUSES = [
    "I'm waiting for the upstream dependency (my motivation) to resolve.",
    "It works on my machine (in my dreams).",
    "I need to refactor the garage before I can clean it.",
    "The sun was in my eyes.",
    "I'm currently blocked by a lack of caffeine.",
    "I thought you said you wanted it done 'eventually'.",
    "I'm compiling my thoughts.",
    "There was a merge conflict with my nap schedule.",
    "I'm waiting for approval from the committee (the cat).",
    "It's a feature, not a bug.",
    "I'm optimizing for laziness.",
    "The documentation was unclear.",
    "I was busy updating the Jira ticket.",
    "I need to attend a meeting about why this isn't done.",
    "Cosmic rays flipped a bit in my brain.",
    "I'm strictly following the 'fail fast' methodology.",
    "I'm conducting A/B testing on doing nothing vs. doing something.",
    "I'm waiting for the next sprint.",
    "It's on the roadmap for Q4.",
    "I'm experiencing technical difficulties with my willpower."
];

export const generateExcuse = (): string => {
    const randomIndex = Math.floor(Math.random() * EXCUSES.length);
    return EXCUSES[randomIndex];
};
