"use client"

import { Map, Github, Twitter, Linkedin, Mail, ArrowUp } from "lucide-react"
import { Button } from "./UI/button"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerSections = {
    platform: {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Roadmap Builder", href: "#roadmap-builder" },
        { name: "Team Collaboration", href: "#team" },
        { name: "Milestone Tracking", href: "#milestones" },
        { name: "Integrations", href: "#integrations" },
        { name: "Pricing", href: "#pricing" },
      ],
    },
    solutions: {
      title: "Solutions",
      links: [
        { name: "For Project Managers", href: "#project-managers" },
        { name: "For Teams", href: "#teams" },
        { name: "For Enterprises", href: "#enterprise" },
        { name: "For Freelancers", href: "#freelancers" },
        { name: "Education & Learning", href: "#education" },
        { name: "Product Development", href: "#product-dev" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api-docs" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Blog", href: "#blog" },
        { name: "Case Studies", href: "#case-studies" },
        { name: "Webinars", href: "#webinars" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Us", href: "#contact" },
        { name: "Community Forum", href: "#community" },
        { name: "System Status", href: "#status" },
        { name: "Report a Bug", href: "#bugs" },
        { name: "Request a Feature", href: "#features" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Press Kit", href: "#press" },
        { name: "Partners", href: "#partners" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
      ],
    },
  }

  const socialLinks = [
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/deep-prajapati-92673a2b3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, href: "https://github.com/DeepPrajapati1580" },
    { name: "Email", icon: <Mail className="h-5 w-5" />, href: "mailto:23ceuog126@ddu.ac.in" },
  ]

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Map className="h-8 w-8 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold">RoadmapPro</span>
                <p className="text-sm text-gray-400">Plan. Track. Achieve.</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              RoadmapPro helps teams and individuals create clear, actionable roadmaps. Track milestones, assign tasks,
              and collaborate effortlessly — all in one platform designed to keep projects on track.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 dark:bg-slate-900 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

       
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p>&copy; 2025 RoadmapPro. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#cookies" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </div>
            </div>

            {/* Back to Top */}
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-gray-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="bg-slate-800 dark:bg-slate-900 border-t border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Projects Synced</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Live Collaboration Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
