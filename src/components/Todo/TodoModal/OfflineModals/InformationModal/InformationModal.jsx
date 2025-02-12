import React from "react";
import BaseModal from "../../BaseModal/BaseModal";

const InformationModal = ({ isOpen, onRequestClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={"Information"}
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <p>
                Some fun information
            </p>
        </BaseModal>
    );
}

export default InformationModal;