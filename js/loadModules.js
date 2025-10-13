// js/loadModules.js

const loadSection = async (id, file) => {
  try {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
};

loadSection('hero', 'sections/hero.html');
loadSection('how-it-works', 'sections/how-it-works.html');
loadSection('services', 'sections/services.html');
loadSection('about', 'sections/about.html');
loadSection('contact', 'sections/contact.html');
loadSection('offers', 'sections/offers.html');
