import type { PageLayout, ColumnLayout, WidgetDef } from "@/components/portfolio/builder/types"

export function migrateLegacyLayout(legacyLayout: { left: string[]; right: string[] }): PageLayout {
  return {
    left: {
      type: "vertical",
      widgets: legacyLayout.left || [],
    },
    right: {
      type: "vertical",
      widgets: legacyLayout.right || [],
    },
  }
}

export function widgetsToLayout(widgets: WidgetDef[], layoutType: "vertical" | "grid" = "vertical"): ColumnLayout {
  if (layoutType === "vertical") {
    return {
      type: "vertical",
      widgets: widgets.map((w) => w.id),
    }
  }

  // Grid layout with auto-positioning (2 columns)
  return {
    type: "grid",
    columns: 2,
    gap: 4,
    widgets: widgets.map((w, index) => ({
      id: w.id,
      row: Math.floor(index / 2),
      col: index % 2,
      rowSpan: 1,
      colSpan: 1,
    })),
  }
}

export function getWidgetIdsFromLayout(layout: ColumnLayout): string[] {
  if (layout.type === "vertical") {
    return layout.widgets
  }

  return layout.widgets.map((w) => w.id)
}

export function updateWidgetPosition(
  layout: ColumnLayout,
  widgetId: string,
  position: { row: number; col: number; rowSpan?: number; colSpan?: number },
): ColumnLayout {
  if (layout.type !== "grid") {
    console.warn("Cannot update position in non-grid layout")
    return layout
  }

  return {
    ...layout,
    widgets: layout.widgets.map((w) =>
      w.id === widgetId
        ? {
            ...w,
            row: position.row,
            col: position.col,
            rowSpan: position.rowSpan ?? w.rowSpan,
            colSpan: position.colSpan ?? w.colSpan,
          }
        : w,
    ),
  }
}

export function convertLayoutType(layout: ColumnLayout, targetType: "vertical" | "grid"): ColumnLayout {
  if (layout.type === targetType) {
    return layout
  }

  if (targetType === "vertical") {
    // Convert grid to vertical
    const sortedWidgets =
      layout.type === "grid"
        ? layout.widgets
            .sort((a, b) => {
              if (a.row !== b.row) return a.row - b.row
              return a.col - b.col
            })
            .map((w) => w.id)
        : []

    return {
      type: "vertical",
      widgets: sortedWidgets,
    }
  }

  // Convert vertical to grid (2 columns)
  const widgets = layout.type === "vertical" ? layout.widgets : []
  return {
    type: "grid",
    columns: 2,
    gap: 4,
    widgets: widgets.map((id, index) => ({
      id,
      row: Math.floor(index / 2),
      col: index % 2,
      rowSpan: 1,
      colSpan: 1,
    })),
  }
}

export function getGridClasses(widget: { row: number; col: number; rowSpan: number; colSpan: number }): string {
  return [
    `col-start-${widget.col + 1}`,
    `col-span-${widget.colSpan}`,
    `row-start-${widget.row + 1}`,
    `row-span-${widget.rowSpan}`,
  ].join(" ")
}
