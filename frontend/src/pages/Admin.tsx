import { AddResultForm } from '../components/AddResultForm';
import { PostponeForm } from '../components/PostponeForm';

import ResultsTable from '../components/tables/ResultsTable';
import { SuperAdminProvider } from '../context/SuperAdminProvider';
import { SuperAdminLogin } from '../components/SuperAdminLogin';

export const Admin = () => {
  return (
    <>
      <h1 className="mb-4 p-8 text-center text-4xl font-bold">
        Panneau d'administrateur
      </h1>
      <SuperAdminProvider>
        <SuperAdminLogin />
        <h2 className="bg-base-200 p-2 text-center text-2xl font-bold">Ajouter les scores d'un match</h2>
        <AddResultForm />
        <h2 className="bg-base-200 p-2 text-center text-2xl font-bold">Mettre un match en attente</h2>
        <PostponeForm />
      </SuperAdminProvider>
      <ResultsTable />
    </>
  );
};
export default Admin;
