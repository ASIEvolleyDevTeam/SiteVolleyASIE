import { AddResultForm } from '../components/AddResultForm';
import ResultsTable from '../components/tables/ResultsTable';
import { SuperAdminProvider } from '../context/SuperAdminProvider';
import { SuperAdminLogin } from '../components/SuperAdminLogin';
export const Admin = () => {
  return (
    <>
      <h1 className="mb-4 p-8 text-center text-4xl font-bold">
        Panneau d'administrateur tests
      </h1>
      <SuperAdminProvider>
        <SuperAdminLogin />
        <AddResultForm />
      </SuperAdminProvider>
      <ResultsTable />
    </>
  );
};
export default Admin;
