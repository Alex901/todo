import React from 'react';
import BaseModal from '../../BaseModal/BaseModal';

const TermsModal = ({ isOpen, onRequestClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Terms of Service"
        >
            <iframe
                src="https://storage.googleapis.com/habitforge-public-documents/HF%20-%20Terms%20of%20Service.pdf"
                title="Terms of Service"
                width="100%"
                height="500px"
                style={{ border: 'none' }}
            ></iframe>
        </BaseModal>
    );
};

export default TermsModal;