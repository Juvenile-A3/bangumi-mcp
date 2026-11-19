export interface PromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

export interface PromptMessage {
  role: "user" | "assistant";
  content: {
    type: "text";
    text: string;
  };
}

export interface PromptDefinition {
  name: string;
  title: string;
  description: string;
  arguments?: PromptArgument[];
  messages: PromptMessage[];
}

export const promptList: Array<Pick<PromptDefinition, "name" | "title" | "description" | "arguments">> = [
  {
    name: "bangumi-usage",
    title: "Bangumi Usage Hints",
    description: "Short guidance for using this Bangumi MCP.",
  },
];

export const promptMap = new Map<string, PromptDefinition>([
  [
    "bangumi-usage",
    {
      name: "bangumi-usage",
      title: "Bangumi Usage Hints",
      description: "Short guidance for using this Bangumi MCP.",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "This MCP exposes a compact Bangumi surface.",
              "Use search first, then get_subject/get_person/get_character/get_user_profile.",
              "Use get_subject with include=[\"persons\",\"characters\",\"relations\",\"episodes\"] when you need expanded data in one call; use episode_type to filter episodes.",
              "Use browse_subjects to browse the catalog by subject type (1=Book, 2=Anime, 3=Music, 4=Game, 6=Real) with cat/year/month/sort filters.",
              "Use get_user_profile for user profiles and get_user_collections for subject collections; pass subject_type to filter by type, collection_type by status, or subject_id for detailed single collection.",
              "Use get_collections with target_type=person|character for person/character collection lists; pass person_id/character_id for individual lookup.",
              "Use get_episode for episode details (episode_id), single episode collection status (episode_id+collection), or episode collection list (subject_id+collection).",
              "Use get_image with target_type=subject|person|character|user + target_id/username for image URLs.",
              "get_subject/get_person/get_character/get_user_profile/get_user_collections may return partial payloads with _error markers instead of failing the whole request.",
              "Use get_calendar for broadcast schedules.",
              "Keep requests paginated and small.",
            ].join(" "),
          },
        },
      ],
    },
  ],
]);
