import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  Target,
  Wrench,
  CheckCircle2,
  Search,
} from "lucide-react";
import Header from "./Header"; // ✅ using your project's header file

// ✅ Inline Card & Badge (self-contained)
function Card({ children, className }) {
  return <div className={`rounded-lg border p-4 ${className}`}>{children}</div>;
}
function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
function Badge({ children }) {
  return (
    <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-200">
      {children}
    </span>
  );
}

const userGoals = {
  title: "Project Goals – From Your Perspective",
  sections: [
    {
      id: "core-objectives",
      icon: Target,
      label: "Main Things You Can Do",
      items: [
        "Create a personal or team roadmap.",
        "Add steps and milestones with due dates.",
        "Track progress in an easy-to-understand way.",
        "Log in securely to access your roadmaps.",
      ],
      tags: ["essential"],
    },
    {
      id: "functional-goals",
      icon: ListChecks,
      label: "Features for You",
      groups: [
        {
          title: "Your Account",
          items: [
            "Sign up or log in easily.",
            "Different roles: Owner, Editor, Viewer.",
          ],
        },
        {
          title: "Roadmap Features",
          items: [
            "Create a roadmap with title and description.",
            "Add steps with deadlines, priorities, and status.",
            "Mark steps as pending, in progress, or completed.",
          ],
        },
        {
          title: "Search & Filter",
          items: [
            "Search your roadmaps by title or tags.",
            "Filter steps by their status (done, in-progress, upcoming).",
          ],
        },
      ],
      tags: ["features"],
    },
    {
      id: "technical-goals",
      icon: Wrench,
      label: "How It Helps You",
      groups: [
        {
          title: "Smooth Experience",
          items: [
            "Simple dashboard to manage roadmaps.",
            "Visual display of steps (timeline, list, or board).",
            "Works well on both phone and desktop.",
          ],
        },
        {
          title: "Privacy & Security",
          items: [
            "Your account is secure and private.",
            "Only you and invited people can see your roadmaps.",
          ],
        },
        {
          title: "Always Available",
          items: [
            "Your data is saved safely online.",
            "Accessible anytime, anywhere.",
          ],
        },
      ],
      tags: ["benefits"],
    },
    {
      id: "success-criteria",
      icon: CheckCircle2,
      label: "When It's Successful",
      items: [
        "You can create and manage your roadmaps end-to-end.",
        "Logging in and staying secure is easy.",
        "Your roadmaps save properly and are always available.",
        "The app looks clean and works smoothly.",
        "You can access it online without issues.",
      ],
      tags: ["success"],
    },
  ],
};

function Section({ section, query }) {
  const Icon = section.icon;
  const q = query.trim().toLowerCase();

  const match = (text) => text.toLowerCase().includes(q);

  const filtered = useMemo(() => {
    if (!q) return section;
    const clone = { ...section };

    if (section.items) {
      clone.items = section.items.filter(match);
    }
    if (section.groups) {
      clone.groups = section.groups
        .map((g) => ({ ...g, items: g.items.filter(match) }))
        .filter((g) => g.items.length > 0 || match(g.title));
    }
    return clone;
  }, [section, q]);

  const isEmpty = () => {
    if (filtered.items && filtered.items.length) return false;
    if (filtered.groups && filtered.groups.length) return false;
    return q.length > 0;
  };

  if (isEmpty()) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border border-gray-700 shadow-md bg-gray-900 rounded-2xl overflow-hidden">
        <CardContent className="p-5 sm:p-6 text-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Icon className="h-5 w-5 text-gray-300" />
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
              {section.label}
            </h2>
            <div className="ml-auto flex gap-2 flex-wrap">
              {section.tags?.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>

          <hr className="my-3 border-gray-700" />

          {filtered.groups ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.groups.map((group, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-4">
                  <p className="font-medium mb-2 text-gray-100">
                    {group.title}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-gray-300">
                    {group.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {filtered.items ? (
            <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-gray-300">
              {filtered.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RoadmapGoalsView({ data = userGoals }) {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100">
      <Header /> {/* ✅ Your project’s Header */}
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Target className="h-6 w-6 text-gray-200" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {data.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quick filter goals…"
              className="border border-gray-700 rounded px-2 py-1 w-full max-w-md bg-gray-800 text-gray-100 placeholder-gray-400"
            />
          </div>
        </motion.header>

        <motion.main layout className="grid gap-4 sm:gap-5">
          {data.sections.map((s) => (
            <Section key={s.id} section={s} query={query} />
          ))}
        </motion.main>
      </div>
    </div>
  );
}
