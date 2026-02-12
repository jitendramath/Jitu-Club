/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // बग्स पकड़ने के लिए स्ट्रिक्ट मोड ऑन रखें
  
  // अगर तुम भविष्य में Firebase Storage से इमेज दिखाना चाहो
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  // Apple-style स्मूथ परफॉरमेंस के लिए कुछ ऑप्टिमाइज़ेशन
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // प्रोडक्शन में कंसोल लॉग्स हटा दें
  },

  // सिक्योरिटी हेडर (Apple जैसी प्राइवेसी के लिए)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
