import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSelectedHome } from '../../store/house'; // Import your Redux action for house selection
import { houseActions } from '../../store/house'; // Make sure you have axios for API calls
import { getApi } from '../../api/api';
//import BackgroundImage from '../../assets/img/backgroundAI.png'


const WelcomePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [homes, setHomes] = useState([]); // State to store available houses
    const [selectedHome, setSelectedHome] = useState(null); // Selected house state
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token).token

    useEffect(() => {
        getApi(
            (response) => {
                setHomes(response.data)
                dispatch(houseActions.setHouses(response.data));
            },
            token,
            "/api/homes/" // Replace with your actual endpoint for fetching houses
        );
    }, [token, dispatch]);

    const handleHouseChange = (e) => {
        setSelectedHome(e.target.value); // Update the selected house state
    };

    const handleProceed = () => {
        if (selectedHome) {

            getApi(
                (response) => {
                    dispatch(houseActions.setResidents(response.data));
                    dispatch(houseActions.setSelectedHome(selectedHome));
                    history.push('/home')
                },
                token,
                `/api/resident/?home=${selectedHome}`

            );

        } else {
            alert("Please select a house to proceed.");
        }
    };

    return (
        <div
            className="welcome-container"
            style={{
                backgroundImage: `url('/images/backgroundAI.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backgroundColor: 'rgba(130,215,120, 0.4)', // Soft fade overlay
                backgroundBlendMode: 'overlay'
            }}
        >
           {/* Top White Strip */}
            <div style={{
                backgroundColor: 'white',
                width: '100%',
                padding: '10px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <img src="/images/Seacole-logo.png" alt="Logo" style={{ width: '120px' }} />
            </div>

            {/* Middle Content */}
            <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
            }}>
                <h1 style={{ fontWeight: 'bold', fontSize: '32px', marginBottom: '10px', color: 'white', textShadow: '1px 1px 2px black' }}>
                    Welcome to CLINIX, Seacole Healthcare Information System
                </h1>

            <select
                value={selectedHome || ''}
                onChange={handleHouseChange}
                className="form-select"
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    marginBottom: '20px',
                    width: '300px',
                    borderRadius: '5px'
                }}
            >
                <option value="">Select a House</option>
                {homes.map(home => (
                    <option key={home.id} value={home.id}>
                        {home.name}
                    </option>
                ))}
            </select>

            <button
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '16px' }}
                onClick={handleProceed}
            >
                Proceed to Homepage
            </button>
        </div>

         {/* Bottom Colored Strip */}
            <div style={{
                backgroundColor: 'rgb(130,215,120)',
                width: '100%',
                padding: '15px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h3 style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>
                    Gateway to Community Integration
                </h3>
            </div>
        </div>

    );
};

export default WelcomePage;
