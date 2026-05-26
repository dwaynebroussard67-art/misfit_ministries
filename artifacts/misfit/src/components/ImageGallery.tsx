import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageGalleryProps {
  images: { src: string; alt: string; caption?: string }[];
  columns?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, columns = 3 }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(index)}
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover hover:brightness-75 transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-full object-contain"
              />
              {images[selectedImage].caption && (
                <p className="text-white text-center mt-4 text-sm">
                  {images[selectedImage].caption}
                </p>
              )}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
