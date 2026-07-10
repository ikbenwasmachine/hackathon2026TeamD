// Cross-platform helper: copies .env.example to .env if .env doesn't exist yet.
// Used by the root "predev" script so a fresh clone can run `npm run dev`
// without manually creating env files first (Windows/macOS/Linux compatible).
const fs = require('fs');
const path = require('path');

const targets = [
	path.join(__dirname, '..', 'packages', 'database'),
	path.join(__dirname, '..', 'apps', 'elearning-portal'),
];

for (const dir of targets) {
	const envPath = path.join(dir, '.env');
	const examplePath = path.join(dir, '.env.example');

	if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
		fs.copyFileSync(examplePath, envPath);
		console.log(`Created ${path.relative(process.cwd(), envPath)} from .env.example`);
	}
}
