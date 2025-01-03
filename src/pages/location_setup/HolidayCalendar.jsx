import React, { useEffect, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { holidayTypes } from '../../utils/Common';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL } from '../../utils/Endpoints';


const TblBody = () => {
    const {values, setFieldValue} = useFormik({
        initialValues: {
            startDate:'',
            endDate:'',
            holidayTypes: 1,
            startTime:'',
            endTime:''
        }
    })

    const startDateChange = (date) => setFieldValue("startDate", date);
    const endDateChange = (date) => setFieldValue("endDate", date);
    const startTimeChange = (date) => setFieldValue("startTime", date);
    const endTimeChange = (date) => setFieldValue("endTime", date);

    return (
        <tbody>
            <tr>
                <td>
                    <DatePicker value={values.startDate} onChange={startDateChange} name="startDate" />
                </td>
                <td>
                    <DatePicker value={values.endDate} onChange={endDateChange} name="startDate" />
                </td>
                <td>
                    <FormDropdown options={holidayTypes} default_value={values.holidayTypes} classnm="form-select" />
                </td>
                <td>
                    <DatePicker value={values.startTime} onChange={startTimeChange} timeOnly={true} />
                </td>
                <td>
                    <DatePicker value={values.endTime} onChange={endTimeChange} timeOnly={true} />
                </td>
                <td><span className="icon lnk delete" data-bs-title="Delete"><i className="bi bi-trash-fill"></i></span></td>
            </tr>
        </tbody>
    )
}

const BreakSection = ({title, imgPath}) => {
    return (
        <div className="row mb-3">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <p className="fs-12 fw-semibold mb-0">
                                    <img src={imgPath} alt={title} />&nbsp; {title}
                                </p>
                            </div>
                        </div>

                        <div className="row align-items-center mt-10">
                            <div className="col-md-12">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                <thead>
                                    <tr>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Type</th>
                                        <th>Opening Time</th>
                                        <th>Closing Time</th>
                                        <th><span className="me-2 icon lnk edit" data-bs-title="Add New"><i className="bi bi-plus-lg"></i></span></th>
                                    </tr>
                                </thead>
                                    <TblBody />
                                </table>
                            </div>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default function HolidayCalendar() {

    const apiRequest = useRequest();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [refreshData, setRefreshData] = useState(true);
    const {data:locationdt, loading:locationloading} = GetLocations();
    const currentYear = new Date().getFullYear();
    const [Year, setYear] = useState(currentYear);
    const years = [];

    // LOCATION CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshData(true);
    }

    // ONLOAD //
    useEffect(() => {

        if(!locationloading && locationdt){
            setCurrentLocation(locationdt.data[0].value);
        }

    }, [locationdt, locationloading]);


    useEffect(() => {

        const getData = async () => {
            
            const data = {client_id: currentLocation, year: Year};
            const response = await apiRequest({url: GETHOIDAYCAL, method: "post", data});
            console.log("response", response)
        }

        if(refreshData){
            setRefreshData(false);
            getData();
        }


    }, [refreshData, currentLocation, Year])


    for (let i = 0; i < 6; i++) {
        years.push({id: Year - i, label: Year - i, value: Year - i});
    }

    const yearChange = (e) => {
        setYear(e.target.value);
        setRefreshData(true);
    }

  return (
    <div>
        <div className="row mb-3">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <p className="fs-15 fw-semibold mb-0">Holiday Settings</p>
                            </div>
                            <div className="col-md-5">
                                &nbsp;
                            </div>
                            <div className="col-md-3">
                            <label className="form-label fs-12 fw-semibold">Location</label>
                            {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />}
                            </div>
                            <div className="col-md-1">
                                <label className="form-label fs-12 fw-semibold">Year</label>
                                <FormDropdown options={years} onChange={yearChange} classnm="form-select fs-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <p className="fs-12 fw-semibold mb-0">
                                    <img src='./images/happy.png' />&nbsp; Holidays 
                                </p>
                            </div>
                        </div>

                        <div className="row align-items-center mt-10">
                            <div className="col-md-12">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Opening Time</th>
                                            <th>Closing Time</th>
                                            <th><span className="me-2 icon lnk edit" data-bs-title="Add New"><i className="bi bi-plus-lg"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input type='text' className='form-control' /></td>
                                            <td><input type='text' className='form-control' /></td>
                                            <td><input type='text' className='form-control' /></td>
                                            <td><input type='text' className='form-control' /></td>
                                            <td><input type='text' className='form-control' /></td>
                                            <td><span className="icon lnk delete" data-bs-title="Delete"><i className="bi bi-trash-fill"></i></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <BreakSection title="Spring Break" imgPath="./images/break.png" />
        <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png" />
        <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" />
        <BreakSection title="Winter Break" imgPath="./images/snowman.png" />
        <BreakSection title="Christmas Break" imgPath="./images/snowman.png" />

    </div>
  )
}
