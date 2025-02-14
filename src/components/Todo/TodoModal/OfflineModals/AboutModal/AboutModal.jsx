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
            slideInFrom="right"
        >
            <p>
                At HabitForge, we believe that consistency is the foundation of lasting change. Our platform is designed to help you build habits that stick by focusing on small, manageable steps. Why? Because big transformations don’t happen overnight—they happen through tiny, consistent actions repeated over time.
                <br ></br>
                <br ></br>
                Whether you're starting a fitness routine, learning a new skill, or improving your daily habits, HabitForge is your partner in progress. With tools like gentle reminders, progress tracking, and motivational support, we make it easy to stay on track and celebrate every small win along the way.
                <br ></br>
                <br ></br>
                What sets HabitForge apart is its versatility. Use it as a solo adventure to chart your personal path, or bring friends along to motivate each other, push boundaries, and even collaborate on projects. And if you prefer a simpler approach, HabitForge seamlessly adapts to function as a straightforward to-do list.
                <br ></br>
                <br ></br>
                Our mission is simple: to help you create habits that last, without feeling overwhelmed. Because when you focus on consistency—not perfection—success becomes inevitable.
            </p>
        </BaseModal>
    );
}

export default AboutModal;