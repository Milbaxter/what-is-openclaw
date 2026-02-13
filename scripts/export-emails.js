#!/usr/bin/env node

/**
 * Export emails from Vercel logs to CSV
 * 
 * Usage:
 *   node scripts/export-emails.js < vercel-logs.txt > emails.csv
 * 
 * Or pipe directly:
 *   vercel logs askopenclaw.com --since=30d | node scripts/export-emails.js > emails.csv
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const emails = [];

// CSV header
console.log('Email,Timestamp,Source,IP,User Agent');

rl.on('line', (line) => {
  // Look for our structured log entries
  if (line.includes('EMAIL_SUBSCRIPTION:')) {
    try {
      // Extract JSON from log line
      const jsonStart = line.indexOf('{');
      if (jsonStart === -1) return;
      
      const jsonStr = line.substring(jsonStart);
      const data = JSON.parse(jsonStr);
      
      // Avoid duplicates
      if (emails.includes(data.email)) return;
      emails.push(data.email);
      
      // Escape CSV fields
      const escape = (str) => {
        if (!str) return '';
        str = String(str);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      
      // Output CSV row
      console.log([
        escape(data.email),
        escape(data.timestamp),
        escape(data.source),
        escape(data.ip),
        escape(data.userAgent)
      ].join(','));
      
    } catch (err) {
      // Skip malformed lines
    }
  }
});

rl.on('close', () => {
  // Done
  process.stderr.write(`\n✓ Exported ${emails.length} unique emails\n`);
});
