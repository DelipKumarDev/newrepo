import { envValidation } from '../src/config/env.config';

describe('envValidation', () => {
  const OLD = process.env;
  beforeEach(() => { process.env = { ...OLD }; });
  afterAll(() => { process.env = OLD; });

  it('throws when required env missing', () => {
    delete process.env.MONGO_URI;
    expect(() => envValidation()).toThrow();
  });

  it('returns config when set', () => {
    process.env.MONGO_URI = 'mongodb://x';
    process.env.JWT_SECRET = 'x';
    process.env.REFRESH_SECRET = 'y';
    process.env.NODE_ENV = 'test';
    const cfg = envValidation();
    expect(cfg.mongoUri).toBe('mongodb://x');
  });
});
