import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { careActions } from '../../../../store/care'

const cardblock = [
    { img: 'assets/img/basic/card-3.jpg', title: 'Weight', view_path: '/handover', id: "weight" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Sleep', view_path: '/handover', id: "sleep" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Mood', view_path: '/handover', id: "mood" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Morning Routine', view_path: '/handover', id: "morning" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Afternooon Routine', view_path: '/handover', id: "afternoon" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Accident & Incidents', view_path: '/handover', id: "accident" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Notes', view_path: '/note', id: "notes" },
    { img: 'assets/img/basic/card-3.jpg', title: 'Fluid Intake', view_path: '/handover', id: "fluid" },
]

const Imagewithbutton = (props) => {
    const dispatch = useDispatch();

    const handleCare = (id) => {
        switch (id) {
            case 'fluid':
                dispatch(careActions.setCare({
                    weight: false, bath: false, 
                    mood: false, sleep: false,
                    fluidIntake: true
                }))
                break;
            case 'Bath':
                dispatch(careActions.setCare({
                    weight: false, 
                    mood: false, sleep: false,
                    fluidIntake: false,
                    bath: true
                }))
                break;
            case 'weight':
                dispatch(careActions.setCare({
                    bath: false, 
                    mood: false, sleep: false,
                    fluidIntake: true,
                    weight: true
                }))
                break;
            case 'mood':

                dispatch(careActions.setCare({
                    weight: false, bath: false, 
                    mood: true, sleep: false,
                    fluidIntake: false
                }))
                break;
            case 'sleep':
                dispatch(careActions.setCare({
                    weight: false, bath: false, 
                    mood: false, sleep: true,
                    fluidIntake: false
                }))
                break;
            default:
        }
    }


    return (
        <Fragment>
            {cardblock.map((item, i) => (
                <div key={i} className="col-lg-3 col-md-6 col-sm-6">
                    <div className="ms-card">
                        <div className="ms-card-img">
                        </div>
                        <div className="ms-card-body">
                            <h6>{item.title}</h6>
                            {/* <p>{item.text}</p> */}
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <Link to="#" onClick={() => props.handleOpen(item.id)} className="btn btn-primary btn-block">Record</Link>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <Link to={item.view_path} onClick={() => { handleCare(item.id) }} className="btn btn-outline-primary btn-block">View</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Fragment>
    );
}

export default Imagewithbutton;