import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "blackboard";

if (!mongoUri) {
  console.error("Missing MONGODB_URI in environment.");
  process.exit(1);
}

const seedBoards = [
  {
    id: "purdue-academic-success-center",
    schoolId: "purdue",
    title: "Will the academic success center open by April 2027?",
    school: "Purdue",
    yesPct: 58,
    volumeLabel: "$1.2k",
    closesIn: "Resolves Apr 2027",
  },
  {
    id: "purdue-physics-172-average",
    schoolId: "purdue",
    title: "Will the average on the physics172 exam be over 70%?",
    school: "Purdue",
    yesPct: 44,
    volumeLabel: "$890",
    closesIn: "Closes after exam",
  },
  {
    id: "purdue-evelyn-hack-indy",
    schoolId: "purdue",
    title: "Will Evelyn win Hack Indy?",
    school: "Purdue",
    yesPct: 67,
    volumeLabel: "$2.4k",
    closesIn: "Closes post-event",
  },
  {
    id: "purdue-basketball-sweet-16",
    schoolId: "purdue",
    title: "Will Purdue men’s basketball reach the Sweet 16 this season?",
    school: "Purdue",
    yesPct: 63,
    volumeLabel: "$2.0k",
    closesIn: "Resolves this postseason",
  },
  {
    id: "purdue-dining-new-hall",
    schoolId: "purdue",
    title: "Will Purdue open a new dining hall before fall semester starts?",
    school: "Purdue",
    yesPct: 41,
    volumeLabel: "$730",
    closesIn: "Closes in 95d",
  },
  {
    id: "purdue-cs-over-enrollment",
    schoolId: "purdue",
    title: "Will Purdue CS enrollment exceed 5,500 students next year?",
    school: "Purdue",
    yesPct: 72,
    volumeLabel: "$1.6k",
    closesIn: "Resolves next academic year",
  },
  {
    id: "purdue-finals-snow-day",
    schoolId: "purdue",
    title: "Will finals week include at least one campus-wide snow day alert?",
    school: "Purdue",
    yesPct: 29,
    volumeLabel: "$540",
    closesIn: "Closes in 70d",
  },
  {
    id: "purdue-football-bowl",
    schoolId: "purdue",
    title: "Will Purdue football become bowl-eligible this season?",
    school: "Purdue",
    yesPct: 57,
    volumeLabel: "$1.9k",
    closesIn: "Resolves end of regular season",
  },
  {
    id: "purdue-ai-center-grants",
    schoolId: "purdue",
    title: "Will Purdue’s AI center announce over $10M in new grants this year?",
    school: "Purdue",
    yesPct: 46,
    volumeLabel: "$1.1k",
    closesIn: "Closes in 150d",
  },
  {
    id: "purdue-housing-waitlist",
    schoolId: "purdue",
    title: "Will on-campus housing waitlist exceed 1,000 students this fall?",
    school: "Purdue",
    yesPct: 68,
    volumeLabel: "$880",
    closesIn: "Resolves in 120d",
  },
  {
    id: "purdue-rocket-launch-team",
    schoolId: "purdue",
    title: "Will the Purdue student rocket team place top 3 nationally?",
    school: "Purdue",
    yesPct: 52,
    volumeLabel: "$490",
    closesIn: "Closes post-competition",
  },
  {
    id: "purdue-transit-late-night",
    schoolId: "purdue",
    title: "Will late-night campus transit expand to weekends this year?",
    school: "Purdue",
    yesPct: 36,
    volumeLabel: "$650",
    closesIn: "Closes in 140d",
  },
  {
    id: "purdue-hackathon-5k",
    schoolId: "purdue",
    title: "Will Purdue host a hackathon with 5,000+ total registrants this year?",
    school: "Purdue",
    yesPct: 24,
    volumeLabel: "$2.8k",
    closesIn: "Closes after event",
  },
  {
    id: "purdue-startup-funding",
    schoolId: "purdue",
    title: "Will a Purdue student startup raise a $5M+ round before year end?",
    school: "Purdue",
    yesPct: 39,
    volumeLabel: "$1.3k",
    closesIn: "Closes in 210d",
  },
  {
    id: "purdue-library-24-7",
    schoolId: "purdue",
    title: "Will at least one Purdue library run 24/7 during finals week?",
    school: "Purdue",
    yesPct: 84,
    volumeLabel: "$970",
    closesIn: "Closes in 65d",
  },
  {
    id: "purdue-pete-fountain-100",
    schoolId: "purdue",
    title: "Will Purdue Pete Fountain Run raise over $100,000 this year?",
    school: "Purdue",
    yesPct: 62,
    volumeLabel: "$1.4k",
    closesIn: "Closes after race day",
  },
  {
    id: "purdue-grand-prix-weather-delay",
    schoolId: "purdue",
    title: "Will the Purdue Grand Prix have a weather delay this year?",
    school: "Purdue",
    yesPct: 33,
    volumeLabel: "$760",
    closesIn: "Resolves race weekend",
  },
  {
    id: "purdue-engineering-fair-recruiters",
    schoolId: "purdue",
    title: "Will the Purdue engineering career fair host 450+ recruiters this fall?",
    school: "Purdue",
    yesPct: 47,
    volumeLabel: "$1.1k",
    closesIn: "Closes in 130d",
  },
  {
    id: "purdue-cs-180-midterm-average",
    schoolId: "purdue",
    title: "Will the Purdue CS 180 midterm average exceed 75% this semester?",
    school: "Purdue",
    yesPct: 54,
    volumeLabel: "$920",
    closesIn: "Closes after exam",
  },
  {
    id: "purdue-bell-tower-lights",
    schoolId: "purdue",
    title: "Will the Bell Tower be lit gold for 10+ nights during finals season?",
    school: "Purdue",
    yesPct: 41,
    volumeLabel: "$580",
    closesIn: "Closes in 75d",
  },
  {
    id: "purdue-otc-bus-frequency",
    schoolId: "purdue",
    title: "Will buses between Purdue and the airport run every hour by year end?",
    school: "Purdue",
    yesPct: 28,
    volumeLabel: "$640",
    closesIn: "Closes in 240d",
  },
  {
    id: "purdue-cary-quad-renovation-phase",
    schoolId: "purdue",
    title: "Will the next Cary Quad renovation phase finish before move-in day?",
    school: "Purdue",
    yesPct: 49,
    volumeLabel: "$870",
    closesIn: "Resolves before fall move-in",
  },
  {
    id: "purdue-robotics-worlds-top10",
    schoolId: "purdue",
    title: "Will a Purdue robotics team finish top 10 at worlds this year?",
    school: "Purdue",
    yesPct: 56,
    volumeLabel: "$1.5k",
    closesIn: "Closes after championship",
  },
];

const now = new Date();

async function run() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  try {
    const db = client.db(dbName);
    const boards = db.collection("boards");
    const cleanupResult = await boards.deleteMany({ schoolId: { $ne: "purdue" } });

    let upserts = 0;
    for (const board of seedBoards) {
      const result = await boards.updateOne(
        { id: board.id },
        {
          $set: {
            ...board,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true },
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        upserts += 1;
      }
    }

    console.log(
      `Seed complete. Processed ${seedBoards.length} boards, changed ${upserts}, removed ${cleanupResult.deletedCount} non-Purdue boards.`,
    );
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
