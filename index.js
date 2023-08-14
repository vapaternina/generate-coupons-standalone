import 'dotenv/config';
import express from 'express';
import moment from 'moment-timezone';
import 'moment/locale/es.js';
import coupons from './coupons.controller.js';

moment.locale('es');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Running!');
});

app.use('/coupons', coupons);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});