import React, { useState } from 'react';
import ConfirmModal from '.';

function useConfirmModal<T>(text: string, onConfirm: (data?: T)=>void, initialData?: T): [React.ReactElement, (data?: T) => void] {
    const [confirmData, setConfirmData] = useState<T | undefined>(initialData);
    const [isOpenModal, setOpenModal] = useState(false);

    const openHandler = (data?: T): void => { setOpenModal(true); setConfirmData(data); };
    const closeHandler = (): void => { setOpenModal(false); onConfirm(confirmData); };

    const component = (
        <ConfirmModal
            isOpen={isOpenModal}
            contentLabel="modal"
            text={text}
            onCancel={(e) => { if (e && e.stopPropagation) e.stopPropagation(); setOpenModal(false)}}
            onConfirm={(e) => { if (e && e.stopPropagation) e.stopPropagation(); closeHandler()}}
            onRequestClose={(e) => { if (e && e.stopPropagation) e.stopPropagation(); setOpenModal(false)}}
        />
    );


    return [component, openHandler]
}

export default useConfirmModal;