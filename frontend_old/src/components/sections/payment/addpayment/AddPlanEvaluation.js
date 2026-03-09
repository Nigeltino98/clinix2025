import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { planActions } from '../../../../store/supportPlans';
import { putApi, postApi } from '../../../../api/api';
import {toastsuccess } from '../../../utils/notifications';
import Swal from 'sweetalert2';


const initialState = {
        evaluations: [],
    }
const AddPlanEvaluation = ({ plan }) => {
    console.log(" ReceivedPlan", plan);
    const planID = plan.id;
    const [evaluationText, setEvaluationText] = useState("");
    const [validated, setValidated] = useState(false);
    const [formErrors, setFormErrors] = useState(false);
    const [errors, setErrors] = useState(false);
    const token = useSelector((state) => state.auth.token).token;
    const dispatch = useDispatch();
    const selected_plan = useSelector((state) => state.plan.selectedPlan)

    const evaluations = Array.isArray(plan.evaluations) ? plan.evaluations : [];
    const handleChange = (event) => {
        setEvaluationText(event.target.value);
        if (formErrors && event.target.value.trim() !== "") {
            setFormErrors(false); // Clear form errors when user starts typing
        }
    };

    useEffect(() => {
        console.log('Received plan prop:', plan);
    }, [plan]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (evaluationText.trim() === "") {
            setErrors(true);
            return;
        }

        if (!plan || !plan.id) {
            setErrors(true);
            console.error('Plan or Plan ID is missing');
            return;
        }

        const evaluation = {

                text: evaluationText,
                support_plan: plan.id,
                date: new Date(),
        };

        console.log("Submitting evaluation:", evaluation);

        postApi(
            (response) => {
                console.log("Evaluation:", response.data);
                toastsuccess("Evaluation added successfully");
                Swal.fire('Added!', 'Evaluation has been added.', 'success');
                setEvaluationText("");
                setValidated(false);

                //history.push('/plan');
            },
            token,
            `/api/support-plan/${plan.id}/evaluations/`, // Endpoint for adding evaluations
            evaluation,
            (errors_list) => {
                setErrors(errors_list);
            }
        );

        setValidated(true);
    };

    return (
        <form onSubmit={handleSubmit} noValidate validated={validated.toString()}>
            <div className="mb-3">
                <label htmlFor="evaluationText" className="form-label">Evaluation</label>
                <textarea
                    className="form-control"
                    id="evaluationText"
                    rows="4"
                    value={evaluationText}
                    onChange={handleChange}
                    placeholder="Enter evaluation details"
                    required
                ></textarea>
                {errors && <div className="invalid-feedback">Evaluation text is required</div>}
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
        </form>
    );
};

export default AddPlanEvaluation;
