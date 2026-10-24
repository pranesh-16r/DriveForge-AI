import confetti from 'canvas-confetti';

export const triggerCustomizationConfetti = () => {
  try {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#0070F3', '#10B981', '#FFFFFF', '#EF4444'],
      disableForReducedMotion: true,
    });
  } catch {
    // Fallback if canvas is not ready
  }
};
