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
                        border: '1px solid rgba(0, 0, 0, 0.23)',
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
            color: PropTypes.string.isRequired,
            textColor: PropTypes.string.isRequired,
            uses: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default Tags;