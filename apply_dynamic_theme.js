const fs = require('fs');
const path = require('path');

// --- 1. Modify App.tsx ---
const appPath = path.join(__dirname, 'App.tsx');
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(
  "const [currentScreen, setCurrentScreen] = useState('Welcome');",
  "const [currentScreen, setCurrentScreen] = useState('Welcome');\n  const [isDarkMode, setIsDarkMode] = useState(false);"
);
app = app.replace(
  /<WelcomeScreen\s+onNavigate=\{\(screen\) => setCurrentScreen\(screen\)\}\s*\/>/,
  '<WelcomeScreen onNavigate={(screen) => setCurrentScreen(screen)} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />'
);
app = app.replace(
  /<SelectionScreen\s+onBack=\{\(\) => setCurrentScreen\('Welcome'\)\}\s+onNavigate=\{\(screen\) => setCurrentScreen\(screen\)\}\s*\/>/,
  '<SelectionScreen onBack={() => setCurrentScreen(\'Welcome\')} onNavigate={(screen) => setCurrentScreen(screen)} isDarkMode={isDarkMode} />'
);
app = app.replace(
  /<SeederScreen\s+onBack=\{\(\) => setCurrentScreen\('Welcome'\)\}\s*\/>/,
  '<SeederScreen onBack={() => setCurrentScreen(\'Welcome\')} isDarkMode={isDarkMode} />'
);
app = app.replace(
  /<MapScreen onBack=\{\(\) => setCurrentScreen\('Welcome'\)\} \/>/,
  '<MapScreen onBack={() => setCurrentScreen(\'Welcome\')} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />'
);
fs.writeFileSync(appPath, app);


// --- 2. Modify WelcomeScreen.tsx ---
const welcomePath = path.join(__dirname, 'src', 'screens', 'WelcomeScreen.tsx');
let welcome = fs.readFileSync(welcomePath, 'utf8');
welcome = welcome.replace(
  "const WelcomeScreen = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {",
  "const WelcomeScreen = ({ onNavigate, isDarkMode, setIsDarkMode }: { onNavigate?: (screen: string) => void, isDarkMode: boolean, setIsDarkMode: (val: boolean) => void }) => {"
);
// Add toggle button to header
welcome = welcome.replace(
  /<View style=\{styles\.header\}>/,
  `<View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setIsDarkMode(!isDarkMode)} 
            style={{ position: 'absolute', top: 0, right: 0, zIndex: 10, padding: 10, backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderRadius: 20, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}>
            <Text style={{ fontSize: 24 }}>{isDarkMode ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>`
);
// Make styles dynamic by checking isDarkMode in render
welcome = welcome.replace(/style=\{\[styles\.container, \{ paddingTop: insets\.top, paddingBottom: insets\.bottom \}\]\}/, 
  "style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: isDarkMode ? '#0F172A' : '#FEFDF5' }]}");
welcome = welcome.replace(/barStyle="light-content"/, "barStyle={isDarkMode ? 'light-content' : 'dark-content'}");
welcome = welcome.replace(/style=\{styles\.appNameText\}/, "style={[styles.appNameText, { color: isDarkMode ? '#F8FAFC' : '#1E293B' }]}");
welcome = welcome.replace(/style=\{styles\.subtitle\}/, "style={[styles.subtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}");
welcome = welcome.replace(/style=\{styles\.card\}/g, "style={[styles.card, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(20, 124, 65, 0.08)' }]}");
welcome = welcome.replace(/style=\{styles\.cardTitle\}/g, "style={[styles.cardTitle, { color: isDarkMode ? '#F8FAFC' : '#1E293B' }]}");
welcome = welcome.replace(/style=\{styles\.cardDescription\}/g, "style={[styles.cardDescription, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}");
welcome = welcome.replace(/style=\{styles\.arrowContainer\}/g, "style={[styles.arrowContainer, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}");
welcome = welcome.replace(/style=\{styles\.progressBarBg\}/g, "style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}");
welcome = welcome.replace(/style=\{styles\.liveIndicator\}/g, "style={[styles.liveIndicator, { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' }]}");
welcome = welcome.replace(/style=\{styles\.liveText\}/g, "style={[styles.liveText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}");
welcome = welcome.replace(/style=\{styles\.footerText\}/g, "style={[styles.footerText, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}");

fs.writeFileSync(welcomePath, welcome);


// --- 3. Modify MapScreen.tsx ---
const mapPath = path.join(__dirname, 'src', 'screens', 'MapScreen.tsx');
let map = fs.readFileSync(mapPath, 'utf8');
map = map.replace(
  "const MapScreen = ({ onBack }: { onBack?: () => void }) => {",
  "const MapScreen = ({ onBack, isDarkMode, setIsDarkMode }: { onBack?: () => void, isDarkMode: boolean, setIsDarkMode: (val: boolean) => void }) => {"
);
map = map.replace(
  "const isDarkMode = true;",
  ""
);
// Restore Toggle in header
map = map.replace(
  /<View className="w-10 h-10" \/>/g,
  `<TouchableOpacity 
          onPress={() => setIsDarkMode(!isDarkMode)} 
          className={"w-10 h-10 items-center justify-center rounded-full shadow-sm " + (isDarkMode ? "bg-slate-800" : "bg-white border border-slate-200")} style={{ elevation: 3 }}>
          <Text className="text-xl">{isDarkMode ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>`
);
// Dynamic tailwind for map header and card
map = map.replace(
  /className="flex-1 bg-slate-900\/95"/g,
  `className={"flex-1 " + (isDarkMode ? "bg-slate-900" : "bg-[#FCFBF8]")}`
);
map = map.replace(
  /className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 py-3 bg-slate-900\/95 border-b border-slate-700\/50"/g,
  `className={"absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 py-3 border-b " + (isDarkMode ? "bg-slate-900/95 border-slate-700/50" : "bg-[#FCFBF8]/95 border-slate-200")}`
);
map = map.replace(
  /className="w-10 h-10 bg-slate-800 items-center justify-center rounded-full border border-slate-700\/50 shadow-sm"/g,
  `className={"w-10 h-10 items-center justify-center rounded-full border shadow-sm " + (isDarkMode ? "bg-slate-800 border-slate-700/50" : "bg-white border-slate-200")}`
);
map = map.replace(
  /className="text-xl font-bold text-slate-100"/g,
  `className={"text-xl font-bold " + (isDarkMode ? "text-slate-100" : "text-slate-800")}`
);
map = map.replace(
  /className="absolute bottom-6 left-6 right-6 p-5 bg-slate-800 rounded-3xl shadow-lg border border-slate-700\/50"/g,
  `className={"absolute bottom-6 left-6 right-6 p-5 rounded-3xl shadow-lg border " + (isDarkMode ? "bg-slate-800 border-slate-700/50" : "bg-white border-slate-200")}`
);
map = map.replace(
  /className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1"/g,
  `className={"text-sm font-bold uppercase tracking-widest mb-1 " + (isDarkMode ? "text-slate-400" : "text-slate-500")}`
);
map = map.replace(
  /className="mt-4 pt-4 border-t border-slate-700\/50 flex-row items-center justify-center"/g,
  `className={"mt-4 pt-4 border-t flex-row items-center justify-center " + (isDarkMode ? "border-slate-700/50" : "border-slate-200")}`
);
fs.writeFileSync(mapPath, map);

console.log("Dynamic Theme script executed successfully!");
