require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notFoundMW = require('./middlewares/not-found');
const errorMW = require('./middlewares/error');
const rateLimitMW = require('./middlewares/rate-limit');
const authRoute = require('./routes/auth-route');
const profileRoute = require('./routes/profile-route');
const productRoute = require('./routes/product-route');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(rateLimitMW);
app.use(express.json());

app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/product', productRoute);

app.use(notFoundMW);
app.use(errorMW);

const PORT = process.env.PORT || '8888';
app.listen(PORT, () => console.log('SERVER RUNNING ON PORT:', PORT));
