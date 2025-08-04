import UpcomingMatchesTable from '../components/tables/UpcomingMatchesTable';

export const Home = () => {
  return (
    <main className="flex min-h-[calc(100vh-85px)] flex-col lg:flex-row">
      <section className="flex flex-col items-center justify-center p-8 text-center lg:w-1/2">
        <h1 className="mb-4 text-4xl font-bold">A.S.I.E. Volley</h1>
        <p className="text-xl italic">
          "Le volley inter-entreprises, ensemble c'est mieux."
        </p>
      </section>
      <section className="lg:w-1/2">
        <h2 className="mb-4 pt-8 text-center text-2xl font-semibold">
          Prochains matches
        </h2>
        <UpcomingMatchesTable />
      </section>
    </main>
  );
};

export default Home;
