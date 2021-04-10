import { BadRequestException, Injectable } from '@nestjs/common';

export class CurrenciesService {
  getCurrency(currency: string): Promise<any> {
    return null;
  }
}

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}
  async convertAmount({ from, to, amount }): Promise<any> {
    if (!from || !to || !amount) throw new BadRequestException();
    try {
      const currencyFrom = await this.currenciesService.getCurrency(from);
      const currencyTo = await this.currenciesService.getCurrency(to);
    } catch (error) {
      throw new Error(error);
    }
  }
}
