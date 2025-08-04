import GlobalCalendarTable from '../components/tables/GlobalCalendarTable';

export const GlobalCalendar = () => {
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="mb-4 pt-8 text-center text-4xl font-bold">
        Calendrier Global
      </h1>
      <GlobalCalendarTable />
    </main>
  );
};

export default GlobalCalendar;
