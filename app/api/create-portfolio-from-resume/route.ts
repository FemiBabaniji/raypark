import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type ParsedResume = {
  personalInfo: {
    name: string
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    website?: string
    summary?: string
  }
  experience?: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description?: string
    achievements?: string[]
  }>
  education?: Array<{
    institution: string
    degree: string
    field?: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills?: {
    technical?: string[]
    soft?: string[]
    languages?: string[]
  }
  projects?: Array<{
    name: string
    description: string
    technologies?: string[]
    link?: string
  }>
  certifications?: string[]
  awards?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { parsedData, userId }: { parsedData: ParsedResume; userId: string } = await request.json()

    console.log("[v0] ========== PORTFOLIO CREATION STARTED ==========")
    console.log("[v0] 👤 User ID:", userId)
    console.log("[v0] 📊 Parsed data received:", JSON.stringify(parsedData, null, 2))

    if (!parsedData || !userId) {
      console.log("[v0] ❌ Missing required data")
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()

    if (existingPortfolio) {
      console.log("[v0] ⚠️ User already has portfolio:", existingPortfolio.id)
      return NextResponse.json({
        success: true,
        portfolioId: existingPortfolio.id,
        message: "Using existing portfolio",
      })
    }

    const portfolioName = parsedData.personalInfo.name || "My Portfolio"
    const slug = portfolioName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    console.log("[v0] 📝 Creating portfolio with name:", portfolioName, "slug:", slug)

    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .insert({
        user_id: userId,
        name: portfolioName,
        slug: slug,
        description: parsedData.personalInfo.summary || `${portfolioName}'s professional portfolio`,
        is_public: false,
        is_demo: false,
      })
      .select("id")
      .single()

    if (portfolioError) {
      console.error("[v0] ❌ Portfolio creation error:", portfolioError)
      return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
    }

    console.log("[v0] ✅ Portfolio created:", portfolio.id)

    const { data: existingPage } = await supabase
      .from("pages")
      .select("id")
      .eq("portfolio_id", portfolio.id)
      .eq("route", "/")
      .maybeSingle()

    let pageId: string

    if (existingPage) {
      console.log("[v0] ⚠️ Page already exists, using:", existingPage.id)
      pageId = existingPage.id
    } else {
      const { data: page, error: pageError } = await supabase
        .from("pages")
        .insert({
          portfolio_id: portfolio.id,
          route: "/",
        })
        .select("id")
        .single()

      if (pageError) {
        console.error("[v0] ❌ Page creation error:", pageError)
        return NextResponse.json({ error: `Failed to create page: ${pageError.message}` }, { status: 500 })
      }

      console.log("[v0] ✅ Page created:", page.id)
      pageId = page.id
    }

    const leftWidgets = ["identity", "education"]
    const rightWidgets = ["description", "projects", "services", "meeting-scheduler"]

    console.log("[v0] 📐 Creating layout with widgets:", { left: leftWidgets, right: rightWidgets })

    const { error: layoutError } = await supabase.from("page_layouts").upsert({
      page_id: pageId,
      layout: {
        left: { type: "vertical", widgets: leftWidgets },
        right: { type: "vertical", widgets: rightWidgets },
      },
    })

    if (layoutError) {
      console.error("[v0] ❌ Layout creation error:", layoutError)
      return NextResponse.json({ error: `Failed to create layout: ${layoutError.message}` }, { status: 500 })
    }

    console.log("[v0] ✅ Layout created for page:", pageId)

    const widgetInstances = []

    console.log("[v0] 🎨 Creating identity widget with data:", parsedData.personalInfo)
    widgetInstances.push({
      page_id: pageId,
      key: "identity",
      props: {
        name: parsedData.personalInfo.name,
        handle:
          parsedData.personalInfo.email?.split("@")[0] ||
          parsedData.personalInfo.name.toLowerCase().replace(/\s+/g, ""),
        title: parsedData.experience?.[0]?.position || "Professional",
        bio: parsedData.personalInfo.summary || "",
        email: parsedData.personalInfo.email || "",
        location: parsedData.personalInfo.location || "",
        linkedin: parsedData.personalInfo.linkedin || "",
        github: parsedData.personalInfo.github || "",
        website: parsedData.personalInfo.website || "",
        selectedColor: 5,
      },
    })

    if (parsedData.education && parsedData.education.length > 0) {
      console.log("[v0] 🎓 Creating education widget with", parsedData.education.length, "items")
      widgetInstances.push({
        page_id: pageId,
        key: "education",
        props: {
          title: "Education",
          items: parsedData.education.map((edu) => ({
            degree: `${edu.degree}${edu.field ? " in " + edu.field : ""}`,
            school: edu.institution,
            year: `${edu.startDate}-${edu.endDate}`,
            description: edu.gpa ? `GPA: ${edu.gpa}` : "",
          })),
        },
      })
    }

    console.log("[v0] 📄 Creating description widget")
    widgetInstances.push({
      page_id: pageId,
      key: "description",
      props: {
        title: "About Me",
        content: parsedData.personalInfo.summary || "Professional with diverse experience and skills.",
      },
    })

    if (parsedData.projects && parsedData.projects.length > 0) {
      console.log("[v0] 🚀 Creating projects widget with", parsedData.projects.length, "projects")
      widgetInstances.push({
        page_id: pageId,
        key: "projects",
        props: {
          title: "Featured Projects",
          items: parsedData.projects.map((proj) => ({
            name: proj.name,
            description: proj.description,
            year: new Date().getFullYear().toString(),
            tags: proj.technologies || [],
            link: proj.link || "",
          })),
        },
      })
    }

    if (parsedData.skills) {
      const allSkills = [...(parsedData.skills.technical || []), ...(parsedData.skills.soft || [])]
      console.log("[v0] 💼 Creating skills widget with", allSkills.length, "skills")

      widgetInstances.push({
        page_id: pageId,
        key: "services",
        props: {
          title: "Skills",
          items: allSkills.slice(0, 8),
        },
      })
    }

    console.log("[v0] 📅 Creating meeting scheduler widget")
    widgetInstances.push({
      page_id: pageId,
      key: "meeting-scheduler",
      props: {
        selectedColor: 5,
      },
    })

    console.log("[v0] 💾 Inserting", widgetInstances.length, "widget instances")

    const { error: widgetError } = await supabase.from("widget_instances").upsert(widgetInstances, {
      onConflict: "page_id,key",
    })

    if (widgetError) {
      console.error("[v0] ❌ Widget creation error:", widgetError)
      return NextResponse.json({ error: `Failed to create widgets: ${widgetError.message}` }, { status: 500 })
    }

    console.log("[v0] ✅ All widgets created successfully")
    console.log("[v0] ========== PORTFOLIO CREATION COMPLETE ==========")
    console.log("[v0] 🎉 Portfolio ID:", portfolio.id)

    return NextResponse.json({
      success: true,
      portfolioId: portfolio.id,
    })
  } catch (error: any) {
    console.error("[v0] ❌ Portfolio creation error:", error)
    console.error("[v0] Error stack:", error.stack)
    return NextResponse.json({ error: error.message || "Failed to create portfolio" }, { status: 500 })
  }
}
