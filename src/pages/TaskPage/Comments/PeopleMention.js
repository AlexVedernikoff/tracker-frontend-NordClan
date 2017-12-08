import React from 'react';
import Pt from 'prop-types';
const filterMembers = (projectMembers, nameFilter) => projectMembers.reduce((acc, member) => (~((member.fullNameRu || '').indexOf(nameFilter))
  ? [
    ...acc,
    {
      fullNameRu: member.fullNameRu,
      id: member.id
    }
  ]
  : acc), []);
export default function PeopleMention ({nameFilter, projectMembers}) {
  const matchedMembers = filterMembers(projectMembers, nameFilter);
  return (
    <div>
      Mention: { nameFilter }
      <ul>
        { matchedMembers.map((member) => <li>{member.fullNameRu}</li>) }
      </ul>
    </div>
  );
}

PeopleMention.propTypes = {
  nameFilter: Pt.string,
  projectMembers: Pt.array
};
