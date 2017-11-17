export default function getTypeById (typeId, typeDictionary) {
  const matchedType = (typeDictionary || []).find((type) => (type.id === typeId));

  return matchedType && matchedType.name || '';
}
