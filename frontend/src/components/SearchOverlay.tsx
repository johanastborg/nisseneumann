import { useState } from 'react';

interface SearchOverlayProps {
    onSearch: (query: string) => void;
    loading: boolean;
}

export function SearchOverlay({ onSearch, loading }: SearchOverlayProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            padding: '2rem',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10
        }}>
            <form
                onSubmit={handleSubmit}
                style={{ pointerEvents: 'auto', display: 'flex', gap: '1rem' }}
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a physics question..."
                    style={{
                        padding: '1rem',
                        fontSize: '1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.9)',
                        width: '400px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: loading ? '#666' : '#646cff',
                        color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    {loading ? 'Thinking...' : 'Ask'}
                </button>
            </form>
        </div>
    );
}
