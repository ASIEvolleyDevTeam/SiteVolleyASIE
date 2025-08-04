import ContactsTable from '../components/tables/ContactTable';

export const Contact = () => {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="pb-8 text-center text-4xl font-bold">
        Contact des équipes A.S.I.E.
      </h1>
      <ContactsTable />
    </main>
  );
};

export default Contact;
