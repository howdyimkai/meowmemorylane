// Import all images explicitly to ensure they're included in the build
// This helps resolve image path issues in different environments

// Toy Images
import yarnImg from '../assets/toys/yarn.png';
import laserImg from '../assets/toys/laser.png';
import mouseImg from '../assets/toys/mouse.png';
import treatsImg from '../assets/toys/treats.png';
import catTreeImg from '../assets/toys/cat-tree.png';

// General Images
import victorianHomeImg from '../assets/images/victorian-home.png';
import stampImg from '../assets/images/stamp.png';

// Export image objects for use in components
export const toyImages = {
  yarn: yarnImg,
  laser: laserImg,
  mouse: mouseImg,
  treats: treatsImg,
  cattree: catTreeImg
};

export const appImages = {
  victorianHome: victorianHomeImg,
  stamp: stampImg
};

// Helper function to get the correct image path
export const getToyImage = (toyId: string): string => {
  if (toyImages[toyId as keyof typeof toyImages]) {
    return toyImages[toyId as keyof typeof toyImages];
  }
  
  // Fallback to public path if import not found
  return `${process.env.PUBLIC_URL || ''}/toys/${toyId === 'cattree' ? 'cat-tree' : toyId}.png`;
};

export const getAppImage = (imageName: string): string => {
  if (appImages[imageName as keyof typeof appImages]) {
    return appImages[imageName as keyof typeof appImages];
  }
  
  // Fallback to public path
  return `${process.env.PUBLIC_URL || ''}/images/${imageName}.png`;
};
