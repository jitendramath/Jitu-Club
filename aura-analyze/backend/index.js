const http = require('http');
const admin = require('firebase-admin');

// 1. Firebase Service Account (Secret File से लोड हो रहा है)
// रेंडर पर तुमने इसे 'serviceAccountKey.json' नाम से अपलोड किया है
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// 2. WinGo 30S API URL
const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json";

// 3. डेटा सिंक करने वाला फंक्शन (Maths logic for stats)
async function syncData() {
  console.log(`[${new Date().toLocaleTimeString()}] 🔄 Syncing Live Data...`);
  
  try {
    const response = await fetch(`${API_URL}?ts=${Date.now()}`);
    if (!response.ok) throw new Error('API fetch failed');
    
    const json = await response.json();
    const list = json.data.list;

    const batch = db.batch();
    
    list.forEach(item => {
      const periodId = item.issueNumber;
      const num = parseInt(item.number);
      
      // ✅ Size & Color Logic
      const size = num <= 4 ? "Small" : "Big";
      let colorShort = "R";
      if (item.color.includes('green')) colorShort = "G";
      if (item.color.includes('violet')) colorShort = "V";

      const docRef = db.collection('history').doc(periodId);
      
      // Firestore में डेटा डालना (merge: true ताकि डुप्लीकेट न हों)
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
    console.log(`✅ Data Batch Synced: ${list.length} rounds.`);

  } catch (error) {
    console.error("❌ Syncer Error:", error.message);
  }
}

// 4. रेंडर के लिए हेल्थ चेक सर्वर (इसे चालू रखना ज़रूरी है)
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Aura Engine is Running...');
}).listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));

// 5. हर 25 सेकंड में सिंक करें (Daman 30s Game)
setInterval(syncData, 25000);
syncData(); 
