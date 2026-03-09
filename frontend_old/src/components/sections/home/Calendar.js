import React, { useEffect, useState } from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { useDispatch, useSelector } from 'react-redux'
import { getApi, postApi, putApi, deleteApi } from '../../../api/api'
import { notificationActions } from '../../../store/notification'
import { riskSchedulerActions } from '../../../store/riskScheduler'
import { planSchedulerActions } from '../../../store/supportPlanScheduler'
import { accidentSchedulerActions } from '../../../store/acciddentScheduler'
import { evaluationSchedulerActions } from '../../../store/evaluationScheduler'
import { toastsuccess, toastdanger } from '../../utils/notifications'
import { useHistory } from 'react-router-dom';



const currentDate = Date.now();
const views = ['day', 'week', 'month'];

export const resourcesData = [
    {
        id: 1,
        color: '#d0f2b0'
    },
    {
        id: 2,
        color: '#c4c4c4'
    }
];

const Calendar = () => {
    const user = useSelector((state) => state.auth.user)
    const staff_list = useSelector((state) => state.staff.staffList)
    const notification_list = useSelector((state) => state.notification.notificationList)
    const token = useSelector((state) => state.auth.token).token
    const notifications = [...notification_list]
    const staff = [...staff_list]
    const history = useHistory();
    const [selected, setSelected] = useState({})
    const [selected_id, setSelectedId] = useState('')
    const risks_ = useSelector((state) => state.riskschedulerscheduler.riskSchedulerList)
    const plan_ = useSelector((state) => state.planscheduler.planSchedulerList)
    const evaluation_ = useSelector((state) => state.evaluationscheduler.evaluationSchedulerList)
    const accident_ = useSelector((state) => state.accidentscheduler.accidentSchedulerList)

    const data = notifications.map(reminder => {
        return {
            id: reminder.id,
            reminder_for: reminder.staff,
            text: reminder.subject,
            serviceId: [1],
            description: reminder.notes,
            startDate: reminder.start_date,
            endDate: reminder.end_date,
            accident_: accident_?.find(r => r.reminder === reminder.id),
            evaluation_: evaluation_?.find(r => r.reminder === reminder.id),
            plan_: plan_?.find(r => r.reminder === reminder.id),
            risks_: risks_?.find(r => r.reminder === reminder.id),

        }
    })
    const handleClick = (redirect_obj) => {
        history.push(redirect_obj.path)
    }

    const dispatch = useDispatch()
    useEffect(() => {
        getApi(response => { dispatch(notificationActions.setNotification(response.data)) }, token, "/api/reminder")
        getApi(response => { dispatch(riskSchedulerActions.setRiskScheduler(response.data)) }, token, "/api/risk-scheduler")
        getApi(response => { dispatch(planSchedulerActions.setPlanSchedulers(response.data)) }, token, "/api/plan-scheduler")
        getApi(response => { dispatch(accidentSchedulerActions.setAccidentSchedulers(response.data)) }, token, "/api/accident-scheduler")
        getApi(response => { dispatch(evaluationSchedulerActions.setEvaluationSchedulers(response.data)) }, token, "/api/evaluation-scheduler")
    }, [dispatch, token, selected])

    const onAppointmentUpdated = (e) => {
        const { id, startDate, endDate, text, description, reminder_for } = e.appointmentData;
        const data = {
            id: id,
            subject: text,
            notes: description,
            created_by: user.id,
            staff: reminder_for,
            start_date: startDate,
            end_date: endDate,
        }
        putApi(response => { setSelected(response.data); toastsuccess("Reminder updated successfully") }, token, `/api/reminder/`, data, data.id)
    }
    const onAppointmentDeleted = (e) => {
        const { id } = e.appointmentData;
        deleteApi(() => { setSelected({}); toastdanger("Reminder was deleted ") }, token, "/api/reminder/", id)
    }
    const onAppointmentAdded = (e) => {
        const { startDate, endDate, text, description, reminder_for } = e.appointmentData;
        const data = {
            subject: text,
            notes: description,
            created_by: user.id,
            staff: reminder_for,
            start_date: startDate,
            end_date: endDate,

        }
        postApi(response => { setSelected(response.data); toastsuccess("Reminder added successfully") }, token, "/api/reminder/", data)

    }
    const onAppointmentFormOpening = (e) => {
        const { id, risks_, plan_, accident_, evaluation_ } = e.appointmentData;
        let redirect_obj
        if (risks_) {
            redirect_obj = {
                "path": "/riskassessment/add-riskassessment",
                "object": risks_
            }
            dispatch(riskSchedulerActions.setSelectedriskScheduler(risks_))

        } else if (plan_) {
            redirect_obj = {
                "path": "/supportplan/add-supportplan",
                "object": plan_
            }
            dispatch(planSchedulerActions.setSelectedPlanSchedulers(plan_))
        } else if (accident_) {
            redirect_obj = {
                "path": "/resident/detail",
                "object": accident_
            }
            dispatch(accidentSchedulerActions.setSelectedAccidentSchedulers(accident_))

        } else if (evaluation_) {
            redirect_obj = {
                "path": "/evaluation/deatil",
                "object": evaluation_
            }
            dispatch(evaluationSchedulerActions.setSelectedEvaluationSchedulers(evaluation_ ))

        } else {
            redirect_obj = null
        }
        setSelectedId(id)
        const { form } = e;
        form.option('items', [{
            label: {
                text: 'ID',
            },
            name: 'id',
            dataField: 'id',
            disabled: true,
            editorType: 'dxTextBox',
        },
        {
            label: {
                text: 'Title',
            },
            name: 'description',
            editorType: 'dxTextBox',
            dataField: 'text',
            editorOptions: {
                onValueChanged(args) {
                    form.updateData('text', args.value);
                },
            },
        },
        {
            label: {
                text: 'description',
            },
            name: 'Description',
            dataField: 'description',
            editorType: 'dxTextBox',
            editorOptions: {
                onValueChanged(args) {
                    form.updateData('description', args.value);
                },
            },
        },
        {
            editorType: 'dxDateBox',
            dataField: 'startDate',
            editorOptions: {
                width: '100%',
                type: 'datetime',
                onValueChanged(args) {
                    form.updateData('startDate', new Date(args.value));
                },
            },
        }, {
            name: 'endDate',
            dataField: 'endDate',
            editorType: 'dxDateBox',
            editorOptions: {
                width: '100%',
                type: 'datetime',
            },
        },
        {
            label: {
                text: 'Staff',
            },
            editorType: 'dxSelectBox',
            dataField: 'reminder_for',
            editorOptions: {
                items: staff,
                displayExpr: 'email',
                valueExpr: 'id',
                onValueChanged(args) {
                    form.updateData('reminder_for', args.value);
                },
            },
        },
        {
            editorType:  'dxButton',
            editorOptions: {
                text: "Click here to evaluate",
                onClick: _ => handleClick(redirect_obj)
            }
        },
        ]);
    }

    return (
        <div className="col-xl-12 col-lg-12 col-md-12 ">
            <div className="ms-panel ms-panel-fh ">
                <div className="">
                    <Scheduler
                        timeZone="UTC"
                        dataSource={data}
                        views={views}
                        defaultCurrentView="week"
                        defaultCurrentDate={currentDate}
                        firstDayOfWeek={1}
                        startDayHour={0}
                        height={"auto"}
                        onAppointmentUpdated={onAppointmentUpdated}
                        onAppointmentDeleted={onAppointmentDeleted}
                        onAppointmentAdded={onAppointmentAdded}
                        onAppointmentFormOpening={onAppointmentFormOpening}
                    >
                    </Scheduler>
                </div>
            </div>
        </div>
    );
}

export default Calendar;