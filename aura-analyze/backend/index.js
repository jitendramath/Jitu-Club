const http = require('http');
const admin = require('firebase-admin');

// 1. Firebase Service Account Load
// ध्यान दें: अपनी serviceAccountKey.json फाइल इसी फोल्डर में रखें
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// 2. API URL (30 Seconds WinGo)
const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json";

// 3. Sync Engine
async function syncData() {
  console.log(`[${new Date().toLocaleTimeString()}] 🔄 Fetching latest data...`);
  
  try {
    // कैश से बचने के लिए टाइमस्टैम्प का उपयोग
    const response = await fetch(`${API_URL}?ts=${Date.now()}`);
    if (!response.ok) throw new Error('API connection failed');
    
    const json = await response.json();
    const list = json.data.list;

    const batch = db.batch();
    
    list.forEach(item => {
      const periodId = item.issueNumber;
      const num = parseInt(item.number);
      
      // ✅ "Golden Rule" Logic: Size & Color Calculation
      const size = num <= 4 ? "Small" : "Big";
      let colorShort = "R"; // Default Red
      if (item.color.includes('green')) colorShort = "G";
      if (item.color.includes('violet')) colorShort = "V";

      const docRef = db.collection('history').doc(periodId);
      
      // merge: true ताकि पुराने डेटा पर असर न पड़े
      batch.set(docRef, {
        period: periodId,
        number: num,
        size: size,
        color: colorShort,
        rawColor: item.color,
        premium: item.premium,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    await batch.commit();
    console.log(`✅ Synced ${list.length} rounds successfully.`);

  } catch (error) {
    console.error("❌ Sync Error:", error.message);
  }
}

// 4. Render Health Check Server
// रेंडर को लाइव रखने के लिए एक छोटा सर्वर ज़रूरी है
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Aura Syncer 3.0 is Active');
}).listen(PORT, () => console.log(`🚀 Syncer running on port ${PORT}`));

// 5. Execution Loop (Every 25 seconds)
// डामन 30s का है, इसलिए 25s पर सिंक करना सेफ है
setInterval(syncData, 25000);
syncData(); // स्टार्टअप पर तुरंत रन करें
