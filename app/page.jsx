"use client";

import { useMemo } from "react";
import HeroSection from "@/app/components/sections/HeroSection";
import AboutSection from "@/app/components/sections/AboutSection";
import ProjectsSection from "@/app/components/sections/ProjectsSection";
import SkillsSection from "@/app/components/sections/SkillsSection";
import ExperienceSection from "@/app/components/sections/ExperienceSection";
import ContactSection from "@/app/components/sections/ContactSection";
import FooterSection from "@/app/components/sections/FooterSection";
import { useHashSections } from "@/app/components/hooks/useHashSections";

export default function HomePage() {
  const sectionIds = useMemo(
    () => ["home", "about", "projects", "skills", "experience", "contact"],
    []
  );

  useHashSections(sectionIds);

  return (
    <main className="relative z-20 overflow-x-clip">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
