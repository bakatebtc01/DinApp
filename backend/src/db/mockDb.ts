import logger from '../utils/logger';

// In-memory tables
const store: Record<string, any[]> = {
    users: [
        { id: '00000000-0000-0000-0000-000000000000', phone_country_code: '+000', phone_number: '000000000', is_verified: true, kyc_tier: 2, pin_hash: null, password_hash: null },
        {
            id: 'admin-001',
            phone_country_code: '+675',
            phone_number: '73067659',
            is_verified: true,
            kyc_tier: 2,
            pin_hash: null,
            // password_hash for '1234567q' (bcrypt hash)
            password_hash: '$2b$10$wT8KscgGf23w8C2k2S.UOuW/G9X/f7XpYk7H6fMh9H6Z9XwYwYwYy'
        }
    ],
    wallets: [
        { id: 'w1', user_id: '00000000-0000-0000-0000-000000000000', wallet_type: 'platform', currency: 'PGK', balance: 1000000.00, status: 'active' },
        { id: 'w2', user_id: '00000000-0000-0000-0000-000000000000', wallet_type: 'escrow', currency: 'PGK', balance: 0.00, status: 'active' },
        { id: 'w3', user_id: 'admin-001', wallet_type: 'personal', currency: 'PGK', balance: 500.00, status: 'active' }
    ],
    ledger_entries: [],
    kyc_verifications: [],
    agent_profiles: [],
    risk_profiles: [],
    escrow_records: [],
    vendor_reputation: []
};

/**
 * A very simple mock query runner that supports basic INSERT, SELECT, and UPDATE.
 * This is strictly for Sandbox/Dev without Docker.
 */
export const mockQuery = async (text: string, params: any[] = []): Promise<{ rows: any[] }> => {
    const queryWork = text.trim().toLowerCase();

    logger.debug(`[MOCK DB] Query: ${text.substring(0, 50)}... | Params: ${JSON.stringify(params)}`);

    // Basic SELECT * FROM table WHERE ...
    if (queryWork.startsWith('select')) {
        const tableName = queryWork.split('from ')[1]?.split(' ')[0]?.split(';')[0];
        let rows = [...(store[tableName] || [])];

        // Simple WHERE filters (e.g. phone_number = $1)
        if (queryWork.includes('where')) {
            const filters = queryWork.split('where ')[1].split(' order by')[0].split(' limit')[0].split(' and ');
            rows = rows.filter(row => {
                return filters.every(f => {
                    const [col, placeholder] = f.split(' = ').map(s => s.trim());
                    if (!placeholder || !placeholder.startsWith('$')) return true;
                    const paramIdx = parseInt(placeholder.substring(1)) - 1;
                    return row[col] == params[paramIdx];
                });
            });
        }

        return { rows };
    }

    // Basic INSERT INTO table (...) VALUES (...)
    if (queryWork.startsWith('insert into')) {
        const tableName = queryWork.split('insert into ')[1].split(' ')[0];
        const columns = text.split('(')[1].split(')')[0].split(',').map(s => s.trim());

        const newRow: any = {};
        columns.forEach((col, i) => {
            const val = params[i];
            newRow[col] = val;
        });

        if (!newRow.id) newRow.id = `mock-${Date.now()}`;
        if (!store[tableName]) store[tableName] = [];
        store[tableName].push(newRow);

        return { rows: [newRow] };
    }

    // Basic UPDATE table SET col = $1 WHERE id = $2
    if (queryWork.startsWith('update')) {
        const tableName = queryWork.split('update ')[1].split(' ')[0];
        const rows = store[tableName] || [];

        // This is a very loose implementation
        rows.forEach(row => {
            // Find which rows to update based on WHERE (if id is available)
            // For MVP mock, we just update the first one that matches any WHERE param
            // Or just update all for now if it's a simple test
            if (queryWork.includes('where id = $')) {
                const idParamIdx = parseInt(text.split('where id = $')[1].split(' ')[0]) - 1;
                if (row.id == params[idParamIdx]) {
                    // Apply SETs
                    const sets = text.toLowerCase().split('set ')[1].split(' where')[0].split(',');
                    sets.forEach(s => {
                        const [col, placeholder] = s.split('=').map(x => x.trim());
                        if (placeholder.startsWith('$')) {
                            const valIdx = parseInt(placeholder.substring(1)) - 1;
                            row[col] = params[valIdx];
                        }
                    });
                }
            }
        });

        return { rows: [] };
    }

    return { rows: [] };
};
