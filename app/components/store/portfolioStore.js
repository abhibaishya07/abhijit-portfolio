"use client";

import { create } from "zustand";

export const usePortfolioStore = create((set) => ({
  activeSection: "home",
  cursorState: "default",
  isLoading: true,
  scrollProgress: 0,
  mobileMenuOpen: false,
  setActiveSection: (activeSection) => set({ activeSection }),
  setCursorState: (cursorState) => set({ cursorState }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen })
}));
