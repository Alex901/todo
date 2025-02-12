import React from "react";
import BaseModal from "../../BaseModal/BaseModal";

const AboutModal = ({ isOpen, onRequestClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={"About"}
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <p>
                This is a simple todo app that allows you to add, edit, and delete
                todos. You can also mark todos as completed and filter them by their
                status.
            </p>
        </BaseModal>
    );
}

export default AboutModal;