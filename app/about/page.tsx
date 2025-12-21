import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, TrendingUp, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-poppins)] text-white mb-6 text-balance">
              About <span className="text-accent">GAUR Marketing</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              We're a team of passionate digital marketing experts dedicated to helping businesses thrive in the digital
              age.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2018, GAUR Marketing started with a simple mission: to help businesses succeed online through
                innovative digital marketing strategies. What began as a small team of passionate marketers has grown
                into a full-service agency serving clients worldwide.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe in the power of data-driven marketing combined with creative storytelling. Our approach
                focuses on understanding your unique business goals and crafting customized strategies that deliver
                measurable results.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we're proud to have helped over 200 businesses grow their online presence, generate quality
                leads, and achieve their marketing objectives.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-32 h-32 text-accent mx-auto mb-4" />
                  <div className="text-4xl font-bold font-[family-name:var(--font-poppins)] text-primary">6+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-transparent hover:border-accent/20 transition-all">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                  <Target className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower businesses with innovative digital marketing solutions that drive growth, build brand
                  awareness, and create lasting customer relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-accent/20 transition-all">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                  <Eye className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the most trusted digital marketing partner for businesses worldwide, known for delivering
                  exceptional results and outstanding service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-accent/20 transition-all">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                  <Heart className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
                  Our Values
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Integrity, innovation, collaboration, and results. We treat every client's business as our own and
                  strive for excellence in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-white/90">Proven track record of success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: <Users />, number: "200+", label: "Happy Clients" },
              { icon: <TrendingUp />, number: "500+", label: "Successful Campaigns" },
              { icon: <Award />, number: "98%", label: "Client Satisfaction" },
              { icon: <Target />, number: "3M+", label: "Leads Generated" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                  <div className="text-accent">{stat.icon}</div>
                </div>
                <div className="text-5xl font-bold font-[family-name:var(--font-poppins)] mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] text-primary mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Talented professionals dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: "John Gaur", role: "Founder & CEO", specialty: "Digital Strategy" },
              { name: "Sarah Miller", role: "Head of SEO", specialty: "Search Optimization" },
              { name: "David Park", role: "Creative Director", specialty: "Brand Design" },
              { name: "Lisa Wong", role: "Social Media Lead", specialty: "Social Strategy" },
            ].map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-primary mb-1">
                    {member.name}
                  </h3>
                  <div className="text-accent font-medium mb-2">{member.role}</div>
                  <div className="text-sm text-muted-foreground">{member.specialty}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
