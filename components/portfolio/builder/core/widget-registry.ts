import type { WidgetInstance, WidgetStyle } from "../types"

export type WidgetRegistryItem<T = any> = {
  type: string
  defaultContent: () => T
  defaultStyle?: () => WidgetStyle
  displayName: string
}

// Generate stable ID for widget items
export function generateItemId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const widgetRegistry: Record<string, WidgetRegistryItem> = {
  identity: {
    type: "identity",
    displayName: "Identity",
    defaultContent: () => ({}),
  },
  education: {
    type: "education",
    displayName: "Education",
    defaultContent: () => ({
      title: "Education",
      items: [
        {
          id: generateItemId(),
          degree: "Bachelor of Science",
          school: "University Name",
          year: "2020-2024",
          description: "",
          certified: false,
        },
      ],
    }),
  },
  projects: {
    type: "projects",
    displayName: "Projects",
    defaultContent: () => ({
      title: "Projects",
      items: [
        {
          id: generateItemId(),
          name: "Project Name",
          description: "Project description goes here...",
          year: "2024",
          tags: ["React", "TypeScript"],
        },
      ],
    }),
  },
  description: {
    type: "description",
    displayName: "Description",
    defaultContent: () => ({
      title: "About Me",
      description: "Tell your story here...",
      subdescription: "Add more details about yourself...",
    }),
    defaultStyle: () => ({
      bg: "bg-[#1a1a1a]",
    }),
  },
  services: {
    type: "services",
    displayName: "Services",
    defaultContent: () => ({
      title: "Services",
      description: "Describe the services you offer...",
      items: [],
    }),
  },
  gallery: {
    type: "gallery",
    displayName: "Gallery",
    defaultContent: () => ({
      title: "Gallery",
      groups: [],
    }),
  },
  startup: {
    type: "startup",
    displayName: "Startup",
    defaultContent: () => ({
      title: "Startup",
      description: "Describe your startup...",
    }),
  },
  "meeting-scheduler": {
    type: "meeting-scheduler",
    displayName: "Meeting Scheduler",
    defaultContent: () => ({
      mode: "button",
      calendlyUrl: "",
    }),
  },
  image: {
    type: "image",
    displayName: "Image",
    defaultContent: () => ({
      url: "",
      caption: "",
    }),
  },
  "task-manager": {
    type: "task-manager",
    displayName: "Task Manager",
    defaultContent: () => ({
      title: "Your Projects",
      projects: [
        {
          id: generateItemId(),
          name: "Sample Project",
          cover: { kind: "gradient", gradient: "from-sky-500/40 to-indigo-600/60" },
          tasks: [
            {
              id: generateItemId(),
              title: "Example Task",
              description: "This is an example task",
              due: "today",
              done: false,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
    }),
  },
}

export function createWidgetInstance(type: string): WidgetInstance {
  const registryItem = widgetRegistry[type]

  if (!registryItem) {
    throw new Error(`Unknown widget type: ${type}`)
  }

  const widgetId =
    type === "identity"
      ? "identity"
      : typeof crypto !== "undefined" && crypto.randomUUID
        ? `${type}-${crypto.randomUUID()}`
        : `${type}-${Date.now()}`

  return {
    id: widgetId,
    type,
    enabled: true,
    content: registryItem.defaultContent(),
    style: registryItem.defaultStyle?.(),
  }
}

// Migration helper: convert legacy WidgetDef to WidgetInstance
export function migrateWidgetDef(
  def: { id: string; type: string },
  existingContent?: any,
  existingStyle?: WidgetStyle,
): WidgetInstance {
  const registryItem = widgetRegistry[def.type]

  return {
    id: def.id,
    type: def.type,
    enabled: true,
    content: existingContent ?? registryItem?.defaultContent() ?? {},
    style: existingStyle ?? registryItem?.defaultStyle?.(),
  }
}
