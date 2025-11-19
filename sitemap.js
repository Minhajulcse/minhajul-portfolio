const fs = require('fs');
const pages = ["", "projects", "achievements", "about", "contact"];
const domain = "https://minhajul-islam.vercel.app";
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
pages.forEach(p => {
  xml += `  <url><loc>${domain}/${p}</loc></url>\n`;
});
xml += '</urlset>';
fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated at public/sitemap.xml');
