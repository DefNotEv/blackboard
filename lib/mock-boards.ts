import type { BoardPreview } from "@/components/dashboard/board-card";

export const MOCK_BOARDS: BoardPreview[] = [
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

export function getBoardsForSchool(schoolId: string): BoardPreview[] {
  return MOCK_BOARDS.filter((b) => b.schoolId === schoolId);
}

export function getBoardById(id: string): BoardPreview | undefined {
  return MOCK_BOARDS.find((b) => b.id === id);
}
