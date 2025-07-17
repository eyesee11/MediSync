
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/icons/logo"
import { ShieldCheck, Users, GitMerge, LineChart, Building, Mail } from "lucide-react"

const services = [
  {
    icon: LineChart,
    title: "Records Synced (24h)",
    value: "12,542",
    description: "+5.2% from last 24 hours",
  },
  {
    icon: GitMerge,
    title: "Active EHR Integrations",
    value: "14",
    description: "2 new integrations pending",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Status",
    value: "Compliant",
    description: "Last audit: 2 days ago",
    valueColor: "text-green-600",
  },
  {
    icon: Users,
    title: "Active Users",
    value: "2,104",
    description: "+180 since last month",
  },
];

export function LandingPage() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">MediSync Hub</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link href="#home" onClick={handleScroll} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Home
          </Link>
          <Link href="#services" onClick={handleScroll} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Services
          </Link>
          <Link href="#about" onClick={handleScroll} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About Us
          </Link>
          <Link href="#contact" onClick={handleScroll} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <Link href="/login" prefetch={false}>
            <Button>Login / Register</Button>
          </Link>
        </nav>
        <div className="ml-auto md:hidden">
            <Link href="/login" prefetch={false}>
                <Button>Login</Button>
            </Link>
        </div>
      </header>
      <main className="flex-1">
        <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure, Real-time Medical Record Synchronization
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MediSync Hub provides a robust platform for seamless EHR integration, HIPAA compliance, and secure data handling for modern healthcare providers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login" prefetch={false}>
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="healthcare technology"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Services</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Platform Capabilities at a Glance</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide a reliable and secure infrastructure to keep your healthcare services running smoothly.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <Card key={service.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{service.title}</CardTitle>
                    <service.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${service.valueColor || ''}`}>{service.value}</div>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                         <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm mb-4">About Us</div>
                         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission is to Revolutionize Healthcare Data</h2>
                         <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                            MediSync Hub was founded with a simple yet powerful goal: to create a universally connected and secure healthcare ecosystem. We believe that by enabling seamless data flow between providers, we can improve patient outcomes, reduce administrative burdens, and pave the way for a new era of proactive and personalized medicine.
                         </p>
                    </div>
                     <Image
                        src="https://placehold.co/600x450.png"
                        width="600"
                        height="450"
                        alt="About Us"
                        data-ai-hint="diverse team collaborating"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                    />
                 </div>
            </div>
        </section>

         <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions or want to get started? We'd love to hear from you.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-4">
                <Input type="text" placeholder="Name" className="max-w-lg flex-1" />
                <Input type="email" placeholder="Email" className="max-w-lg flex-1" />
                <Textarea placeholder="Your Message" className="max-w-lg flex-1" />
                <Button type="submit">Submit</Button>
              </form>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 MediSync Hub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

    