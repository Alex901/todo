import { useState, useEffect } from 'react';

const useDynamicStep = (value) => {
    const [step, setStep] = useState(5);
    const maxStep = 1440; // Cap the step size at one day (1440 minutes)

    useEffect(() => {
        if (value < 30) {
            setStep(5);
        } else {
            let newStep = 5;
            let threshold = 30;
            while (value >= threshold && newStep < maxStep) {
                newStep *= 2;
                threshold *= 2;
            }
            setStep(Math.min(newStep, maxStep));
        }
    }, [value]);

    return step;
};

export default useDynamicStep;