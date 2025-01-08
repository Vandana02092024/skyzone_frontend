import React, { useEffect, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL } from '../../utils/Endpoints';
import { holidayTypes } from '../../utils/Common';


const TblBody = ({ data ={}, onDelete,title,index}) => {
    const { values, setFieldValue } = useFormik({
    initialValues: {
            id: index,
            startDate: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date) : '',
            endDate: data.end_date && data.end_date !== "0000-00-00" ? new Date(data.end_date) : '',
            holidayTypes: data.type || 1,
            startTime: data.start_time && data.start_time !== "00:00" ? new Date(`${data.start_date}T${data.start_time}:00`) : '',
            endTime: data.end_time && data.end_time !== "00:00" ? new Date(`${data.end_date}T${data.end_time}:00`) : '',
        },
        enableReinitialize: true,
    });


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
                    <DatePicker value={values.endDate} onChange={endDateChange} name="endDate" />
                </td>
                <td>
                    <FormDropdown
                        options={holidayTypes}
                        default_value={values.holidayTypes}
                        classnm="form-select"
                    />
                </td>
                <td>
                    <DatePicker value={values.startTime} onChange={startTimeChange} timeOnly />
                </td>
                <td>
                    <DatePicker value={values.endTime} onChange={endTimeChange} timeOnly />
                </td>
                <td>
                    <span
                        className="icon lnk delete"
                        data-bs-title="Delete"
                        onClick={() => onDelete(title, values.id)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </span>
                </td>
            </tr>
        </tbody>
    );
};


