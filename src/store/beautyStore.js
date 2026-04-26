import { create } from 'zustand';

const getActiveSection = (progress) => {
  if (progress < 0.18) return 0;
  if (progress < 0.34) return 1;
  if (progress < 0.56) return 2;
  if (progress < 0.72) return 3;
  if (progress < 0.87) return 4;
  return 5;
};

const useBeautyStore = create((set) => ({
  scrollProgress: 0,
  activeSection: 0,
  activeZone: 0,
  mouseNorm: { x: 0, y: 0 },
  cursorVariant: 'default',
  soundEnabled: false,
  introComplete: false,
  hoveredCard: null,
  chatMessages: [],
  chatLoading: false,

  setScrollProgress: (scrollProgress) => {
    const activeSection = getActiveSection(scrollProgress);
    set({ scrollProgress, activeSection, activeZone: activeSection });
  },

  setMouseNorm: (x, y) => set({ mouseNorm: { x, y } }),
  setCursorVariant: (cursorVariant) => set({ cursorVariant }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setIntroComplete: (introComplete) => set({ introComplete }),
  setHoveredCard: (hoveredCard) => set({ hoveredCard }),
  addMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatLoading: (chatLoading) => set({ chatLoading }),
}));

export default useBeautyStore;
