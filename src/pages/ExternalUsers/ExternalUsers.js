import React from 'react';
import ExternalUsersTable from './ExternalUsersTable';
import AddExternalUser from './AddExternalUser';

const ExternalUsers = () => (
  <section>
    <h1>Внешние пользователи</h1>
    <hr />
    <AddExternalUser />
    <ExternalUsersTable />
  </section>
);
export default ExternalUsers;
