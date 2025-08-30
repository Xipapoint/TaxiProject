import { Test } from '@nestjs/testing';
import { LibNestjsModule } from './nestjs.module';

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('LibNestjsModule', () => {
  it('should compile the module', async () => {
    const mockConfigFactory = jest.fn().mockResolvedValue({
      type: 'sqlite',
      database: ':memory:',
    });

    const module = await Test.createTestingModule({
      imports: [LibNestjsModule.forRootAsync(mockConfigFactory)],
    }).compile();

    expect(module).toBeDefined();
  });
});
