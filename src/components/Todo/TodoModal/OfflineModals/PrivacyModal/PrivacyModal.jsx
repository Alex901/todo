import React from 'react';
import BaseModal from '../../BaseModal/BaseModal';

const PrivacyModal = ({ isOpen, onRequestClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Privacy Policy"
        >
            <iframe
                src="https://storage.googleapis.com/habitforge-public-documents/HF%20-%20Privacy%20Policy.pdf"
                title="Privacy Policy"
                width="100%"
                height="500px"
                style={{ border: 'none' }}
            ></iframe>
        </BaseModal>
    );
};

export default PrivacyModal;