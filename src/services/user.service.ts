import { getDatabase } from '../lib/database';
import { User, CreateUserDto } from '../shared/types/user.types';
import { CreateUserDtoSchema } from '../shared/validation/user.validation';

export class UserService {
    private db = getDatabase();

    async getAll(): Promise<User[]> {
        const users = await this.db.getAll('users');
        return users.sort((a, b) => a.display_name.localeCompare(b.display_name));
    }

    async getById(id: number): Promise<User | undefined> {
        return await this.db.getById('users', id);
    }

    async getByUsername(username: string): Promise<User | undefined> {
        return await this.db.getByIndex('users', 'username', username);
    }

    async create(user: CreateUserDto): Promise<User> {
        // Validate input
        const validatedUser = CreateUserDtoSchema.parse(user);

        const now = new Date().toISOString();
        const userData = {
            ...validatedUser,
            role: validatedUser.role || 'member',
            created_at: now,
            updated_at: now,
        };

        const id = await this.db.add('users', userData);
        const createdUser = await this.getById(id);

        if (!createdUser) {
            throw new Error('Failed to create user: Could not retrieve created user');
        }

        return createdUser;
    }

    // Mock login - just returns the user if exists, or creates a default one if it's the first run
    async login(username: string): Promise<User> {
        const user = await this.getByUsername(username);
        if (user) return user;

        // If no users exist, create admin
        const count = await this.db.count('users');
        if (count === 0) {
            return await this.create({
                username,
                display_name: 'Admin User',
                role: 'admin',
            });
        }

        throw new Error('User not found');
    }
}

// Singleton instance
let userServiceInstance: UserService | null = null;

export function getUserService(): UserService {
    if (!userServiceInstance) {
        userServiceInstance = new UserService();
    }
    return userServiceInstance;
}
