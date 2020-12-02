import { useState } from "react";

function useModalState(initialState: boolean): [boolean, ()=>void, ()=>void] {
    const [state, setstate] = useState(initialState);
    const open = () => setstate(true);
    const close = () => setstate(false);
    return [state, open, close];
}

export default useModalState;