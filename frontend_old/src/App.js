import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { homeActions } from './store/home'
import { staffActions } from './store/staff'
import { authActions } from './store/auth'
import { residentActions } from './store/resident'
import { appointmentActions } from './store/appointment'
import { attachmentActions } from './store/attachment'
import { notificationActions } from './store/notification'
import { inventoryActions } from './store/inventory'
import { userHistoryActions } from './store/userHistory'
import { houseAssetActions }  from './store/assets'
import { stockActions } from './store/stock'
import { repairActions } from './store/repairs'
import { confidentialActions } from './store/confidential'
import { noteActions } from './store/note'
import { planActions} from './store/supportPlans'

import { getApi } from './api/api'
import { useDispatch, useSelector } from 'react-redux'
import WelcomePage from './components/pages/WelcomePage';
// Preloader
const Preloader = React.lazy(() => import("./components/layouts/Preloader"));
// Pages
const Home = React.lazy(() => import("./components/pages/Home"));
const Rota = React.lazy(() => import("./components/pages/rota/Rota"));

// appointment
const Addappointment = React.lazy(() => import("./components/pages/appointment/Addappointment"));
const Appointmentlist = React.lazy(() => import("./components/pages/appointment/Appointmentlist"));
// bed manager
const Addbed = React.lazy(() => import("./components/pages/bed-manager/Addbed"));
const Bedlist = React.lazy(() => import("./components/pages/bed-manager/Bedlist"));
// department
const Adddepartment = React.lazy(() => import("./components/pages/department/Adddepartment"));
const Departmentlist = React.lazy(() => import("./components/pages/department/Departmentlist"));
// doctor
const Adddoctor = React.lazy(() => import("./components/pages/doctor/Adddoctor"));
const EditProfile = React.lazy(() => import("./components/pages/doctor/EditProfile"));

const Doctorlist = React.lazy(() => import("./components/pages/doctor/Doctorlist"));
// doctor schedule
const Schedulelist = React.lazy(() => import("./components/pages/doctor-schedule/Schedulelist"));
// employee
const Addemployee = React.lazy(() => import("./components/pages/human-resource/Addemployee"));

const AddAssesment = React.lazy(() => import("./components/pages/human-resource/AddAssesment"));
const Addevaluation = React.lazy(() => import("./components/pages/human-resource/AddEvaluation"));
const PossibleAnswer = React.lazy(() => import("./components/pages/human-resource/PossibleAnswer"));
const Employeelist = React.lazy(() => import("./components/pages/human-resource/Employeelist"));
const SupportPlan = React.lazy(() => import("./components/pages/human-resource/SupportPlan"));
const RiskList = React.lazy(() => import("./components/pages/human-resource/Risk"));
const Notifications = React.lazy(() => import("./components/pages/human-resource/Notifications"));
const AddRisk = React.lazy(() => import("./components/pages/payment/AddRisk"));
const AddPlan = React.lazy(() => import("./components/pages/payment/AddPlan"));
const AddPlanEvaluation = React.lazy(() => import("./components/sections/payment/addpayment/AddPlanEvaluation"));

// notice
const Addnotice = React.lazy(() => import("./components/pages/notice/Addnotice"));
const Noticelist = React.lazy(() => import("./components/pages/notice/Noticelist"));
// patient
const Addpatient = React.lazy(() => import("./components/pages/patient/Addpatient"));
const Patientlist = React.lazy(() => import("./components/pages/patient/Patientlist"));
const Dischargedpatient = React.lazy(() => import("./components/pages/patient/Dischargedpatient"))
// payment
const AddNote = React.lazy(() => import("./components/pages/payment/AddNote"));
const Addpayment = React.lazy(() => import("./components/pages/payment/Addpayment"));
const Paymentlist = React.lazy(() => import("./components/pages/payment/Paymentlist"));
// prebuilt pages
const Defaultlogin = React.lazy(() => import("./components/pages/prebuilt-pages/Defaultlogin"));
const Defaultregister = React.lazy(() => import("./components/pages/prebuilt-pages/Defaultregister"));
const DefaultregisterEmail = React.lazy(() => import("./components/pages/prebuilt-pages/DefaultregisterEmail"));
const Error = React.lazy(() => import("./components/pages/prebuilt-pages/Error"));
const Faq = React.lazy(() => import("./components/pages/prebuilt-pages/Faq"));
const Lockscreen = React.lazy(() => import("./components/pages/prebuilt-pages/Lockscreen"));
const Userprofile = React.lazy(() => import("./components/pages/prebuilt-pages/Userprofile"));
// reports
const Patientreport = React.lazy(() => import("./components/pages/reports/Patientreport"));

