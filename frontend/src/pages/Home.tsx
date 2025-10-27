import React, { useEffect, useState } from 'react';
import { getCandidates, castVote } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Candidate {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await getCandidates();
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    if (isAuthenticated) {
      fetchCandidates();
    }
  }, [isAuthenticated]);

  const handleVote = async (candidateId: number) => {
    if (!isAuthenticated) {
      alert('Please log in to vote.');
      return;
    }
    try {
      await castVote(candidateId);
      alert('Vote cast successfully!');
      // Optionally refresh candidates or show updated results
    } catch (error: any) {
      console.error('Error casting vote:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.detail || 'You have already voted.');
      } else {
        alert('Failed to cast vote.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Candidates</h2>
      {!isAuthenticated && <p>Please log in to view candidates and vote.</p>}
      {isAuthenticated && candidates.length === 0 && <p>No candidates available.</p>}
      {isAuthenticated && candidates.length > 0 && (
        <div className="row">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{candidate.name}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleVote(candidate.id)}
                  >
                    Vote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
