import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

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
    const {
      parsedData,
      userId,
      mode = "create",
    }: { parsedData: ParsedResume; userId: string; mode?: "create" | "update" } = await request.json()

    console.log("[v0] ========== PORTFOLIO CREATION STARTED ==========")
    console.log("[v0] 🔄 Mode:", mode)
    console.log("[v0] 👤 User ID:", userId)
    console.log("[v0] 📊 Parsed name:", parsedData?.personalInfo?.name)

    if (!parsedData || !userId) {
      console.log("[v0] ❌ Missing required data")
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.getUser()
    console.log("[v0] 🔐 Auth check:", authData?.user?.id || "no user", authError || "no error")

    if (authData?.user?.id !== userId) {
      console.log("[v0] ❌ Auth mismatch: authenticated user", authData?.user?.id, "!== requested user", userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let portfolioId: string | null = null

    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .maybeSingle()

    if (existingPortfolio && mode === "update") {
      portfolioId = existingPortfolio.id
      console.log("[v0] ⚙️ Updating existing portfolio:", portfolioId)
    } else if (existingPortfolio && mode === "create") {
      console.log("[v0] ⚠️ User already has portfolio:", existingPortfolio.id)
      return NextResponse.json({
        success: true,
        portfolioId: existingPortfolio.id,
        message: "Using existing portfolio",
      })
    }

    console.log("[v0] 📋 Fetching widget types...")
    const { data: widgetTypes, error: widgetTypesError } = await supabase.from("widget_types").select("id, key")

    if (widgetTypesError || !widgetTypes) {
      console.error("[v0] ❌ Failed to fetch widget types:", widgetTypesError)
      return NextResponse.json({ error: "Failed to fetch widget types" }, { status: 500 })
    }

    console.log("[v0] ✅ Found", widgetTypes.length, "widget types")

    const widgetTypeMap = new Map<string, string>()
    widgetTypes.forEach((wt) => {
      widgetTypeMap.set(wt.key, wt.id)
      console.log(`[v0]   - ${wt.key}: ${wt.id}`)
    })

    const portfolioName = parsedData.personalInfo.name || "My Portfolio"
    const slug = portfolioName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    if (!portfolioId) {
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
        console.error("[v0] ❌ Error code:", portfolioError.code)
        console.error("[v0] ❌ Error message:", portfolioError.message)
        console.error("[v0] ❌ Error details:", JSON.stringify(portfolioError, null, 2))
        return NextResponse.json({ error: "Failed to create portfolio: " + portfolioError.message }, { status: 500 })
      }

      portfolioId = portfolio.id
      console.log("[v0] ✅ Portfolio created:", portfolioId)
    }

    try {
      let pageId: string | null = null

      const { data: existingPage } = await supabase
        .from("pages")
        .select("id")
        .eq("portfolio_id", portfolioId)
        .eq("route", "/")
        .maybeSingle()

      if (existingPage) {
        pageId = existingPage.id
        console.log("[v0] ✅ Using existing page:", pageId)
      } else {
        const pageKey = `page_${nanoid(12)}`
        console.log("[v0] 🔑 Generated page key:", pageKey)

        const pageInsertData = {
          portfolio_id: portfolioId,
          route: "/",
          key: pageKey,
          title: portfolioName,
        }
        console.log("[v0] 📄 Inserting page with data:", JSON.stringify(pageInsertData, null, 2))

        const { data: page, error: pageError } = await supabase
          .from("pages")
          .insert(pageInsertData)
          .select("id")
          .single()

        if (pageError) {
          console.error("[v0] ❌ Page creation error:", pageError)
          throw new Error(`Failed to create page: ${pageError.message}`)
        }

        pageId = page.id
        console.log("[v0] ✅ Page created:", pageId)
      }

      const leftWidgets = ["identity", "education"]
      const rightWidgets = ["description", "projects", "services", "meeting-scheduler"]

      console.log("[v0] 📐 Creating layout with widgets:", { left: leftWidgets, right: rightWidgets })

      const layoutInsertData = {
        page_id: pageId,
        portfolio_id: portfolioId,
        layout: {
          left: { type: "vertical", widgets: leftWidgets },
          right: { type: "vertical", widgets: rightWidgets },
        },
      }

      const { error: layoutError } = await supabase.from("page_layouts").upsert(layoutInsertData)

      if (layoutError) {
        console.error("[v0] ❌ Layout creation error:", layoutError)
        throw new Error(`Failed to create layout: ${layoutError.message}`)
      }

      console.log("[v0] ✅ Layout created for page:", pageId)

      const widgetInstances = []

      // Identity widget
      const identityTypeId = widgetTypeMap.get("identity")
      if (identityTypeId) {
        console.log("[v0] 🎨 Creating identity widget")
        widgetInstances.push({
          page_id: pageId,
          widget_type_id: identityTypeId,
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
      }

      // Education widget
      if (parsedData.education && parsedData.education.length > 0) {
        const educationTypeId = widgetTypeMap.get("education")
        if (educationTypeId) {
          console.log("[v0] 🎓 Creating education widget with", parsedData.education.length, "items")
          widgetInstances.push({
            page_id: pageId,
            widget_type_id: educationTypeId,
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
      }

      // Description widget
      const descriptionTypeId = widgetTypeMap.get("description")
      if (descriptionTypeId) {
        console.log("[v0] 📄 Creating description widget")
        widgetInstances.push({
          page_id: pageId,
          widget_type_id: descriptionTypeId,
          props: {
            title: "About Me",
            content: parsedData.personalInfo.summary || "Professional with diverse experience and skills.",
          },
        })
      }

      // Projects widget
      if (parsedData.projects && parsedData.projects.length > 0) {
        const projectsTypeId = widgetTypeMap.get("projects")
        if (projectsTypeId) {
          console.log("[v0] 🚀 Creating projects widget with", parsedData.projects.length, "projects")
          widgetInstances.push({
            page_id: pageId,
            widget_type_id: projectsTypeId,
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
      }

      // Services/Skills widget
      if (parsedData.skills) {
        const servicesTypeId = widgetTypeMap.get("services")
        if (servicesTypeId) {
          const allSkills = [...(parsedData.skills.technical || []), ...(parsedData.skills.soft || [])]
          console.log("[v0] 💼 Creating skills widget with", allSkills.length, "skills")

          widgetInstances.push({
            page_id: pageId,
            widget_type_id: servicesTypeId,
            props: {
              title: "Skills",
              items: allSkills.slice(0, 8),
            },
          })
        }
      }

      // Meeting scheduler widget
      const meetingTypeId = widgetTypeMap.get("meeting-scheduler")
      if (meetingTypeId) {
        console.log("[v0] 📅 Creating meeting scheduler widget")
        widgetInstances.push({
          page_id: pageId,
          widget_type_id: meetingTypeId,
          props: {
            selectedColor: 5,
          },
        })
      }

      console.log("[v0] 💾 Inserting", widgetInstances.length, "widget instances")

      if (mode === "update") {
        const { error: deleteError } = await supabase.from("widget_instances").delete().eq("page_id", pageId)

        if (deleteError) {
          console.error("[v0] ⚠️ Failed to delete old widgets:", deleteError.message)
        } else {
          console.log("[v0] 🗑️ Deleted old widget instances")
        }
      }

      let successCount = 0
      const errors = []

      for (let i = 0; i < widgetInstances.length; i++) {
        const widget = widgetInstances[i]
        console.log(`[v0] 💾 Inserting widget ${i + 1}/${widgetInstances.length}`)

        const { data: widgetData, error: widgetError } = await supabase
          .from("widget_instances")
          .insert(widget)
          .select("id")

        if (widgetError) {
          console.error(`[v0] ❌ Widget ${i + 1} creation error:`, widgetError.message)
          errors.push(widgetError.message)
        } else {
          console.log(`[v0] ✅ Widget ${i + 1} created successfully:`, widgetData?.id)
          successCount++
        }
      }

      if (successCount === 0 && widgetInstances.length > 0) {
        throw new Error(`Failed to create any widgets: ${errors.join(", ")}`)
      }

      console.log(`[v0] ✅ ${successCount}/${widgetInstances.length} widgets created successfully`)
      console.log("[v0] ========== PORTFOLIO", mode.toUpperCase(), "COMPLETE ==========")
      console.log("[v0] 🎉 Portfolio ID:", portfolioId)

      return NextResponse.json({
        success: true,
        portfolioId: portfolioId,
        widgetsCreated: successCount,
        totalWidgets: widgetInstances.length,
        mode: mode,
      })
    } catch (innerError: any) {
      console.error("[v0] ❌ Page/widget creation failed:", innerError.message)
      if (mode === "create" && portfolioId) {
        console.error("[v0] 🔄 Rolling back portfolio:", portfolioId)
        await supabase.from("portfolios").delete().eq("id", portfolioId)
        console.log("[v0] 🗑️ Portfolio deleted:", portfolioId)
      }
      throw innerError
    }
  } catch (error: any) {
    console.error("[v0] ❌ Portfolio creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create portfolio" }, { status: 500 })
  }
}
