/**
 * WCAG 2.2 Contrast Testing Script
 * Tests color combinations against WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
 */

// Simple contrast ratio calculator
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

interface ContrastTest {
  component: string;
  variant: string;
  foreground: string;
  background: string;
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
  notes?: string;
}

// Color definitions from globals.css
const colors = {
  light: {
    text: '#1d1d1f',
    textSecondary: '#6e6e73',
    accent: '#0056b3', // Updated for WCAG compliance
    glassBg: 'rgba(242, 242, 247, 0.8)', // Approximated as #f2f2f7
    white: '#ffffff',
    background: '#f0f2f5'
  },
  dark: {
    text: '#f5f5f7',
    textSecondary: '#8e8e93',
    accent: '#1A6DBF', // Updated for WCAG compliance
    glassBg: 'rgba(28, 28, 30, 0.75)', // Approximated as #1c1c1e
    white: '#ffffff',
    background: '#121212'
  }
};

// Tests to run
const tests: ContrastTest[] = [];

console.log('🎨 KVideo WCAG 2.2 Contrast Testing Report\n');
console.log('='.repeat(80));
console.log('\n');

// Badge Tests
console.log('📛 BADGE COMPONENT\n');

// Badge Primary (Light Mode)
let ratio = getContrastRatio(colors.light.white, colors.light.accent);
tests.push({
  component: 'Badge',
  variant: 'Primary (Light)',
  foreground: 'white',
  background: colors.light.accent,
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7
});
console.log(`  Primary (Light): ${colors.light.white} on ${colors.light.accent}`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// Badge Primary (Dark Mode)
ratio = getContrastRatio(colors.dark.white, colors.dark.accent);
tests.push({
  component: 'Badge',
  variant: 'Primary (Dark)',
  foreground: 'white',
  background: colors.dark.accent,
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7
});
console.log(`  Primary (Dark): ${colors.dark.white} on ${colors.dark.accent}`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// Badge Secondary (Light Mode)
ratio = getContrastRatio(colors.light.text, '#f2f2f7'); // glass-bg approximation
tests.push({
  component: 'Badge',
  variant: 'Secondary (Light)',
  foreground: colors.light.text,
  background: '#f2f2f7',
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7,
  notes: 'Glass background approximated as solid color'
});
console.log(`  Secondary (Light): ${colors.light.text} on #f2f2f7`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// Button Tests
console.log('🔘 BUTTON COMPONENT\n');

// Button Primary (Light Mode)
ratio = getContrastRatio(colors.light.white, colors.light.accent);
tests.push({
  component: 'Button',
  variant: 'Primary (Light)',
  foreground: 'white',
  background: colors.light.accent,
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7
});
console.log(`  Primary (Light): white on ${colors.light.accent}`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// Button Secondary (Light Mode)
ratio = getContrastRatio(colors.light.text, '#f2f2f7');
tests.push({
  component: 'Button',
  variant: 'Secondary (Light)',
  foreground: colors.light.text,
  background: '#f2f2f7',
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7
});
console.log(`  Secondary (Light): ${colors.light.text} on #f2f2f7`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// TypeBadges Tests
console.log('🏷️  TYPE BADGES COMPONENT\n');

// Selected state (Light Mode)
ratio = getContrastRatio(colors.light.white, colors.light.accent);
tests.push({
  component: 'TypeBadges',
  variant: 'Selected (Light)',
  foreground: 'white',
  background: colors.light.accent,
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7
});
console.log(`  Selected (Light): white on ${colors.light.accent}`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// Unselected state (Light Mode)
ratio = getContrastRatio(colors.light.text, '#f2f2f7');
tests.push({
  component: 'TypeBadges',
  variant: 'Unselected (Light)',
  foreground: colors.light.text,
  background: '#f2f2f7',
  ratio: ratio,
  passAA: ratio >= 4.5,
  passAAA: ratio >= 7
});
console.log(`  Unselected (Light): ${colors.light.text} on #f2f2f7`);
console.log(`  Ratio: ${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? '✅ PASS AA' : '❌ FAIL AA'}`);
console.log('');

// Summary
console.log('\n');
console.log('='.repeat(80));
console.log('\n📊 SUMMARY\n');

const totalTests = tests.length;
const passedAA = tests.filter(t => t.passAA).length;
const passedAAA = tests.filter(t => t.passAAA).length;

console.log(`Total tests: ${totalTests}`);
console.log(`AA Standard (4.5:1): ${passedAA}/${totalTests} passed (${((passedAA/totalTests)*100).toFixed(1)}%)`);
console.log(`AAA Standard (7:1): ${passedAAA}/${totalTests} passed (${((passedAAA/totalTests)*100).toFixed(1)}%)`);
console.log('');

if (passedAA < totalTests) {
  console.log('⚠️  Some color combinations need adjustment to meet WCAG AA standards.\n');
}

// Export results
const results = {
  timestamp: new Date().toISOString(),
  tests,
  summary: {
    total: totalTests,
    passedAA,
    passedAAA,
    failedAA: totalTests - passedAA
  }
};

console.log('Results exported to: contrast-test-results.json\n');

// This would write to file in a Node environment
// For browser, you'd use different storage methods
if (typeof require !== 'undefined') {
  const fs = require('fs');
  fs.writeFileSync(
    'contrast-test-results.json', 
    JSON.stringify(results, null, 2)
  );
}
