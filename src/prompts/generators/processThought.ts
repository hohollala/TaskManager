import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";

export interface ProcessThoughtPromptParams {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
  stage: string;
  tags: string[];
  axioms_used: string[];
  assumptions_challenged: string[];
}

export async function getProcessThoughtPrompt(
  param: ProcessThoughtPromptParams
): Promise<string> {
  let nextThoughtNeeded = "";
  if (param.nextThoughtNeeded) {
    nextThoughtNeeded = await loadPromptFromTemplate(
      "processThought/moreThought.md"
    );
  } else {
    nextThoughtNeeded = await loadPromptFromTemplate(
      "processThought/complatedThought.md"
    );
  }

  const indexTemplate = await loadPromptFromTemplate("processThought/index.md");

  const prompt = generatePrompt(indexTemplate, {
    thought: param.thought,
    thoughtNumber: param.thoughtNumber,
    totalThoughts: param.totalThoughts,
    stage: param.stage,
    tags: param.tags.join(", ") || "태그 없음",
    axioms_used: param.axioms_used.join(", ") || "사용된 공리 없음",
    assumptions_challenged:
      param.assumptions_challenged.join(", ") || "도전받은 가정 없음",
    nextThoughtNeeded,
  });

  return loadPrompt(prompt, "PROCESS_THOUGHT");
}
