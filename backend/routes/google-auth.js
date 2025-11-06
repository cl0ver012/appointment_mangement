const express = require('express');
const router = express.Router();
const googleCalendar = require('../services/googleCalendar');

/**
 * Google OAuth routes for initial setup
 */

// Get authorization URL
router.get('/auth/google', (req, res) => {
  try {
    const authUrl = googleCalendar.getAuthUrl();
    res.json({ 
      success: true, 
      authUrl,
      message: 'Visit this URL to authorize the application' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// OAuth callback
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('Authorization code not provided');
    }

    const tokens = await googleCalendar.getTokenFromCode(code);
    
    res.send(`
      <html>
        <body>
          <h2>✅ Authorization Successful!</h2>
          <p>Add these to your .env file:</p>
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
          </pre>
          <p>You can close this window.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <html>
        <body>
          <h2>❌ Authorization Failed</h2>
          <p>Error: ${error.message}</p>
        </body>
      </html>
    `);
  }
});

module.exports = router;