const BreakSection = ({title, imgPath,data,onAdd, onDelete }) => {
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
                                        <th><span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={() => onAdd(title)}><i className="bi bi-plus-lg"></i></span></th>
                                    </tr>
                                </thead>
                                {data.length>0 ?(
                                    data.map((item,index) => (
                                        <TblBody key={item.id} data={item} title ={title} onDelete={onDelete} index={index}/>
                                    ))
                                ):(
                                    <TblBody/>
                                )
                                }
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
    const [data,setData] = useState([]);
    const[springBreak, setSpringBreak] = useState([ ]);
    const[ summerBreak,setSummerBreak] = useState([]);
    const[thanksgivingBreak,setThanksgivingBreak] = useState([]);
    const[winterBreak,setWinterBreak] = useState([]);
    const[christmasBreak, setChristmasBreak]= useState([]);
    const [holiday, setHoliday] = useState([]);

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
            if (Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]); 
            }
        }
        if(refreshData){
            setRefreshData(false);
            getData();
        }

    }, [refreshData, currentLocation, Year,apiRequest])

    const handleAddHoliday = (holidayType) => {
        const newHoliday = {
            id: 0, 
            holiday_desc: holidayType,
            start_date: '',
            end_date: '',
            type: 1,
            start_time: '',
            end_time: ''
        };

        const common = {
            id:0,
            event:'',
            start_date:'',
           start_time: '',
            end_time: ''

        }

        if (holidayType === 'Spring Break') {
            setSpringBreak([...springBreak, newHoliday]);
        } else if (holidayType === 'Summer Break') {
            setSummerBreak([...summerBreak, newHoliday]);
        } else if (holidayType === 'Winter Break') {
            setWinterBreak([...winterBreak, newHoliday]);
        } else if (holidayType === 'Christmas') {
            setChristmasBreak([...christmasBreak, newHoliday]);
        } else if (holidayType === 'Thanks Giving Break') {
            setThanksgivingBreak([...thanksgivingBreak, newHoliday]);
        } else {
            setHoliday([...holiday, common]);
        }
    };

    const handleDeleteHoliday = (holidayType, ind) => {
        if (holidayType === 'Spring Break') {
            const NewList = springBreak.filter((list, index) => {
                return (index !== ind && list)
            })
            setSpringBreak(NewList);
        } else if (holidayType === 'Summer Break') {
            const NewList = summerBreak.filter((list, index) => {
                return (index !== ind && list)
            })
            setSummerBreak(NewList);
        } else if (holidayType === 'Winter Break') {
            const NewList = winterBreak.filter((list, index) => {
                return (index !== ind && list)
            })
            setWinterBreak(NewList);
        } else if (holidayType === 'Christmas') {
            const NewList = christmasBreak.filter((list, index) => {
                return (index !== ind && list)
            })
            setChristmasBreak(NewList);
        } else if (holidayType === 'Thanks Giving Break') {
            const NewList = thanksgivingBreak.filter((list, index) => {
                return (index !== ind && list)
            })
            setThanksgivingBreak(NewList);
        } else {
            setHoliday(holiday.filter((list, index) =>{
                return (index !==ind && list)
            } ))
        }
    };


    useEffect(() => {
        console.log("data:", data);
        if (Array.isArray(data)) {
            data.forEach((holiday) => {
                console.log("holiday", holiday);
                if (holiday.holiday_desc === "Spring Break") {
                    setSpringBreak((prev) => [...prev, holiday]);
                }else if(holiday.holiday_desc === "Summer Break"){
                    setSummerBreak((prev) => [...prev, holiday]);
                }else if(holiday.holiday_desc === "Winter Break"){
                    setWinterBreak((prev) => [...prev, holiday]);
                }else if(holiday.holiday_desc==="Christmas"){
                    setChristmasBreak((prev) => [...prev, holiday]);
                } else if(holiday.holiday_desc==="Thanks Giving Break"){
                    setThanksgivingBreak((prev) => [...prev, holiday]);
                }else{
                    setHoliday((prev)=>[...prev,holiday]);
                }
            });
        }
    }, [data]);
    


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
                                    <img src='./images/happy.png' alt='' />&nbsp; Holidays 
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
                                            <th><span className="me-2 icon lnk edit" data-bs-title="Add New"  onClick={() => handleAddHoliday()}><i className="bi bi-plus-lg"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {holiday.length > 0 ? (
                                        holiday.map((data, index) => (
                                            <tr key={data.id || index}>
                                                <td><input type='text' className='form-control' value={data.holiday_desc} /></td>
                                                <td><input type='text' className='form-control' value={data.start_date} /></td>
                                                <td>
                                                    <FormDropdown
                                                        options={holidayTypes}
                                                        default_value={data.type}
                                                        classnm="form-control"
                                                    />
                                                </td>
                                                <td><input type='text' className='form-control' value={data.start_time} /></td>
                                                <td><input type='text' className='form-control' value={data.end_time} /></td>
                                                <td>
                                                    <span 
                                                        className="icon lnk delete" 
                                                        data-bs-title="Delete" 
                                                        onClick={() => handleDeleteHoliday(data.holiday_desc, index)}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td><input type='text' className='form-control' placeholder="" /></td>
                                            <td><input type='text' className='form-control' placeholder="" /></td>
                                            <td>
                                                <FormDropdown
                                                    options={holidayTypes}
                                                    default_value="Default type"
                                                    classnm="form-control"
                                                />
                                            </td>
                                            <td><input type='text' className='form-control' placeholder="" /></td>
                                            <td><input type='text' className='form-control' placeholder="" /></td>
                                            <td>
                                                <span 
                                                    className="icon lnk delete" 
                                                    data-bs-title="Delete" 
                                                    onClick={() => handleDeleteHoliday("", 0)}
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    )}

                                    </tbody>
                                </table>
                            </div>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <BreakSection title="Spring Break" imgPath="./images/break.png"  data={springBreak}  onAdd={handleAddHoliday} onDelete={handleDeleteHoliday}/>
        <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png"  data={summerBreak}  onAdd={handleAddHoliday} onDelete={handleDeleteHoliday}/>
        <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" data={thanksgivingBreak}  onAdd={handleAddHoliday} onDelete={handleDeleteHoliday}/>
        <BreakSection title="Winter Break" imgPath="./images/snowman.png" data={winterBreak}  onAdd={handleAddHoliday} onDelete={handleDeleteHoliday} />
        <BreakSection title="Christmas Break" imgPath="./images/snowman.png" data={christmasBreak}  onAdd={handleAddHoliday} onDelete={handleDeleteHoliday}  />

    </div>
  )
}
