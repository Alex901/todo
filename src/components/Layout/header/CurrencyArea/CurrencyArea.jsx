import { useEffect } from 'react';
import { useUserContext } from '../../../../contexts/UserContext';
import Tooltip from '@mui/material/Tooltip';
import './CurrencyArea.css';

const CurrencyArea = () => {
    const { loggedInUser } = useUserContext();

    useEffect(() => {
        console.log('DEBUG -- user -- currencyArea', loggedInUser);
    }, [loggedInUser]);

    return (
        <div className="currency-area">
          
                <span className="currency">{loggedInUser?.settings.currency}</span>
          
            <Tooltip title="Productivity token" arrow>
                <img src="\currency-beta.png" alt="Currency Beta" className="currency-image" />
            </Tooltip>
        </div>
    );
};

export default CurrencyArea;