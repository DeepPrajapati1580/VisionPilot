"use client"

import { Map, Github, Linkedin, Mail, ArrowUp } from "lucide-react"
import { Button } from "./UI/button"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/deep-prajapati-92673a2b3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, href: "https://github.com/DeepPrajapati1580" },
    { name: "Email", icon: <Mail className="h-5 w-5" />, href: "mailto:23ceuog126@ddu.ac.in" },
  ]

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-4">
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

          {/* Full width description */}
          <div className="lg:col-span-6">
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              RoadmapPro helps teams and individuals create clear, actionable roadmaps. Track milestones, assign tasks,
              and collaborate effortlessly — all in one platform designed to keep projects on track.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p>&copy; 2025 RoadmapPro. All rights reserved.</p>
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
    </footer>
  )
}
