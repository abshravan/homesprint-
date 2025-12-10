"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const connection_1 = require("../database/connection");
class UserService {
    constructor() {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = (0, connection_1.getDatabase)();
    }
    getAll() {
        return this.db.prepare('SELECT * FROM users ORDER BY display_name').all();
    }
    getById(id) {
        return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }
    getByUsername(username) {
        return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    }
    create(user) {
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
        return this.getById(info.lastInsertRowid);
    }
    // Mock login - just returns the user if exists, or creates a default one if it's the first run
    login(username) {
        const user = this.getByUsername(username);
        if (user)
            return user;
        // If no users exist, create admin
        const count = this.db.prepare('SELECT COUNT(*) as count FROM users').get();
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
exports.UserService = UserService;
