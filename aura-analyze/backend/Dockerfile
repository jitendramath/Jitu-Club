# 1. Node.js का सबसे हल्का वर्जन (Slim) इस्तेमाल करें
FROM node:20-slim

# 2. वर्किंग डायरेक्टरी सेट करें
WORKDIR /usr/src/app

# 3. सिर्फ ज़रूरी पैकेज फाइल्स कॉपी करें
COPY package*.json ./

# 4. डिपेंडेंसीज़ इंस्टॉल करें
RUN npm install --production

# 5. बाकी सारा कोड कॉपी करें
COPY . .

# 6. रेंडर का पोर्ट एक्सपोज करें
EXPOSE 10000

# 7. सिंकर इंजन स्टार्ट करें
CMD [ "node", "index.js" ]
