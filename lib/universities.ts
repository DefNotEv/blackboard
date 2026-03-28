export type University = {
  id: string;
  name: string;
  shortName: string;
};

/** Big Midwest schools — extend or replace with search + your DB later. */
export const UNIVERSITIES: University[] = [
  { id: "case-western", name: "Case Western Reserve University", shortName: "Case Western" },
  { id: "cincinnati", name: "University of Cincinnati", shortName: "Cincinnati" },
  { id: "indiana", name: "Indiana University Bloomington", shortName: "Indiana" },
  { id: "iowa", name: "University of Iowa", shortName: "Iowa" },
  { id: "iowa-state", name: "Iowa State University", shortName: "Iowa State" },
  { id: "ku", name: "University of Kansas", shortName: "Kansas" },
  { id: "kstate", name: "Kansas State University", shortName: "K-State" },
  { id: "loyola-chicago", name: "Loyola University Chicago", shortName: "Loyola Chicago" },
  { id: "marquette", name: "Marquette University", shortName: "Marquette" },
  { id: "michigan", name: "University of Michigan", shortName: "Michigan" },
  { id: "msu", name: "Michigan State University", shortName: "Michigan State" },
  { id: "minnesota", name: "University of Minnesota Twin Cities", shortName: "Minnesota" },
  { id: "mizzou", name: "University of Missouri", shortName: "Mizzou" },
  { id: "nebraska", name: "University of Nebraska–Lincoln", shortName: "Nebraska" },
  { id: "northwestern", name: "Northwestern University", shortName: "Northwestern" },
  { id: "notre-dame", name: "University of Notre Dame", shortName: "Notre Dame" },
  { id: "ohio-state", name: "The Ohio State University", shortName: "Ohio State" },
  { id: "purdue", name: "Purdue University", shortName: "Purdue" },
  { id: "uic", name: "University of Illinois Chicago", shortName: "UIC" },
  { id: "uiuc", name: "University of Illinois Urbana–Champaign", shortName: "UIUC" },
  { id: "uchicago", name: "University of Chicago", shortName: "UChicago" },
  { id: "uw-madison", name: "University of Wisconsin–Madison", shortName: "UW–Madison" },
].sort((a, b) => a.name.localeCompare(b.name));

export function getUniversityById(id: string): University | undefined {
  return UNIVERSITIES.find((u) => u.id === id);
}
