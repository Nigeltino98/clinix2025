import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

//import { ToastContainer } from 'react-toastify';
//import { toast } from 'react-toastify';


const EditQuestion = (props) => {
    const token = useSelector((state) => state.auth.token)?.token;
    const residents = useSelector((state) => state.resident.residentList);

    const [formData, setFormData] = useState(props.plan || {});
    const [validated, setValidated] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    console.log("Received plan in EditQuestion:", props.plan);
    const API_URL = process.env.NODE_ENV === 'production'
        ? 'https://seacolehealthsystems.co.uk'
        : 'http://localhost:8000';

    // 🔄 Set form data when props.plan changes
    useEffect(() => {
        if (props.plan) {
            setFormData(props.plan);
        }
    }, [props.plan]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'next_assement_date'
                ? new Date(value).toISOString()
                : value
        }));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        const payload = new FormData();
        for (const key in formData) {
            payload.append(key, formData[key] || '');
        }
        payload.append('last_evaluated_date', new Date().toISOString());

        if (selectedFile) {
            console.log('Appending file:', selectedFile);
            payload.append('attachment', selectedFile);
        }

        try {
            const response = await fetch(`${API_URL}/api/plan/${formData.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: payload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Plan updated:', data);

            Swal.fire({
                icon:'succes',
                title: 'Support Plan Updated',
                text: 'The Support plan has been successfully updated!',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'

            }).then(() => {
                props.handleClose();

            });

        } catch (error) {
            console.error('Error updating plan:', error);
        }

        setValidated(true);
    };

    return (
        <div className="col-xl-12 col-md-12">
            <div className="ms-panel ms-panel-bshadow-none">
                <div className="ms-panel-body">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleChange}
                                    required
                                    as="textarea"
                                    rows={3}
                                    placeholder="Title"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    name="category"
                                    as="select"
                                    value={formData.category || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value='HousingTenancy'>Housing/Tenancy</option>
                                    <option value='Risk'>Risk</option>
                                    <option value='FinanceMoneyBenefitManagement'>Finance/Money/Benefit Management</option>
                                    <option value='RentArrearsServiceUsers'>Rent Arrears - Service Users</option>
                                    <option value='Education'>Education</option>
                                    <option value='Training'>Training</option>
                                    <option value='Employment'>Employment</option>
                                    <option value='MentalHealthSubstanceUse'>Mental Health/Substance Use</option>
                                    <option value='EthnicCulturalReligiousNeeds'>Ethnic/Cultural/Religious Needs</option>
                                    <option value='LeisureSocialNetwork'>Leisure/Social Network</option>
                                    <option value='MovingOn'>Moving On</option>
                                    <option value='FurtherConcernsNeeds'>Further Concerns/Needs</option>
                                    <option value='ServicesprovidedbyHousingorEselected_planManagementService'>Services provided by Housing or Estate Management</option>
                                    <option value='ServicesprovidedbySupportWorker'>Services provided by Support Worker</option>
                                    <option value='SupportWorkersViewsofIssuesNeedsorActions'>Support Worker’s Views</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Issues</Form.Label>
                                <Form.Control
                                    name="issue"
                                    as="textarea"
                                    value={formData.issue || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Action Plan</Form.Label>
                                <Form.Control
                                    name="action_plan"
                                    as="textarea"
                                    value={formData.action_plan || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Resident</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="resident"
                                    value={formData.resident || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select Resident --</option>
                                    {residents.map(user => (
                                        <option key={user.national_id} value={user.national_id}>
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Care Rating</Form.Label>
                                <Form.Control
                                    name="care_rating"
                                    as="textarea"
                                    value={formData.care_rating || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>By Who</Form.Label>
                                <Form.Control
                                    name="by_who"
                                    as="textarea"
                                    value={formData.by_who || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>By When</Form.Label>
                                <Form.Control
                                    name="by_when"
                                    as="textarea"
                                    value={formData.by_when || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Goal</Form.Label>
                                <Form.Control
                                    name="goal"
                                    as="textarea"
                                    value={formData.goal || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Achievements</Form.Label>
                                <Form.Control
                                    name="achievements"
                                    as="textarea"
                                    value={formData.achievements || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Evaluation Date</Form.Label>
                                <Form.Control
                                    name="next_assement_date"
                                    type="datetime-local"
                                    value={formData.next_assement_date
                                        ? new Date(formData.next_assement_date).toISOString().slice(0, 16)
                                        : ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Upload New File (Optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                        </Form.Row>

                        <Button type="submit" className="mt-4 d-inline w-20">Save Plan</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditQuestion;
