import Queue from 'bull';
import WalletService from '../services/wallet.service';
import logger from '@shared/utils/logger';
import { container } from 'tsyringe';
import appConfig from '@config/app.config';

export class QueueService {
  private walletCreationQueue: Queue.Queue;
  private readonly defaultJobOptions: Queue.JobOptions;

  constructor() {
    this.walletCreationQueue = new Queue('wallet-creation', {
      redis: {
        host: appConfig.redis.host,
        port: appConfig.redis.port,
      },
    });

    this.defaultJobOptions = {
      attempts: Number(process.env.QUEUE_ATTEMPTS) || 3,
      backoff: {
        type: 'exponential',
        delay: Number(process.env.QUEUE_DELAY) || 5000,
      },
    };

    this.processWalletCreation();
  }

  public getWalletCreationQueue(): Queue.Queue {
    return this.walletCreationQueue;
  }

  /**
   * @param user
   * @param options
   */
  public async addWalletCreationJob(user: any, options?: Queue.JobOptions): Promise<void> {
    const jobOptions = { ...this.defaultJobOptions, ...options };
    await this.walletCreationQueue.add({ user }, jobOptions);
  }

  /**
   * @param users
   * @param options
   */
  public async addBulkWalletCreationJobs(users: any[], options?: Queue.JobOptions): Promise<void> {
    const jobs = users.map((user) => ({
      data: { user },
      opts: { ...this.defaultJobOptions, ...options },
    }));

    await this.walletCreationQueue.addBulk(jobs);
  }

  private processWalletCreation(): void {
    this.walletCreationQueue.process(async (job) => {
      const { user } = job.data;
      try {
        const walletService = container.resolve(WalletService);
        await walletService.createWallet(user);
        logger.info(`Wallet created successfully for user: ${user.email}`);
      } catch (error: any) {
        logger.error(
          { error: error.message, user },
          `Failed to create wallet for user: ${user.email}`
        );
        throw new Error(error.message);
      }
    });
  }
}