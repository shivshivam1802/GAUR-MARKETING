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
  ArrowRight,
  Star,
  BarChart3,
  Zap,
  Shield,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-primary to-primary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-poppins)] text-white mb-6 text-balance">
              Grow Your Brand. <span className="text-accent">Expand Your Reach.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Transform your business with data-driven digital marketing strategies. We deliver measurable results
              through SEO, social media, and performance marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
                <Link href="/contact">Get Free Consultation</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 bg-transparent"
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-2">200+</div>
              <div className="text-muted-foreground font-medium">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-2">500+</div>
              <div className="text-muted-foreground font-medium">Campaigns Launched</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-2">98%</div>
              <div className="text-muted-foreground font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital marketing solutions tailored to your business goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-12 h-12 text-accent" />,
                title: "Digital Marketing",
                description:
                  "Complete digital marketing strategies to boost your online presence and drive conversions.",
              },
              {
                icon: <Megaphone className="w-12 h-12 text-accent" />,
                title: "Social Media Marketing",
                description:
                  "Engage your audience with compelling content and strategic campaigns across all platforms.",
              },
              {
                icon: <Search className="w-12 h-12 text-accent" />,
                title: "SEO & Website Optimization",
                description: "Rank higher on search engines and attract qualified organic traffic to your website.",
              },
              {
                icon: <Target className="w-12 h-12 text-accent" />,
                title: "Google Ads / Paid Campaigns",
                description: "Maximize ROI with targeted advertising campaigns that convert prospects into customers.",
              },
              {
                icon: <Palette className="w-12 h-12 text-accent" />,
                title: "Branding & Graphic Design",
                description: "Create a memorable brand identity with stunning visuals and cohesive design elements.",
              },
              {
                icon: <Users className="w-12 h-12 text-accent" />,
                title: "Lead Generation",
                description: "Generate high-quality leads with proven strategies that fill your sales pipeline.",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-accent/20"
              >
                <CardContent className="p-8">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
              Why Choose INTERNET SERVICE PROVIDER?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine creativity, data, and expertise to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-10 h-10 text-accent" />,
                title: "Data-Driven",
                description: "Every decision backed by analytics and insights",
              },
              {
                icon: <Zap className="w-10 h-10 text-accent" />,
                title: "Fast Results",
                description: "Quick turnaround without compromising quality",
              },
              {
                icon: <Shield className="w-10 h-10 text-accent" />,
                title: "Proven Track Record",
                description: "500+ successful campaigns delivered",
              },
              {
                icon: <CheckCircle2 className="w-10 h-10 text-accent" />,
                title: "24/7 Support",
                description: "Dedicated team always here to help you succeed",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">Real results from real businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                company: "Tech Innovations Inc",
                text: "INTERNET SERVICE PROVIDER transformed our online presence. Our leads increased by 300% in just 3 months!",
              },
              {
                name: "Michael Chen",
                company: "E-Commerce Solutions",
                text: "The best marketing agency we've worked with. Professional, results-driven, and always available.",
              },
              {
                name: "Emily Rodriguez",
                company: "Local Business Co",
                text: "Their SEO strategies helped us rank #1 for our most important keywords. Highly recommend!",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
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
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your marketing goals
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
