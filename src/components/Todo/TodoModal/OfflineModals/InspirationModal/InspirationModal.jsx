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
                Change is hard, but it doesn’t have to be overwhelming. The secret to building habits that last isn’t willpower—it’s consistency. Small, repeated actions compound over time, creating lasting results.
                <br ></br>
                <br ></br>
                At HabitForge, we’re here to help you stay consistent, even when motivation fades. Our platform breaks down your goals into manageable steps, so you can build momentum without feeling discouraged. We celebrate every small win because we know that progress, no matter how small, is still progress.
                <br ></br>
                <br ></br>
                Remember: you don’t have to be perfect. You just have to show up, one small step at a time. With HabitForge by your side, you’ll build habits that become second nature—and create the life you’ve always wanted.
            </p>
        </BaseModal>
    );
}

export default InspirationModal;