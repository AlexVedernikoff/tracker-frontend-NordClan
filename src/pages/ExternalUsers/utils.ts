import { ExternalUserType } from '~/constants/UsersProfile';
import localize from './ExternalUsers.json';

export const getExternalUserTypeOptions = (lang: string) => [
    { label: localize[lang].Client, value: ExternalUserType.Client },
    { label: localize[lang].Performer, value: ExternalUserType.Performer },
]