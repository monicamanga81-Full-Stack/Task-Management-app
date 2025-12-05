import { Injectable, Logger } from '@nestjs/common';
import Redis, { Redis as IORedis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  public publisher: IORedis | null = null;
  public subscriber: IORedis | null = null;

  constructor() {
    try {
      this.publisher = new Redis({ host: 'localhost', port: 6379 });
      this.publisher.on('error', (err) => {
        this.logger.warn(`Redis publisher error: ${err?.message ?? err}`);
      });

      this.subscriber = new Redis({ host: 'localhost', port: 6379 });
      this.subscriber.on('error', (err) => {
        this.logger.warn(`Redis subscriber error: ${err?.message ?? err}`);
      });

      // Optional: log successful connect
      this.publisher.on('connect', () => this.logger.log('Redis publisher connected'));
      this.subscriber.on('connect', () => this.logger.log('Redis subscriber connected'));
    } catch (err) {
      this.logger.warn('Failed to initialize Redis clients, continuing without Redis');
      this.publisher = null;
      this.subscriber = null;
    }
  }

  async publish(channel: string, message: any) {
    if (!this.publisher) {
      this.logger.debug('Publish skipped: Redis publisher not available');
      return;
    }

    try {
      await this.publisher.publish(channel, JSON.stringify(message));
    } catch (err) {
      this.logger.warn(`Failed to publish to Redis channel ${channel}: ${err?.message ?? err}`);
    }
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    if (!this.subscriber) {
      this.logger.debug('Subscribe skipped: Redis subscriber not available');
      return;
    }

    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (_, message) => {
        try {
          callback(JSON.parse(message));
        } catch (err) {
          this.logger.warn(`Failed to parse Redis message: ${err?.message ?? err}`);
        }
      });
    } catch (err) {
      this.logger.warn(`Failed to subscribe to Redis channel ${channel}: ${err?.message ?? err}`);
    }
  }
}
