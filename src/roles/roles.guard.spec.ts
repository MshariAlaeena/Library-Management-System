import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let rolesGuard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  // Add more tests as needed...
});
