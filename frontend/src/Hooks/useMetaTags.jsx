import { useEffect } from 'react';

const useMetaTags = ({ title, description, keywords, robots }) => {
  useEffect(() => {
    document.title = title;
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = description;
    document.head.appendChild(metaDescription);
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = keywords;
    document.head.appendChild(metaKeywords);
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = robots;
    document.head.appendChild(metaRobots);
    return () => {
      document.head.removeChild(metaDescription);
      document.head.removeChild(metaKeywords);
      document.head.removeChild(metaRobots);
    };
  }, [title, description, keywords, robots]);
  return null;
};

export default useMetaTags;
