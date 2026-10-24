import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../utils/gsapSetup';

export interface FeatureSectionProps {
  id?: string;
  stepNumber: string;
  category: string;
  title: string;
  subtitle: string;
  description?: string;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  id,
  stepNumber,
  category,
  title,
  subtitle,
  description,
  children,
  align = 'left',
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Reveal content
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`space-y-3 ${
            align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'
          }`}
        >
          {/* Step Pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#E8E2D8] text-[11px] font-mono text-[#55534E] border border-[#292927]/12">
            <span className="text-[#28483D] font-black">{stepNumber}</span>
            <span className="text-[#9B978F]">/</span>
            <span className="uppercase tracking-wider font-bold text-[#171717]">{category}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#171717] tracking-tight uppercase font-sans">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#28483D] font-bold font-sans">
            {subtitle}
          </p>

          {/* Optional Extended Description */}
          {description && (
            <p className="text-sm sm:text-base text-[#4A4843] leading-relaxed font-sans pt-1 font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Story Interactive Showcase Content */}
        <div ref={contentRef} className="relative">
          {children}
        </div>

      </div>
    </section>
  );
};
