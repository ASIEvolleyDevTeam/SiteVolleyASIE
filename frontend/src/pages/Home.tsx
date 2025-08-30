import MatchSchedule from '../components/MatchSchelude';
import { AdminProvider } from '../context/AdminProvider';

export const Home = () => {
  return (
    <main className="flex min-h-[calc(100vh-142px)] flex-col lg:flex-row">
      <section className="flex flex-col items-center justify-center p-8 text-center lg:w-1/2">
        <h1 className="mb-4 text-4xl font-bold">A.S.I.E. Volley</h1>
        <p className="text-xl italic">
          L'association de volley inter-entreprises de Sophia Antipolis
        </p>
      </section>
      <div className="flex items-center justify-center p-8 lg:w-1/2">
        <section className="bg-base-200 rounded-xl p-8 shadow">
          <h2 className="mb-6 text-center text-4xl font-bold">
            Prochains matchs
          </h2>
          <div className="bg-warning/20 border-warning text-warning-800 rounded border-l-4 px-4 py-3 text-base">
            <span className="font-semibold">Important :</span> Si un match n'est
            pas annoncé ici, vous ne serez pas prioritaires pour jouer vis-à-vis
            de joueurs ayant prévu de s'entrainer !
            <br />
          </div>
          <AdminProvider>
            <MatchSchedule />
          </AdminProvider>
          <p className="text-center">
            Pour toute question contactez Clément avec l'adresse mail{' '}
            <a
              href="mailto:asievolley06@googlegroups.com"
              className="underline"
            >
              asievolley06@googlegroups.com
            </a>
            !
          </p>
        </section>
      </div>
    </main>
  );
};

export default Home;
