import React from "react";
import BaseModal from "../../BaseModal/BaseModal";
import "./StoryModal.css";

const StoryModal = ({ isOpen, onRequestClose }) => {
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
                HabitForge began with a simple yet powerful idea: small, consistent actions lead to lasting change. For decades, I relied on nothing more than a whiteboard, paper, and pen to map out my journey—tracking every step, celebrating each tiny win, and steadily building the habits that transformed my life. Those humble tools were my secret to success, proving that consistency is the key to achieving even the most ambitious goals.
                <br ></br>
                <br ></br>
                During a challenging period on sick leave, I found solace in these time-tested methods. As I worked through my recovery, I began to digitize the system that had served me so well. What started as a personal project soon evolved into something much larger. I realized that if these principles could change my life, they could do the same for others.
                <br ></br>
                <br ></br>
                Thus, HabitForge was born—a webapp designed to empower you to build and maintain life-changing habits, one small step at a time. Our journey is a testament to the power of consistency, and we're excited to share that journey with you.
            </p>
        </BaseModal>
    );
}

export default StoryModal;