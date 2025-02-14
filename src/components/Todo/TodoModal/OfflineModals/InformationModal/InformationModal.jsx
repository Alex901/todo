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
                HabitForge is a work in progress, guided by my personal vision while being shaped by your invaluable feedback. Right now, it's completely free to use, and while I plan to keep it that way as much as possible, hosting costs may eventually lead to a donation model.
                <br ></br>
                <br ></br>
                The platform is designed to be flexible. Whether you use it as a personal habit tracker, a simple to-do list, or a collaborative tool with friends, you have the freedom to shape it to your needs. Although the central theme is consistency, HabitForge is adaptable to many approaches, and a detailed onboarding guide is on the way.
                <br ></br>
                <br ></br>
                I want to be absolutely clear about the purpose of this service: HabitForge is a tool to support you, not a magic solution that does the work for you. It’s here to motivate you and keep you on track, but the real transformation comes from your own commitment and actions. Consider it a supportive companion in your journey toward consistent, lasting change.
                <br ></br>
                <br ></br>
                This project started as a hobby and quickly turned into a fun, rewarding journey. Feel free to explore and use HabitForge as it is today, and know that updates are coming steadily. Your feedback is crucial in shaping the future of this platform.
                <br ></br>
                <br ></br>
                Thank you for your support
            </p>
        </BaseModal>
    );
}

export default InformationModal;