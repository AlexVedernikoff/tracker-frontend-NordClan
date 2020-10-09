import React, { useState } from 'react';
import ConfirmModal from '.';

function useConfirmModal<T>(text: string, onConfirm: (data?: T)=>void, data?: T){
    const [isOpenModal, setOpenModal] = useState(false)

    const component = (
        <ConfirmModal
            isOpen={isOpenModal}
            contentLabel="modal"
            text={text}
            onCancel={() => setOpenModal(false)}
            onConfirm={() => onConfirm(data)}
            onRequestClose={() => setOpenModal(false)}
        />
    );

    const openHandler = () => { setOpenModal(true); };

    return [component, openHandler]
}

export default useConfirmModal;