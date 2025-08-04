import { useEffect, useState } from 'react';
import TableWrapper from '../TableWrapper';

type Contact = {
  team: string;
  player: string;
  mail: string;
};

export const ContactsTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/contacts`)
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <TableWrapper
      loading={loading}
      dataLength={contacts.length}
      emptyMessage="Aucun contact disponible."
    >
      <table className="bg-base-200 table w-full">
        <thead className="bg-base-300">
          <tr>
            <th>Equipe</th>
            <th>Joueur</th>
            <th>Mail</th>
          </tr>
        </thead>
        <tbody className="bg-base-200">
          {contacts.map((c, index) => (
            <tr key={index}>
              <td>{c.team}</td>
              <td>{c.player}</td>
              <td>
                <a
                  href={`mailto:${c.mail}`}
                  className="text-blue-600 underline"
                >
                  {c.mail}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};
export default ContactsTable;
