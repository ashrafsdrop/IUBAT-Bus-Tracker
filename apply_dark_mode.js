const fs = require('fs');
const path = require('path');

const welcomePath = path.join(__dirname, 'src', 'screens', 'WelcomeScreen.tsx');
let welcome = fs.readFileSync(welcomePath, 'utf8');

// Replace WelcomeScreen styles
welcome = welcome.replace(/barStyle="dark-content"/g, 'barStyle="light-content"');
welcome = welcome.replace(/color: '#1E293B'/g, "color: '#F8FAFC'"); // Titles
welcome = welcome.replace(/color: '#64748B'/g, "color: '#94A3B8'"); // Subtitles
welcome = welcome.replace(/backgroundColor: '#FFFFFF'/g, "backgroundColor: '#1E293B'"); // Cards
welcome = welcome.replace(/borderColor: 'rgba\(20, 124, 65, 0.08\)'/g, "borderColor: 'rgba(255, 255, 255, 0.05)'");
welcome = welcome.replace(/backgroundColor: '#F1F5F9'/g, "backgroundColor: '#334155'");
welcome = welcome.replace(/borderTopColor: '#F1F5F9'/g, "borderTopColor: '#334155'");
// Fix double replace on footer text
welcome = welcome.replace(/color: '#94A3B8',\n    fontWeight: '600',\n    letterSpacing: 1,\n    opacity: 0.8/g, "color: '#64748B',\n    fontWeight: '600',\n    letterSpacing: 1,\n    opacity: 0.8");
fs.writeFileSync(welcomePath, welcome);

const seederPath = path.join(__dirname, 'src', 'screens', 'SeederScreen.tsx');
let seeder = fs.readFileSync(seederPath, 'utf8');
// Replace Tailwind classes
seeder = seeder.replace(/bg-\[#FCFBF8\]/g, 'bg-slate-900');
seeder = seeder.replace(/bg-white/g, 'bg-slate-800');
seeder = seeder.replace(/border-slate-100/g, 'border-slate-700/50');
seeder = seeder.replace(/text-slate-800/g, 'text-slate-100');
seeder = seeder.replace(/text-slate-600/g, 'text-slate-300');
seeder = seeder.replace(/text-slate-500/g, 'text-slate-400');
seeder = seeder.replace(/text-slate-400/g, 'text-slate-500');
seeder = seeder.replace(/bg-slate-50/g, 'bg-slate-800/80');
seeder = seeder.replace(/bg-slate-100/g, 'bg-slate-700');
seeder = seeder.replace(/bg-gray-100/g, 'bg-slate-700');
seeder = seeder.replace(/barStyle="dark-content"/g, 'barStyle="light-content"');
fs.writeFileSync(seederPath, seeder);

const mapPath = path.join(__dirname, 'src', 'screens', 'MapScreen.tsx');
let map = fs.readFileSync(mapPath, 'utf8');
// Replace MapScreen styling and remove toggle
map = map.replace(/bg-\[#FCFBF8\]\/95/g, 'bg-slate-900/95');
map = map.replace(/bg-white/g, 'bg-slate-800');
map = map.replace(/border-slate-100/g, 'border-slate-700/50');
map = map.replace(/text-slate-800/g, 'text-slate-100');
map = map.replace(/text-slate-400/g, 'text-slate-400');
map = map.replace(/text-\[#1E293B\]/g, 'text-slate-100');

// Remove the toggle button
map = map.replace(/<TouchableOpacity \n          onPress=\{[^>]+\n          className="w-10 h-10 bg-slate-800 items-center justify-center rounded-full shadow-sm" style=\{\{ elevation: 3 \}\}>\n          <Text className="text-white text-xl">\{isDarkMode \? "☀️" : "🌙"\}<\/Text>\n        <\/TouchableOpacity>/g, '<View className="w-10" />');

// Remove isDarkMode state entirely and just use true
map = map.replace(/const \[isDarkMode, setIsDarkMode\] = useState\(true\); \/\/ Default to Premium Dark Mode/g, 'const isDarkMode = true;');

fs.writeFileSync(mapPath, map);

console.log("Dark Mode applied globally!");
