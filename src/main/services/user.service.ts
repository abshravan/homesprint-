import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { User, CreateUserDto } from '../../shared/types/user.types';

export class UserService {
    private db: Database;

    constructor() {
        this.db = getDatabase();
    }

    getAll(): User[] {
        return this.db.prepare('SELECT * FROM users ORDER BY display_name').all() as User[];
    }

    getById(id: number): User | undefined {
        return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    }

    getByUsername(username: string): User | undefined {
        return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
    }

    create(user: CreateUserDto): User {
        const stmt = this.db.prepare(`
      INSERT INTO users (username, display_name, email, avatar_url, role)
      VALUES (@username, @display_name, @email, @avatar_url, @role)
    `);

        const info = stmt.run({
            username: user.username,
            display_name: user.display_name,
            email: user.email || null,
            avatar_url: user.avatar_url || null,
            role: user.role || 'member'
        });

        return this.getById(info.lastInsertRowid as number)!;
    }

    // Mock login - just returns the user if exists, or creates a default one if it's the first run
    login(username: string): User {
        const user = this.getByUsername(username);
        if (user) return user;

        // If no users exist, create admin
        const count = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
        if (count.count === 0) {
            return this.create({
                username,
                display_name: 'Admin User',
                role: 'admin'
            });
        }

        throw new Error('User not found');
    }
}
