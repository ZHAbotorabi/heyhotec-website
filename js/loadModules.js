// js/loadModules.js
// ----------------------------
// Dynamically loads each HTML section (hero, about, services, etc.)
// into the main index.html page.
// Includes a version parameter to prevent browser caching
// and ensure the latest content is always loaded.

// Increment this version number each time you make updates.
// It helps force the browser to fetch fresh content.
const VERSION = 'v3';

/**
 * Dynamically loads an HTML file into a specific section of the page.
 *
 * @param {string} id   - The ID of the target <section> element in index.html
 * @param {string} file - The relative path to the HTML file to load
 */
const loadSection = async (id, file) => {
  try {
    // Append version parameter to break browser cache
    // 'cache: no-store' ensures the fetch request always gets a fresh copy
    const res = await fetch(`${file}?v=${VERSION}`, { cache: 'no-store' });

    // Convert the fetched response into text (HTML)
    const html = await res.text();

    // Inject the HTML content into the corresponding section of the page
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    // Log any loading errors for debugging
    console.error(`Error loading ${file}:`, error);
  }
};

// ----------------------------
// Load each section of the website dynamically
// ----------------------------

// Home / Hero section (includes video and intro text)
loadSection('hero', 'sections/hero.html');

// Step-by-step explanation section
loadSection('how-it-works', 'sections/how-it-works.html');

// List of offered AI services
loadSection('services', 'sections/services.html');

// About section (company, founder, or mission)
loadSection('about', 'sections/about.html');

// Contact form or contact information
loadSection('contact', 'sections/contact.html');

// Current offers or projects section
loadSection('offers', 'sections/offers.html');
