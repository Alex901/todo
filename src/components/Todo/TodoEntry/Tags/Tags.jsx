import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';

function Tags({ tags }) {
    return (
        <>
            {tags.map((tag, index) => (
                <Chip
                    key={index}
                    label={tag.label}
                    style={{
                        backgroundColor: tag.color,
                        color: tag.textColor,
                    }}
                />
            ))}
        </>
    );
}

Tags.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes,
            textColor: PropTypes
        })
    ).isRequired,
};

export default Tags;