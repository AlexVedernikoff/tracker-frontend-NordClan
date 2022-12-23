export const sortAlphabetically = <Obj extends object, Key extends keyof OnlyStringValues<Obj>>(ar: Obj[], keyToSortBy: Key): Obj[] => {
    const collator = Intl.Collator();
    const sortProjects = [...ar].sort((a, b) => collator.compare(a[keyToSortBy as string], b[keyToSortBy as string]));
    return sortProjects;
};


type OnlyStringValues<Obj extends object> = {
    [Key in keyof Obj as Obj[Key] extends string ? Key : never]: Obj[Key];
};