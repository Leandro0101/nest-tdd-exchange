import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService, ExchangeService } from './exchange.service';

const currenciesServiceMock = {
  getCurrency: jest.fn(),
};

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;
  beforeEach(async () => {
    currenciesServiceMock.getCurrency.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: CurrenciesService,
          useFactory: () => currenciesServiceMock,
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmont()', () => {
    it('should be throw if called with invalid params', async () => {
      await expect(service.convertAmount({ from: '', to: '', amount: 0 })).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('should be not throw if called with valid params', async () => {
      await expect(
        service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }),
      ).resolves.not.toThrow();
    });

    it('should be called getCurrency twice', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      await expect(currenciesService.getCurrency).toHaveBeenCalledTimes(2);
    });

    it('should be called getCurrency with correct params', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      await expect(currenciesService.getCurrency).toHaveBeenCalledWith('BRL');
      await expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('BRL');
    });

    it('should be throw when getCurrency throw', async () => {
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
      await expect(
        service.convertAmount({ from: 'INVALID', to: 'BRL', amount: 1 }),
      ).rejects.toThrow();
    });
  });
});
