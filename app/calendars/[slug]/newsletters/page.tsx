import { NewsletterManagement } from "@/components/calendars/newsletter-management"

export default function NewsletterPage({ params }: { params: { slug: string } }) {
  return <NewsletterManagement slug={params.slug} />
}
