/**
 * Preloads an array of image URLs.
 * @param urls - Array of image URLs to preload.
 * @returns Promise that resolves when all images are loaded or failed.
 */
export async function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to not block
    });
  });

  return Promise.all(promises);
}

/**
 * Extracts image URLs from a markdown string.
 * @param markdown - The markdown string to parse.
 * @returns Array of image URLs found.
 */
export function extractImageUrls(markdown: string): string[] {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const urls: string[] = [];
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }
  
  return urls;
}
