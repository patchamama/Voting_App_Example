import React, { useEffect, useState } from 'react';
import { getResults } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface VoteResult {
  candidate__name: string;
  total_votes: number;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<VoteResult[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getResults();
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated]);

  return (
    <div className="container mt-5">
      <h2>Voting Results</h2>
      {!isAuthenticated && <p>Please log in to view results.</p>}
      {isAuthenticated && results.length === 0 && <p>No results available yet.</p>}
      {isAuthenticated && results.length > 0 && (
        <ul className="list-group">
          {results.map((result, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {result.candidate__name}
              <span className="badge bg-primary rounded-pill">{result.total_votes}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;
