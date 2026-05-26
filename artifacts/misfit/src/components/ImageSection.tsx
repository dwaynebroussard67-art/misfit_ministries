import React from 'react';
import { motion } from 'framer-motion';

interface ImageSectionProps {
  imageSrc: string;
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  imageSrc,
  title,
  description,
  imagePosition = 'left',
}) => {
  const imageCol = (
    <motion.img
      initial={{ opacity: 0, x: imagePosition === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      src={imageSrc}
      alt={title}
      className="w-full h-full object-cover rounded-lg shadow-lg"
    />
  );

  const textCol = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === 'left' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-center"
    >
      <h3 className="text-3xl font-bold mb-4 text-amber-500">{title}</h3>
      <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
      {imagePosition === 'left' ? (
        <>
          <div className="h-96">{imageCol}</div>
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          <div className="h-96">{imageCol}</div>
        </>
      )}
    </div>
  );
};
