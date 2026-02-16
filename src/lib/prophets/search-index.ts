import type { ProphetStory } from "./types"

export function buildProphetIndex(data: ProphetStory[]) {
  return data.map((p) => ({
    id: p.id,
    text: (
      p.name +
      " " +
      p.title +
      " " +
      p.summary +
      " " +
      p.story.join(" ")
    ).toLowerCase(),
  }))
}
