export type UserSchool = {
  universityId: string;
  universityName: string;
};

type UserWithMeta = {
  unsafeMetadata?: unknown;
} | null;

export function getUserSchool(user: UserWithMeta): UserSchool | null {
  if (!user?.unsafeMetadata || typeof user.unsafeMetadata !== "object") {
    return null;
  }
  const m = user.unsafeMetadata as Record<string, unknown>;
  const universityId = m.universityId;
  const universityName = m.universityName;
  if (typeof universityId !== "string" || universityId.length === 0) {
    return null;
  }
  if (typeof universityName !== "string" || universityName.length === 0) {
    return null;
  }
  return { universityId, universityName };
}
