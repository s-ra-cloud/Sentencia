const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

let sentencingProc = null;
function startSentencingTree() {
  console.log('Starting Sentencing Tree Python backend...');
  sentencingProc = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: path.join(__dirname, 'sentencing-tree'),
    stdio: ['ignore', 'inherit', 'inherit']
  });
  sentencingProc.on('error', (err) => console.error('Sentencing Tree failed to start:', err));
  sentencingProc.on('exit', (code) => {
    console.log(`Sentencing Tree exited with code ${code}, restarting in 3s...`);
    setTimeout(startSentencingTree, 3000);
  });
}
startSentencingTree();
process.on('exit', () => { if (sentencingProc) sentencingProc.kill(); });

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.mp4', '.mp3', '.zip', '.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Trismegiste';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());

app.use('/sentencing-tree-app', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: { '^/sentencing-tree-app': '' },
  on: {
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) {
        res.status(503).send('<html><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2>Sentencing Choice Tree is starting up...</h2><p>The Python backend is loading. Please refresh this page in a few seconds.</p><script>setTimeout(()=>location.reload(),5000)</script></body></html>');
      }
    }
  }
}));

app.use(express.static('.'));

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS content (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const keys = ['outputs', 'members', 'funding', 'program', 'partners', 'team_descriptions'];
    for (const key of keys) {
      const existing = await client.query('SELECT 1 FROM content WHERE key = $1', [key]);
      if (existing.rows.length === 0) {
        const filePath = path.join(__dirname, 'data', `${key}.json`);
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          await client.query(
            `INSERT INTO content (key, data) VALUES ($1, $2)`,
            [key, JSON.stringify(data)]
          );
          console.log(`Seeded ${key} from JSON file`);
        }
      }
    }
  } finally {
    client.release();
  }
}

async function getData(key) {
  const result = await pool.query('SELECT data FROM content WHERE key = $1', [key]);
  if (result.rows.length > 0) {
    return result.rows[0].data;
  }
  return null;
}

async function setData(key, data) {
  await pool.query(
    `INSERT INTO content (key, data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
     ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
    [key, JSON.stringify(data)]
  );
  const filePath = path.join(__dirname, 'data', `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Saved ${key} to JSON file`);
}

function checkAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/outputs', async (req, res) => {
  try {
    res.json(await getData('outputs'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/team_descriptions', async (req, res) => {
  try {
    res.json(await getData('team_descriptions'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/outputs', checkAuth, async (req, res) => {
  try {
    await setData('outputs', req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    res.json(await getData('members'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/members', checkAuth, async (req, res) => {
  try {
    await setData('members', req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/funding', async (req, res) => {
  try {
    res.json(await getData('funding'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/funding', checkAuth, async (req, res) => {
  try {
    await setData('funding', req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/partners', async (req, res) => {
  try {
    const data = await getData('partners');
    res.json(data || { partners: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/partners', checkAuth, async (req, res) => {
  try {
    await setData('partners', req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/program', async (req, res) => {
  try {
    res.json(await getData('program'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/program', checkAuth, async (req, res) => {
  try {
    await setData('program', req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/export', checkAuth, async (req, res) => {
  try {
    const keys = ['outputs', 'members', 'funding', 'program', 'partners', 'team_descriptions'];
    const exportData = {};
    for (const key of keys) {
      exportData[key] = await getData(key);
    }
    exportData.exportedAt = new Date().toISOString();
    res.json(exportData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/import', checkAuth, async (req, res) => {
  try {
    const { outputs, members, funding, program, partners, team_descriptions } = req.body;
    if (outputs) await setData('outputs', outputs);
    if (members) await setData('members', members);
    if (funding) await setData('funding', funding);
    if (program) await setData('program', program);
    if (partners) await setData('partners', partners);
    if (team_descriptions) await setData('team_descriptions', team_descriptions);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/upload', checkAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      size: req.file.size
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/files', checkAuth, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR).map(filename => {
      const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stats.size,
        uploadedAt: stats.mtime
      };
    });
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/files/:filename', checkAuth, (req, res) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
  }
}));

initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
