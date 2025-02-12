import React from "react";
import BaseModal from "../../BaseModal/BaseModal";
import "./StoryModal.css";

const StoryModal = ({isOpen, onRequestClose}) => {
    return (
        <BaseModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={"Our Story"}
        className="modal-conntent"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={true}
        >
             <p>
                NGL. This felt like a fun thing to do. 
            </p>
        </BaseModal>
    );
}

export default StoryModal;