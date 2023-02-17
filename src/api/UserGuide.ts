import axios from 'axios';
import { API_URL } from '~/constants/Settings';
import { GuideHash, GuideName } from '~/guides/constants';

export type UserGuides = {
    userId: number,
    isVacationGuideCompleted: boolean,
    isOffTimeGuideCompleted: boolean,
    isSickLeaveGuideCompleted: boolean,
    isGuideModalShown: boolean
}

export const loadUserGuides = async (): Promise<UserGuides> => {
    const URL = `${API_URL}/guides`;
    const response = await axios.get(URL);

    if (response.status !== 200) {
        throw Error(`Fail status: ${response.status}`);
    }

    return response.data;
};

export const setUserGuides = async (guide: GuideHash): Promise<UserGuides> => {
    const URL = `${API_URL}/guides`;
    const response = await axios.put(URL, { guide: GuideName[guide] });

    if (response.status !== 200) {
        throw Error(`Fail status: ${response.status}`);
    }

    return response.data;
};
