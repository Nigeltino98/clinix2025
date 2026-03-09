import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

//import { ToastContainer } from 'react-toastify';
//import { toast } from 'react-toastify';


const EditQuestion = (props) => {
    const token = useSelector((state) => state.auth.token)?.token;
    const residents = useSelector((state) => state.resident.residentList) || [];

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
                icon:'success',
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
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={6}>
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            as="textarea"
            rows={3}
            value={formData.title || ''}
            onChange={handleChange}
            required
          />
        </Col>

        <Col md={6}>
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            required
          >
            <option value="">-- Select --</option>
            <option value="HousingTenancy">Housing/Tenancy</option>
            <option value="Risk">Risk</option>
            <option value="FinanceMoneyBenefitManagement">Finance/Money</option>
            <option value="Education">Education</option>
            <option value="Employment">Employment</option>
            <option value="MentalHealthSubstanceUse">Mental Health</option>
              <option value='EthnicCulturalReligiousNeeds'>Ethnic/Cultural/Religious Needs</option>
              <option value='LeisureSocialNetwork'>Leisure/Social Network</option>
              <option value='MovingOn'>Moving On</option>
              <option value='FurtherConcernsNeeds'>Further Concerns/Needs</option>
              <option value='ServicesprovidedbyHousingorEselected_planManagementService'>Services provided by Housing or Estate Management</option>
              <option value='ServicesprovidedbySupportWorker'>Services provided by Support Worker</option>
              <option value='SupportWorkersViewsofIssuesNeedsorActions'>Support Worker’s Views</option>
          </Form.Select>
        </Col>

        <Col md={6}>
          <Form.Label>Issue</Form.Label>
          <Form.Control name="issue" as="textarea" value={formData.issue || ''} onChange={handleChange} />
        </Col>

        <Col md={6}>
          <Form.Label>Action Plan</Form.Label>
          <Form.Control name="action_plan" as="textarea" value={formData.action_plan || ''} onChange={handleChange} />
        </Col>

        <Col md={6}>
          <Form.Label>Resident</Form.Label>
          <Form.Select name="resident" value={formData.resident || ''} onChange={handleChange}>
            <option value="">-- Select Resident --</option>
            {residents.map((r) => (
              <option key={r.national_id} value={r.national_id}>
                {r.first_name} {r.last_name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={6}>
          <Form.Label>Care Rating</Form.Label>
          <Form.Control
            name="care_rating"
            as="textarea"
            rows={2}
            value={formData.care_rating || ''}
            onChange={handleChange}
          />
        </Col>

        <Col md={6}>
          <Form.Label>By Who</Form.Label>
          <Form.Control
            name="by_who"
            as="textarea"
            rows={2}
            value={formData.by_who || ''}
            onChange={handleChange}
          />
        </Col>

        <Col md={6}>
          <Form.Label>By When</Form.Label>
          <Form.Control
            name="by_when"
            as="textarea"
            rows={2}
            value={formData.by_when || ''}
            onChange={handleChange}
          />
        </Col>

        <Col md={6}>
          <Form.Label>Goal</Form.Label>
          <Form.Control
            name="goal"
            as="textarea"
            rows={2}
            value={formData.goal || ''}
            onChange={handleChange}
          />
        </Col>

        <Col md={6}>
          <Form.Label>Achievements</Form.Label>
          <Form.Control
            name="achievements"
            as="textarea"
            rows={2}
            value={formData.achievements || ''}
            onChange={handleChange}
          />
        </Col>


        <Col md={6}>
          <Form.Label>Next Evaluation Date</Form.Label>
          <Form.Control
            type="datetime-local"
            name="next_assement_date"
            value={
              formData.next_assement_date
                ? new Date(formData.next_assement_date).toISOString().slice(0, 16)
                : ''
            }
            onChange={handleChange}
          />
        </Col>

        <Col md={6}>
          <Form.Label>Upload Attachment</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Col>
      </Row>

      <Button type="submit" className="mt-4">
        Save Plan
      </Button>
    </Form>
  );
};

export default EditQuestion;
