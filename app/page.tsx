"use client";

import { useEffect, useState } from "react";
import { Header } from "./(landing)/components/Header";
import { Hero } from "./(landing)/components/Hero";
import { Cards } from "./(landing)/components/Cards";
import { HowItWorks } from "./(landing)/components/HowItWorks";
import { FAQ } from "./(landing)/components/FAQ";
import { CTA } from "./(landing)/components/CTA";
import { Footer } from "./(landing)/components/Footer";
import { FloatingContactButton } from "./(landing)/components/FloatingContactButton";
import { GiftPaymentSuccessHandler } from "./(landing)/components/GiftPaymentSuccessHandler";
import { LoadingOverlay } from "@/ui/components/LoadingOverlay";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = 0;
        }
      }
    };

    resetScroll();

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsLoaded(true);
        resetScroll();
      }, 100);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const resetScroll = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = 0;
        }
      };
      
      const timeout = setTimeout(resetScroll, 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoaded]);

  return (
    <>
      <GiftPaymentSuccessHandler />
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex min-h-screen flex-col">
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0s both` : "none",
          }}
        >
          <Header />
        </div>
        
        <div
          className="-mt-px"
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0.1s both` : "none",
          }}
        >
          <Hero />
        </div>
        
        <div
          className="-mt-px"
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0.2s both` : "none",
          }}
        >
          <Cards />
        </div>
        
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0.3s both` : "none",
          }}
        >
          <HowItWorks />
        </div>
        
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0.4s both` : "none",
          }}
        >
          <CTA />
        </div>
        
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0.5s both` : "none",
          }}
        >
          <FAQ />
        </div>
        
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded ? `fadeInDown 0.6s ease-out 0.6s both` : "none",
          }}
        >
          <Footer />
        </div>
      </div>
      {isLoaded && <FloatingContactButton />}
    </>
  );
}
