import React, { useState } from 'react';
import BACKEND_API from '../api.ts';
interface Metric {
    time_seconds: number;
    tokens: number;
    cost_estimate: number;
}

interface Source {
    text: string;
    metadata: {
        title: string;
        source: string;
        chunk_index: number;
    };
}

interface QueryResponse {
    answer: string;
    sources: Source[];
    metrics: Metric;
}

const QueryPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<QueryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiBase = BACKEND_API;

    const handleQuery = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${apiBase}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            if (res.ok) {
                const data = await res.json();
                setResponse(data);
            } else {
                throw new Error('Query failed');
            }
        } catch (err) {
            setError('Error fetching answer. Is the backend running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderAnswer = (text: string) => {
        const parts = text.split(/(\[\d+\])/g);
        return parts.map((part, i) => {
            if (part.match(/\[\d+\]/)) {
                return <span key={i} className="citation">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="container">
            <div className="card">
                <h2>🔍 Ask Knowledge Base</h2>
                <div className="query-section">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Ask a question about your added information..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                        />
                        <button className="btn" onClick={handleQuery} disabled={loading || !query.trim()}>
                            {loading ? <span className="loading-spinner"></span> : 'Search'}
                        </button>
                    </div>

                    {error && (
                        <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <div className="answer-area">
                        {response ? (
                            <>
                                <div className="answer-text">
                                    {renderAnswer(response.answer)}
                                </div>

                                <div className="metrics">
                                    <span>⏱️ {response.metrics.time_seconds}s</span>
                                    <span>🎫 {response.metrics.tokens} tokens</span>
                                    <span>💰 ~${response.metrics.cost_estimate}</span>
                                </div>

                                {/* <div className="sources-section">
                                    <h3>Retrieved Sources</h3>
                                    {response.sources.map((source, idx) => (
                                        <div key={idx} className="source-card">
                                            <div className="source-header">
                                                <span>[{idx + 1}] {source.metadata.title}</span>
                                                <span style={{ fontSize: '0.7rem' }}>Part {source.metadata.chunk_index}</span>
                                            </div>
                                            <p style={{ margin: 0 }}>{source.text}</p>
                                        </div>
                                    ))}
                                </div> */}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                                <p>Hello! Ask me anything based on the documents you've uploaded.</p>
                                <p style={{ fontSize: '0.8rem' }}>I will provide answers with inline citations from your data.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryPage;
