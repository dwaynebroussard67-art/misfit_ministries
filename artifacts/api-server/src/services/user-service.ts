import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb, users } from '@workspace/db';
import { eq } from 'drizzle-orm';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'moderator' | 'user';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'moderator' | 'user';
  isActive?: boolean;
}

export class UserService {
  /**
   * Create a new user with hashed password
   */
  static async createUser(input: CreateUserInput) {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(input.password, 12);
    const db = await getDb();

    const newUser = await db.insert(users).values({
      id,
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
      role: input.role || 'user',
      isActive: 'true',
    });

    return { id, email: input.email, name: input.name, role: input.role || 'user' };
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return result[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string) {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }

  /**
   * Update user
   */
  static async updateUser(id: string, input: UpdateUserInput) {
    const updateData: any = {};
    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = input.email.toLowerCase();
    if (input.role) updateData.role = input.role;
    if (input.isActive !== undefined) updateData.isActive = input.isActive ? 'true' : 'false';

    const db = await getDb();
    await db.update(users).set(updateData).where(eq(users.id, id));
    return this.findById(id);
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers() {
    const db = await getDb();
    return db.select().from(users);
  }

  /**
   * Delete user (soft delete by deactivating)
   */
  static async deactivateUser(id: string) {
    const db = await getDb();
    await db.update(users).set({ isActive: 'false' }).where(eq(users.id, id));
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(id: string) {
    const db = await getDb();
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }
}
