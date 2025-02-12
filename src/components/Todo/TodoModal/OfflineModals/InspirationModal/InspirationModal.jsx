import React from "react";
import BaseModal from "../../BaseModal/BaseModal";

const InspirationModal = ({ isOpen, onRequestClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={"Inspiration"}
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <p>
                Ways of using this app -- coming soon!
            </p>
        </BaseModal>
    );
}

export default InspirationModal;