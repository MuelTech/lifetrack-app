import { PrismaClient, ArticleCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding health guidance library articles...');

  // Clear existing articles to avoid duplicates on re-seed
  await prisma.article.deleteMany({});

  const articles = [
    {
      title: 'Managing Screen Fatigue During Late Coding Sessions',
      category: ArticleCategory.STRESS_MANAGEMENT,
      preview: 'Practical strategies to protect your eyes and maintain focus when pushing through complex algorithms past midnight.',
      content: `Screen fatigue or digital eye strain is a common issue for students and software developers. When coding late into the night, your eyes are subjected to prolonged blue light exposure and low-contrast text in dark environments.

Here are some practical strategies to protect your eyes:

1. **The 20-20-20 Rule**: Every 20 minutes, take a break to look at something at least 20 feet away for 20 seconds. This relaxes the focusing muscle inside your eyes.
2. **Display Settings**: Keep your workspace illuminated, use night light mode (warm temperature filter) on your screen to reduce blue light, and adjust contrast so text is readable without squinting.
3. **Blink Frequently**: People blink about 50% less when looking at screens, leading to dry eyes. Make a conscious effort to blink.
4. **Distance**: Position your monitor at least 20 inches (an arm's length) away from your eyes, with the top of the screen at or slightly below eye level.`,
      readTime: 5,
      featured: true,
    },
    {
      title: 'Quick Brain Food',
      category: ArticleCategory.NUTRITION,
      preview: "Nutrition-dense snacks that don't require prep time and boost cognitive function.",
      content: `During intensive study or coding sessions, the temptation to reach for sugary snacks, energy drinks, or instant noodles is high. However, these lead to quick blood sugar spikes followed by severe energy crashes.

Instead, fuel your brain with these nutrient-dense foods:

1. **Nuts and Seeds**: Almonds, walnuts, and pumpkin seeds are rich in protein, healthy fats, and vitamin E, which supports cognitive performance.
2. **Blueberries**: High in antioxidants, blueberries have been shown to improve memory and delay brain aging.
3. **Dark Chocolate**: Contains flavonoids and a small amount of caffeine to enhance focus and mood without the jitteriness of coffee.
4. **Water & Herbal Tea**: Hydration is key. Dehydration causes fatigue, headaches, and fogged thinking. Try to keep a bottle next to your desk at all times.`,
      readTime: 3,
      featured: false,
    },
    {
      title: 'Optimizing Power Naps',
      category: ArticleCategory.SLEEP_HYGIENE,
      preview: 'How 20 minutes can reset your debugging capability without entering deep sleep.',
      content: `When a bug has you stuck for hours, a power nap might be exactly what your brain needs to restructure the problem. Power naps are proven to improve learning, memory, and cognitive capacity.

To design the perfect power nap:

1. **Keep it Short**: Limit your nap to 15-20 minutes. Napping longer than 30 minutes can cause sleep inertia—making you feel groggy and more tired than before.
2. **Time it Right**: Nap between 1:00 PM and 3:00 PM. This aligns with the circadian rhythm's natural post-lunch dip in alertness.
3. **Create the Environment**: Find a dark, quiet spot, or use an eye mask and earplugs. Block notifications so you aren't interrupted.
4. **The Caffeine Nap Trick**: Drink a cup of coffee right before you nap. Since caffeine takes about 20-30 minutes to kick in, it will start working just as you wake up, double-boosting your alertness.`,
      readTime: 4,
      featured: false,
    },
    {
      title: 'Recognizing Burnout',
      category: ArticleCategory.EARLY_SIGNS,
      preview: 'Early physiological signs that you need to step away from the keyboard immediately.',
      content: `Academic and professional pressure can easily lead to burnout if ignored. Burnout is not just "feeling tired"—it is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress.

Watch out for these early signs:

1. **Chronic Fatigue**: Feeling exhausted even after sleeping 8 hours or waking up dreading the day ahead.
2. **Cognitive Difficulties**: Finding it hard to concentrate, solve simple problems, or remember things. You might read the same line of code five times without understanding it.
3. **Emotional Detachment**: Feeling cynical about your work, irritable with classmates or peers, and lacking a sense of accomplishment.
4. **Physical Symptoms**: Muscle tension, headaches, stomach issues, and frequent illness due to a weakened immune system.

If you observe these signs, take it seriously. Step away from your desk, set strict boundaries around your screen time, and prioritize physical self-care.`,
      readTime: 6,
      featured: false,
    },
  ];

  for (const article of articles) {
    const created = await prisma.article.create({
      data: article,
    });
    console.log(`Created article: "${created.title}"`);
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
