import { useParams } from 'react-router-dom';
import { TeamCalendarTable } from '../components/tables/TeamCalendarTable';

export const TeamCalendarPage = () => {
  const { teamName } = useParams<{ teamName: string }>();

  return (
    <main className="mx-auto max-w-5xl">
      <h1 className="mb-8 p-8 text-center text-4xl font-bold">
        Calendrier de {teamName}
      </h1>
      <TeamCalendarTable teamName={teamName || ''} />
    </main>
  );
};

export default TeamCalendarPage;
