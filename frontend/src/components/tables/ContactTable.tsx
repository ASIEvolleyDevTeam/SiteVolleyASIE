import { useEffect, useState } from 'react';

type Contact = {
  team: string;
  player: string;
  mail: string;
};

export const ContactsTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/contacts`)
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="bg-base-200 table w-full">
        <thead className="bg-base-300">
          <tr>
            <th>Equipe</th>
            <th>Joueur</th>
            <th>Mail</th>
          </tr>
        </thead>
        <tbody>
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
    </div>
  );
};
export default ContactsTable;
