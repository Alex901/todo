import wordToNumbers from '../wordToNumbers';

/**
 * Calculates dynamic steps and total price based on step names.
 * @param {Array} steps - Array of step objects with `taskName`.
 * @returns {Object} - Updated steps with `reps` and calculated `totalPrice`.
 */
export const calculateDynamicSteps = (steps) => {
    const updatedSteps = steps.map((step) => {
        // Match all numeric values or words in the sentence
        const matches = step.taskName.match(/(\d+)|(\w+)/g); // Match all numbers or words

        let numericValue = 0;

        if (matches) {
            matches.forEach((match) => {
                const value = parseInt(match, 10) || wordToNumbers(match); // Convert each match to a number
                if (value > 0) {
                    numericValue += value; // Sum up all valid numeric values
                }
            });
        }

        return numericValue > 0
            ? { ...step, reps: numericValue } // Save the total numeric value in `reps`
            : { ...step, reps: 0 }; // Default to 0 for non-eligible steps
    });

    const eligibleSteps = updatedSteps.filter((step) => step.reps > 0); // Filter steps with valid `reps`
    const totalPrice = parseFloat((eligibleSteps.length * 0.1).toFixed(1)); // Calculate total price

    // console.log("DEBUG StepsUtils - Updated Steps: ", updatedSteps);
    // console.log("DEBUG StepsUtils - Total Price: ", totalPrice);

    return { updatedSteps, totalPrice };
};