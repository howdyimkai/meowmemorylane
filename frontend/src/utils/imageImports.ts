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
  try {
    if (toyImages[toyId as keyof typeof toyImages]) {
      return toyImages[toyId as keyof typeof toyImages];
    }
  } catch (e) {
    console.error('Error getting toy image:', e);
  }
  
  // Fallback to public path if import not found
  // For GitHub Pages, we need to include the repository name in the path
  const basePath = process.env.PUBLIC_URL || '';
  return `${basePath}/toys/${toyId === 'cattree' ? 'cat-tree' : toyId}.png`;
};

export const getAppImage = (imageName: string): string => {
  try {
    if (appImages[imageName as keyof typeof appImages]) {
      return appImages[imageName as keyof typeof appImages];
    }
  } catch (e) {
    console.error('Error getting app image:', e);
  }
  
  // Fallback to public path
  // For GitHub Pages, we need to include the repository name in the path
  const basePath = process.env.PUBLIC_URL || '';
  return `${basePath}/images/${imageName}.png`;
};
