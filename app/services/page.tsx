import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  TrendingUp,
  Target,
  Megaphone,
  Search,
  Palette,
  Users,
  CheckCircle2,
  BarChart3,
  Mail,
  Globe,
  Video,
  ShoppingCart,
} from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: <TrendingUp className="w-12 h-12 text-accent" />,
      title: "Digital Marketing",
      description:
        "Comprehensive digital marketing strategies that combine multiple channels to maximize your online presence and drive measurable business growth.",
      features: [
        "Marketing Strategy Development",
        "Multi-Channel Campaigns",
        "Performance Analytics",
        "ROI Optimization",
      ],
    },
    {
      icon: <Megaphone className="w-12 h-12 text-accent" />,
      title: "Social Media Marketing",
      description:
        "Build and engage your audience across all major social platforms with compelling content and strategic campaigns that convert followers into customers.",
      features: [
        "Content Creation & Planning",
        "Community Management",
        "Social Media Advertising",
        "Influencer Partnerships",
      ],
    },
    {
      icon: <Search className="w-12 h-12 text-accent" />,
      title: "SEO & Website Optimization",
      description:
        "Improve your search engine rankings and drive organic traffic with technical SEO, on-page optimization, and strategic link building.",
      features: [
        "Keyword Research & Strategy",
        "On-Page SEO Optimization",
        "Technical SEO Audits",
        "Link Building Campaigns",
      ],
    },
    {
      icon: <Target className="w-12 h-12 text-accent" />,
      title: "Google Ads / Paid Campaigns",
      description:
        "Maximize your advertising ROI with expertly managed PPC campaigns across Google Ads, Facebook Ads, and other major platforms.",
      features: [
        "Campaign Strategy & Setup",
        "Ad Copy & Creative Design",
        "Bid Management & Optimization",
        "Conversion Tracking",
      ],
    },
    {
      icon: <Palette className="w-12 h-12 text-accent" />,
      title: "Branding & Graphic Design",
      description:
        "Create a memorable brand identity with stunning visual design that resonates with your target audience and differentiates you from competitors.",
      features: ["Logo & Brand Identity Design", "Marketing Collateral", "Social Media Graphics", "Brand Guidelines"],
    },
    {
      icon: <Users className="w-12 h-12 text-accent" />,
      title: "Lead Generation",
      description:
        "Fill your sales pipeline with high-quality leads using proven strategies including landing pages, lead magnets, and conversion optimization.",
      features: [
        "Landing Page Design",
        "Lead Magnet Creation",
        "Conversion Rate Optimization",
        "Email Marketing Automation",
      ],
    },
    {
      icon: <Mail className="w-12 h-12 text-accent" />,
      title: "Email Marketing",
      description:
        "Nurture relationships and drive sales with strategic email campaigns that engage your audience and deliver exceptional ROI.",
      features: [
        "Email Campaign Strategy",
        "Newsletter Design & Content",
        "Marketing Automation",
        "A/B Testing & Optimization",
      ],
    },
    {
      icon: <Video className="w-12 h-12 text-accent" />,
      title: "Video Marketing",
      description:
        "Engage your audience with compelling video content that tells your brand story and drives action across all digital channels.",
      features: ["Video Strategy & Planning", "Script Writing", "Video Production", "Video SEO & Distribution"],
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-accent" />,
      title: "E-Commerce Marketing",
      description:
        "Drive online sales with specialized e-commerce marketing strategies including product optimization, shopping ads, and conversion tactics.",
      features: [
        "Product Feed Optimization",
        "Shopping Campaign Management",
        "Remarketing Strategies",
        "Cart Abandonment Recovery",
      ],
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-accent" />,
      title: "Analytics & Reporting",
      description:
        "Make data-driven decisions with comprehensive analytics, detailed reporting, and actionable insights into your marketing performance.",
      features: [
        "Google Analytics Setup",
        "Custom Dashboard Creation",
        "Performance Reporting",
        "Data Analysis & Insights",
      ],
    },
    {
      icon: <Globe className="w-12 h-12 text-accent" />,
      title: "Website Development",
      description:
        "Build high-performing, mobile-responsive websites that convert visitors into customers and support your digital marketing goals.",
      features: ["Responsive Web Design", "CMS Development", "E-Commerce Solutions", "Website Maintenance"],
    },
    {
      icon: <CheckCircle2 className="w-12 h-12 text-accent" />,
      title: "Marketing Consulting",
      description:
        "Get expert guidance on your marketing strategy with personalized consulting sessions and actionable recommendations.",
      features: ["Marketing Audits", "Strategy Development", "Competitive Analysis", "Growth Planning"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-poppins)] text-white mb-6 text-balance">
              Our <span className="text-accent">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Comprehensive digital marketing solutions designed to help your business thrive online
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-accent/20"
              >
                <CardContent className="p-8">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5 mr-2" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] mb-6 text-balance">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss which services are right for your business goals
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
            <Link href="/contact">Schedule Free Consultation</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
