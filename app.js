const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

// Substitua com o caminho para o seu arquivo de credenciais do Firebase Admin SDK
const serviceAccount = require('./path/to/your-firebase-adminsdk.json');

// Inicializa o Firebase Admin com suas credenciais
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Substitua com a URL do seu banco de dados Firebase
  databaseURL: 'https://your-database-url.firebaseio.com'
});

const db = admin.database();
const app = express();

// Servir o arquivo HTML estático
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para detecção de bots de pré-visualização
app.get('/detect-bot', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const previewBots = ['WhatsApp', 'facebookexternalhit'];

  // Verifica se o user-agent corresponde a algum dos bots de pré-visualização
  const isPreviewBot = previewBots.some(bot => userAgent.includes(bot));

  if (isPreviewBot) {
    // Gera um identificador único para a detecção
    const detectionId = db.ref().child('preview_bots').push().key;

    // Salva a detecção no Firebase
    db.ref(`preview_bots/${detectionId}`).set({
      userAgent: userAgent,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    res.status(200).send('Bot de pré-visualização detectado');
  } else {
    res.status(200).send('Usuário normal detectado');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
