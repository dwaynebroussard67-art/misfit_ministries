import React from 'react';
import { motion } from 'framer-motion';

interface ImageHeroProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const ImageHero: React.FC<ImageHeroProps> = ({
  imageSrc,
  title,
  subtitle,
  overlay = true,
  overlayOpacity = 0.5,
}) => {
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-2xl">
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};
