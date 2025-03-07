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

/**
 * Generate the first welcome message for a new user
 */
export const generateFirstMessage = ({ catName, toyType, memory }: MessageInput): string => {
  const toyActivity = getToyDescription(toyType);
  
  return `Dear friend,

I've settled into my new home on Meow Memory Lane! The Victorian mansion is beautiful, with lots of sunny spots for napping and tall windows for bird watching. Today I spent some time ${toyActivity}, which reminded me of our special times together.

I wanted to share that memory of when ${memory}. Those moments will always be precious to me.

I'm making new friends here but will never forget you. I'll write again soon to tell you about my adventures!

Purrs and headbutts,
${catName}`;
};

/**
 * Generate a monthly update message
 */
export const generateMonthlyUpdate = ({ catName, toyType, memory }: MessageInput): string => {
  // Define possible activities for the cat
  const activities = [
    `made friends with a neighborhood squirrel who visits the window daily`,
    `discovered a perfect sunbeam spot in the library that appears at exactly 2pm`,
    `helped the neighborhood birds build their nests by watching very carefully`,
    `learned to open the treat cabinet and have been enjoying midnight snacks`,
    `claimed the softest armchair in the house as my exclusive napping throne`
  ];
  
  // Select a random activity
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const toyActivity = getToyDescription(toyType);
  
  return `Dear friend,

I hope this letter finds you well! Life on Meow Memory Lane continues to be wonderful. This month, I ${randomActivity}.

I've also spent lots of time ${toyActivity}. It always makes me think of you and the time when ${memory}.

The other cats in the neighborhood have been hosting garden parties, and I've become quite the social butterfly. But no matter how many new friends I make, you'll always be special to me.

Sending whisker kisses your way,
${catName}`;
};

/**
 * Generate a seasonal or holiday-themed update
 */
export const generateSeasonalUpdate = ({ catName, toyType, memory, season = 'spring' }: MessageInput & { season?: string }): string => {
  // Seasonal themes
  const seasonalThemes: Record<string, { activity: string, scenery: string }> = {
    spring: {
      activity: "chasing butterflies in the garden",
      scenery: "The flowers are blooming and the birds are singing"
    },
    summer: {
      activity: "napping in the cool shade of the big oak tree",
      scenery: "The days are long and warm, perfect for sunbathing in the windows"
    },
    fall: {
      activity: "playing in the pile of colorful leaves",
      scenery: "The trees are turning beautiful shades of orange and red"
    },
    winter: {
      activity: "curling up by the fireplace",
      scenery: "Snow has blanketed Meow Memory Lane in a peaceful white glow"
    },
    halloween: {
      activity: "watching the neighborhood trick-or-treaters from the window",
      scenery: "The house is decorated with pumpkins and spooky decorations"
    },
    christmas: {
      activity: "batting at ornaments on the Christmas tree",
      scenery: "Meow Memory Lane is decorated with twinkling lights and festive garlands"
    }
  };
  
  const theme = seasonalThemes[season] || seasonalThemes.spring;
  const toyActivity = getToyDescription(toyType);
  
  return `Dear friend,

${theme.scenery} here in my furever home. I've been spending my days ${theme.activity} and, of course, ${toyActivity}.

Every time I ${toyActivity}, I think about our special times together and that wonderful memory of when ${memory}.

Even with all the seasonal excitement, I still find time to look at your photo and remember our wonderful times together.

With love from Meow Memory Lane,
${catName}`;
};

/**
 * Generate an email subject line
 */
export const generateSubjectLine = (catName: string, isFirstMessage = true): string => {
  if (isFirstMessage) {
    const subjects = [
      `A letter from ${catName} in their furever home`,
      `${catName}'s first update from Meow Memory Lane`,
      `Greetings from ${catName}!`,
      `${catName} is settling in nicely`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  } else {
    const subjects = [
      `${catName} has news from Meow Memory Lane`,
      `${catName} misses you and wants to say hello`,
      `A purr-fect update from ${catName}`,
      `${catName}'s latest adventures`,
      `Whiskers and wonders: ${catName}'s latest letter`,
      `Meow from Memory Lane: ${catName} writes again`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }
};

/**
 * Generate themed content based on the current month
 */
export const generateThemeBasedOnDate = (): string => {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  
  // Map months to seasons or holidays
  const themes: Record<number, string> = {
    0: 'winter',       // January
    1: 'winter',       // February
    2: 'spring',       // March
    3: 'spring',       // April
    4: 'spring',       // May
    5: 'summer',       // June
    6: 'summer',       // July
    7: 'summer',       // August
    8: 'fall',         // September
    9: 'fall',         // October
    10: 'fall',        // November
    11: 'winter'       // December
  };
  
  // Override with specific holidays
  if (month === 9) {
    // Check if it's close to Halloween (October)
    const day = currentDate.getDate();
    if (day > 15) {
      return 'halloween';
    }
  } else if (month === 11) {
    // Check if it's close to Christmas (December)
    const day = currentDate.getDate();
    if (day > 5) {
      return 'christmas';
    }
  }
  
  return themes[month] || 'spring';
};