// note
const DailyNote = React.lazy(() => import("./components/modals/DailyNote"));
const DeletedNote = React.lazy(() => import("./components/pages/notes/DeletedNote"));

const DrawingApp = React.lazy(() => import("./components/pages/Drawing"))
const Drawinglist = React.lazy(() => import("./components/pages/bed-manager/DrawingList"));
const AddInventory = React.lazy(() => import ("./components/modals/AddInventory"));
const EditInventory = React.lazy(() => import("./components/modals/EditInventory"));
const InventoryList = React.lazy (() => import("./components/pages/patient/InventoryList"));
const UserHistory = React.lazy (() => import("./components/modals/UserHistory"));
const DeleteUser = React.lazy (() => import("./components/modals/DeleteUser"));
const AddAssets = React.lazy (() => import("./components/modals/AddAssets"));
const AddStock = React.lazy (() => import("./components/modals/AddStock"));
const AssetList = React.lazy (() => import("./components/pages/assets_stock/Assetlist"));
const HouseOverview = React.lazy (() => import("./components/pages/house/house-overview"));

const StockList = React.lazy (() => import("./components/pages/assets_stock/StockList"));
const AddRepairs = React.lazy ( () => import("./components/modals/AddRepairs"));
const RepairList = React.lazy ( () => import("./components/pages/assets_stock/RepairList"));
const AddConfidential = React.lazy ( () => import("./components/modals/AddConfidential"));
const ConfidentialList = React.lazy ( () => import("./components/pages/confidential/ConfidentialList"));

