"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, LANGUAGES } from "./language-context";
import { useTheme } from "next-themes";

export function LanguageTransition() {
  const { isTransitioning, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.15,
            ease: "easeInOut"
          }}
          style={{
            backgroundColor: resolvedTheme === 'dark' ? '#000000' : '#ffffff'
          }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0.2, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.15,
              ease: "easeInOut"
            }}
          >
            <h1
              className="font-bold text-[clamp(3rem,15vw,20rem)] leading-none"
              style={{ color: '#F47920' }}
            >
              {LANGUAGES[language].nativeName}
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
