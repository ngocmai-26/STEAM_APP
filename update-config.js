const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'build/asset-manifest.json');
const configPath = path.join(__dirname, 'app-config.json');
const appJsonPath = path.join(__dirname, 'app.json');

if (!fs.existsSync(manifestPath)) {
  console.error('❌ Build folder not found! Run "npm run build" first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entrypoints = manifest.entrypoints || [];

const css = entrypoints.filter(f => f.endsWith('.css'));
const js = entrypoints.filter(f => f.endsWith('.js'));

if (css.length === 0 || js.length === 0) {
  console.error('❌ No CSS or JS files found in build!');
  process.exit(1);
}

const config = {
  app: {
    title: "STEAM AI App",
    headerTitle: "STEAM AI",
    headerColor: "#4285F4",
    textColor: "white",
    leftButton: "back",
    statusBar: "normal",
    actionBarHidden: false,
    hideAndroidBottomNavigationBar: false,
    hideIOSSafeAreaBottom: false
  },
  listCSS: css,
  listSyncJS: js,
  listAsyncJS: []
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
fs.writeFileSync(appJsonPath, JSON.stringify(config, null, 2));

console.log('✅ Config files updated successfully!');
console.log('📄 CSS files:', css);
console.log('📄 JS files:', js);

