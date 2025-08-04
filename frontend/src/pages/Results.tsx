import ResultsTable from '../components/tables/ResultsTable';
export const Results = () => {
  return (
    <>
      <h1 className="mb-4 p-8 text-center text-4xl font-bold">
        Résultats des Matches
      </h1>
      <ResultsTable />
    </>
  );
};

export default Results;
