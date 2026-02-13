import { connect } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { envValidation } from '../config/env.config';

export async function seedDefaultAdmin() {
  const cfg = envValidation();
  await connect(cfg.mongoUri as string);

  const tenantColl = (await import('../tenants/tenant.schema')).Tenant;
  // use mongoose directly for simplicity
  const mongoose = await import('mongoose');
  const TenantModel = mongoose.model('Tenant', (await import('../tenants/tenant.schema')).TenantSchema);
  const UserModel = mongoose.model('User', (await import('../users/schemas/user.schema')).UserSchema);

  const tenant = await TenantModel.findOne({ domain: 'default' });
  let tenantId;
  if (!tenant) {
    const t = await TenantModel.create({ name: 'Default Tenant', domain: 'default' });
    tenantId = t._id;
  } else {
    tenantId = tenant._id;
  }

  const admin = await UserModel.findOne({ email: 'admin@example.com' });
  if (!admin) {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    await UserModel.create({ email: 'admin@example.com', firstName: 'Super', lastName: 'Admin', password: hashed, tenantId, roles: ['admin'], isSuperAdmin: true });
    console.log('Default admin user created: admin@example.com / Admin@1234');
  }
}
