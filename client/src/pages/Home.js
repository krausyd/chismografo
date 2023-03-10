import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtsList from '../components/ThoughtsList';

const Home = () => {
  const {loading, data} = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];
  console.log(thoughts);
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          { loading ? (
            <div>Loading ... </div>
          ) : (
            <ThoughtsList thoughts={thoughts} title="Some Feed for thoughts..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
