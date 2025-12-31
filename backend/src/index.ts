import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import authRoutes from './routes/auth';
import walletRoutes from './routes/wallet';
import ledgerRoutes from './routes/ledger';
import paymentRoutes from './routes/payment';
import streamingRoutes from './routes/streaming';
import subscriptionRoutes from './routes/subscription';
import agentRoutes from './routes/agent';
import complianceRoutes from './routes/compliance';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Morgan middleware to pipe logs to winston
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms',
        {
            stream: {
                write: (message) => logger.http(message.trim()),
            },
        }
    )
);

app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/ledger', ledgerRoutes);
app.use('/payment', paymentRoutes);
app.use('/streaming', streamingRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/agent', agentRoutes);
app.use('/compliance', complianceRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});

export default app;
