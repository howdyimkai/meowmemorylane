interface MessageInput {
  catName: string;
  toyType: string;
  memory: string;
}

const getToyDescription = (toyType: string) => {
  const descriptions: Record<string, string> = {
    yarn: "playing with their favorite blue yarn ball",
    laser: "chasing the mysterious red dot around",
    mouse: "batting around their squeaky mouse toy",
    treats: "enjoying some tasty treats",
    cattree: "relaxing in their cozy cat tree"
  };
  return descriptions[toyType] || "playing with their favorite toy";
};

export const generateFirstMessage = ({ catName, toyType, memory }: MessageInput): string => {
  const toyActivity = getToyDescription(toyType);
  
  return `Dear friend,

I've settled into my new home on Meow Memory Lane! The Victorian mansion is beautiful, with lots of sunny spots for napping and tall windows for bird watching. Today I spent some time ${toyActivity}, which reminded me of our special times together.

I wanted to share that memory of when ${memory}. Those moments will always be precious to me.

I'm making new friends here but will never forget you. I'll write again soon to tell you about my adventures!

Purrs and headbutts,
${catName}`;
};

export const generateSubjectLine = (catName: string): string => {
  const subjects = [
    `A letter from ${catName} in their furever home`,
    `${catName}'s first update from Meow Memory Lane`,
    `Greetings from ${catName}!`,
    `${catName} is settling in nicely`
  ];
  return subjects[Math.floor(Math.random() * subjects.length)];
};