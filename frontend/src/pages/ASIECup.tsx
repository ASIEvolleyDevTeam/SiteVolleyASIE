import CupBracketTable from '../components/tables/CupBracketTable';
export const ASIECup = () => {
  return (
    <main className="mx-auto">
      <h1 className="mb-8 p-8 text-center text-4xl font-bold">
        Coupe A.S.I.E. Volley
      </h1>
      <div className="lg:mx-auto lg:max-w-5xl lg:overflow-x-auto lg:p-8">
        <CupBracketTable />
      </div>
      <h2 className="mb-8 pt-8 text-center text-4xl font-bold">Hall of Fame</h2>
      <div className="mx-auto max-w-4xl overflow-x-auto p-8">
        <table className="table">
          <thead className="bg-base-300 text-center">
            <tr>
              <th>Année</th>
              <th>Equipe</th>
            </tr>
          </thead>
          <tbody className="bg-base-200 text-center">
            <tr>
              <td>2013-2014</td>
              <td>NVIDIA A</td>
            </tr>
            <tr>
              <td>2014-2015</td>
              <td>NVIDIA B</td>
            </tr>
            <tr>
              <td>2015-2016</td>
              <td>??? (si vous savez vous souvenez : mail!)</td>
            </tr>
            <tr>
              <td>2016-2017</td>
              <td>Intel Low Power</td>
            </tr>
            <tr>
              <td>2017-2018</td>
              <td>Amadeus 1</td>
            </tr>
            <tr>
              <td>2018-2019</td>
              <td>Ausy</td>
            </tr>
            <tr>
              <td>2019-2020</td>
              <td>COVID</td>
            </tr>
            <tr>
              <td>2020-2021</td>
              <td>COVID</td>
            </tr>
            <tr>
              <td>2021-2022</td>
              <td>Thales 1</td>
            </tr>
            <tr>
              <td>2022-2023</td>
              <td>ST Micro</td>
            </tr>
            <tr>
              <td>2023-2024</td>
              <td>Pas de gymnase ?</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ASIECup;
