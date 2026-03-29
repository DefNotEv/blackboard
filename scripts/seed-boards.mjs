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
    id: "michigan-big-house",
    schoolId: "michigan",
    title: "Will Michigan football sell out every home game at the Big House?",
    school: "Michigan",
    yesPct: 90,
    volumeLabel: "$540",
    closesIn: "Closes in 9d",
  },
  {
    id: "michigan-nfl-draft",
    schoolId: "michigan",
    title: "Will a Michigan player go in the first round of the next NFL draft?",
    school: "Michigan",
    yesPct: 22,
    volumeLabel: "$310",
    closesIn: "Closes in 45d",
  },
  {
    id: "uiuc-hackathon",
    schoolId: "uiuc",
    title: "Will UIUC host a campus-wide hackathon with 500+ registrants this fall?",
    school: "UIUC",
    yesPct: 91,
    volumeLabel: "$3.1k",
    closesIn: "Closes in 2d",
  },
  {
    id: "uiuc-parking",
    schoolId: "uiuc",
    title: "Will the new parking deck near Grainger open before spring semester?",
    school: "UIUC",
    yesPct: 55,
    volumeLabel: "$780",
    closesIn: "Closes in 18d",
  },
  {
    id: "uw-rowing",
    schoolId: "uw-madison",
    title: "Will Wisconsin win the Big Ten rowing championship?",
    school: "UW–Madison",
    yesPct: 48,
    volumeLabel: "$420",
    closesIn: "Closes in 12d",
  },
  {
    id: "osu-library",
    schoolId: "ohio-state",
    title: "Will Thompson Library extend overnight hours during finals week?",
    school: "Ohio State",
    yesPct: 77,
    volumeLabel: "$610",
    closesIn: "Closes in 8d",
  },
  {
    id: "northwestern-dillo-day",
    schoolId: "northwestern",
    title: "Will Dillo Day’s headliner be announced before May 1?",
    school: "Northwestern",
    yesPct: 34,
    volumeLabel: "$950",
    closesIn: "Closes in 14d",
  },
  {
    id: "minnesota-esports",
    schoolId: "minnesota",
    title: "Will Minnesota field a varsity League of Legends team next year?",
    school: "Minnesota",
    yesPct: 61,
    volumeLabel: "$275",
    closesIn: "Closes in 30d",
  },
  {
    id: "indiana-solar",
    schoolId: "indiana",
    title: "Will the new campus solar farm cover 20% of IU’s electricity?",
    school: "Indiana",
    yesPct: 52,
    volumeLabel: "$1.8k",
    closesIn: "Closes in 60d",
  },
];

const now = new Date();

async function run() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  try {
    const db = client.db(dbName);
    const boards = db.collection("boards");

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
      `Seed complete. Processed ${seedBoards.length} boards, changed ${upserts}.`,
    );
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
