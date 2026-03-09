import React from 'react';
import axios from 'axios';

const DeleteNonSuperusersButton = () => {
    const handleDeleteNonSuperusers = () => {
        axios.post('/api/delete-non-superusers/')
            .then(response => {
                console.log(response.data.message); // Success message
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <button onClick={handleDeleteNonSuperusers}>Delete Non-Superusers</button>
    );
};

export default DeleteNonSuperusersButton;
