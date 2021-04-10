import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeService {
  async convertAmount({ from: string, to, amount }): Promise<any> {
    throw new Error();
  }
}