const App = () => {
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token).token
    const isLoggedIn = useSelector((state) => state.auth.loggedin)
    let timer;
    const events = [
        "load",
        "mousemove",
        "mousedown",
        "click",
        "scroll",
        "keypress",
    ];

    useEffect(() => {
        if (isLoggedIn) {
            getApi(response => { dispatch(homeActions.setHome(response.data)) }, token, "/api/home", _ => { dispatch(authActions.logout()) })
            getApi(response => { dispatch(staffActions.setStaff(response.data)) }, token, "/api/staff")
            getApi(response => { dispatch(appointmentActions.setAppointments(response.data)) }, token, "/api/appointment")
            getApi(response => { dispatch(attachmentActions.setAttachments(response.data)) }, token, "/api/attachment")
            getApi(response => { dispatch(authActions.setUser(response.data)) }, token, "/api/me")
            getApi(response => { dispatch(residentActions.setResidents(response.data)) }, token, "/api/resident")
            getApi(response => { dispatch(notificationActions.setNotification(response.data)) }, token, "/api/reminder")
            getApi(response => { dispatch(inventoryActions.setInventory(response.data)) }, token, "/api/inventory")
            getApi(response => { dispatch(userHistoryActions.setUserHistory(response.data)) }, token, "/api/userHistory")
            getApi(response => { dispatch(houseAssetActions.setHouseAsset(response.data)) }, token, "/api/house-asset")
            getApi(response => { dispatch(stockActions.setStock(response.data)) }, token, "/api/house-stock")
            getApi(response => { dispatch(repairActions.setRepair(response.data)) }, token, "/api/repair-record")
            getApi(response => { dispatch(confidentialActions.setConfidential(response.data)) }, token, "/api/confidential-info")
            getApi(response => { dispatch(noteActions.setNote(response.data)) }, token, "/api/note")


        }
    }, [dispatch, token])


    return (
        <Router basename={'/'}>
            <Suspense fallback={<div></div>}>
                <Preloader />

                {isLoggedIn ?
                    <Switch>
                        <Route exact path="/" component={WelcomePage} />
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/rota" component={Rota} />
                        {/* appointment */}
                        <Route path="/appointment/add-appointment" component={Addappointment} />
                        <Route exact path="/appointment" component={Appointmentlist} />
                        {/* Evaluations */}
                        <Route path="/evaluation/add-evaluation" component={Addemployee} />
                        <Route exact path="/evaluation/deatil" component={Faq} />
                        <Route exact path="/evaluation" component={Addevaluation} />
                        {/* Attachments */}
                        <Route path="/attacthment/upload" component={Addbed} />
                        <Route path="/attacthment" component={Bedlist} />
                        {/* Homes */}
                        <Route path="/home/add-home" component={Adddepartment} />
                        <Route exact path="/home" component={Departmentlist} />
                        {/* Staff */}
                        <Route path="/staff/add-staff" component={Adddoctor} />
                        <Route path="/staff/edit-profile" component={EditProfile} />
                        <Route exact path="/staff" component={Doctorlist} />

                        {/* Handover */}
                        <Route path="/handover" component={Schedulelist} />
                        {/* Assessment */}
                        <Route path="/assessment/detail" component={Employeelist} />
                        <Route exact path="/assessment" component={AddAssesment} />
                        <Route path="/assessment/possible-answer" component={PossibleAnswer} />
                        {/* Support Plan */}
                        <Route path="/supportplan/detail" component={SupportPlan} />
                        <Route exact path="/supportplan" component={SupportPlan} />
                        <Route path="/supportplan/add-supportplan" component={AddPlan} />
                        <Route path="/supportplan/evaluations" component={AddPlanEvaluation} />
                        {/* Risk Assessment */}
                        <Route path="/riskassessment/detail" component={Employeelist} />
                        <Route exact path="/riskassessment" component={RiskList} />
                        <Route path="/riskassessment/add-riskassessment" component={AddRisk} />

                        {/* /supportplan/add-supportplan */}
                        {/* <Route path="/riskassessment/possible-answer" component={PossibleAnswer} /> */}
                        {/* SACCI */}
                        <Route path="/suggesion/add-suggestion" component={Addnotice} />
                        <Route exact path="/suggesion" component={Noticelist} />
                        {/* Resdient */}
                        <Route path="/resdient/add-resdient" component={Addpatient} />
                        <Route exact path="/resident" component={Patientlist} />
                        <Route path="/resident/detail" component={Userprofile} />
                        <Route path="/resident/discharged-resident" component={Dischargedpatient} />
                        {/* Notes */}
                        <Route path="/note/add-note" component={DailyNote} />
                        <Route exact path="/note" component={Patientreport} />
                        <Route path="/note/deleted-notes" component={DeletedNote} />

                        {/* Finance */}
                        <Route path="/payment/add-payment" component={Addpayment} />
                        <Route exact path="/payment" component={Paymentlist} />
                        <Route path="/notification" component={Notifications} />

                        {/* Add Inventory */}
                        <Route path="/resident/add-inventory" component={AddInventory}  />
                        <Route exact path="resident" component={Patientlist}  />
                        <Route path="/resident/edit-inventory" component={EditInventory}  />

                        {/* EditInventory */}
                        <Route path="/resident/edit-inventory" component={EditInventory}  />
                        <Route exact path="resident" component={Patientlist} />

                        {/* Inventory List */}
                        <Route path="/resident/InventoryList" component={InventoryList} />
                        <Route exact path="resident" component={Patientlist} />

                        {/* UserHistory */}
                        <Route path="/staff/UserHistory" component={UserHistory} />
                        <Route exact path="staff" component={Doctorlist} />

                        <Route path="/staff/delete-non-superusers" component={DeleteUser} />
                        <Route exact path="staff" component={Doctorlist} />

                        {/* HouseAssets */}
                        <Route path="/house-asset" component={AddAssets} />
                        <Route path="/asset-list"  component={AssetList} />

                        {/* House overview */}
                        <Route path="/house-overview" component={HouseOverview} />
                        <Route path="/house-overview/asset-list"  component={AssetList} />
                        <Route path="/house-overview/stock-list"  component={StockList} />
                        <Route path="/house-overview/repair-list" component={RepairList} />

                        {/* HouseStock */}
                        <Route path="/house-stock" component={AddStock} />
                        <Route path="/stock-list" component={StockList} />

                        {/* House repairs */}
                        <Route path="/repair-record" component={AddRepairs} />
                        <Route path="/repair-list" component={RepairList} />

                        {/* Confidential-info */}
                        <Route path="/confidential-info" component={AddConfidential} />
                        <Route path="/confidential-list" component={ConfidentialList} />



                        {/* uibasic */}
                        <Route path="/login" component={Defaultlogin} />
                        <Route path="/error" component={Error} />
                        <Route path="/lock" component={Lockscreen} />
                        <Route exact path="/body-map" component={Drawinglist} />
                        <Route path="/body-map/add" component={DrawingApp} />
                        <Route path='*' render={(props) => <Redirect {...props} to='/error' replace />} />
                    </Switch> :
                    <Switch>
                        <Route path="/login" component={Defaultlogin} />
                        <Route path="/api/password_reset" component={Defaultregister} />
                        <Route path="/password-reset-email" component={DefaultregisterEmail} />
                        <Route path="/error" component={Error} />
                        <Route path='*' render={(props) => <Redirect {...props} to='/login' replace />} />
                    </Switch>
                }
            </Suspense>
        </Router>
    );
}

export default App;
