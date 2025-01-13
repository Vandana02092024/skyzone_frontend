import React, { useEffect, useState,useMemo } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL } from '../../utils/Endpoints';
import { holidayTypes } from '../../utils/Common';

// const TblBody = ({ data ={}, onDelete,index,title }) => {
//     const { values, setFieldValue } = useFormik({
//     initialValues: {
//         id: index ? index : data.id,
//         holiday_desc:title,
//         startDate: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date) : '',
//         endDate: data.end_date && data.end_date !== "0000-00-00" ? new Date(data.end_date) : '',
//         holidayTypes: data.type || 1,
//         startTime: data.start_time && data.start_time !== "00:00" ? new Date(`${data.start_date}T${data.start_time}:00`) : '',
//         endTime: data.end_time && data.end_time !== "00:00" ? new Date(`${data.end_date}T${data.end_time}:00`) : '',
//     },
//         enableReinitialize: true,
//     });

//     const startDateChange = (date) => { setFieldValue("startDate", date);}
//     const endDateChange = (date) => { setFieldValue("endDate", date);}
//     const startTimeChange = (date) => { setFieldValue("startTime", date);}
//     const endTimeChange = (date) => { setFieldValue("endTime", date); }
//     const holidayTypesChange = (event) => { 
//         const value = event.target.value; 
//         setFieldValue("holidayTypes", value); 
//     };

//     return (
//         <tbody>
//             <tr>
//                 <td>
//                     <DatePicker value={values.startDate} onChange={startDateChange} name="startDate" />
//                 </td>
//                 <td>
//                     <DatePicker value={values.endDate} onChange={endDateChange} name="endDate" />
//                 </td>
//                 <td>
//                     <FormDropdown
//                         options={holidayTypes}
//                         default_value={values.holidayTypes}
//                         classnm="form-select"
//                         onChange={holidayTypesChange}
//                     />
//                 </td>
//                 <td>
//                     <DatePicker value={values.startTime} onChange={startTimeChange} timeOnly />
//                 </td>
//                 <td>
//                     <DatePicker value={values.endTime} onChange={endTimeChange} timeOnly />
//                 </td>
//                 <td>
//                     <span
//                         className="icon lnk delete"
//                         data-bs-title="Delete"
//                         onClick={() => onDelete(values.id)}
//                     >
//                         <i className="bi bi-trash-fill"></i>
//                     </span>
//                 </td>
//             </tr> 
//         </tbody>
//     );
// };

// const BreakSection = ({title, imgPath,data}) => {
//     const [values, setValues] = useState([]);

//     const handleDeleteHoliday = (ind) => {
//         const NewList = values.filter((list, index) => {
//             return (index !== ind && list)
//         })
//         setValues(NewList);
//     };

//     const newHoliday = useMemo(() => [{
//         id: 0,
//         holiday_desc: title,
//         start_date: '',
//         end_date: '',
//         type: 1,
//         start_time: '',
//         end_time: ''
//     }], [title]);


//     useEffect(() => {
//         setValues(data);
//     }, [data]);

//     useEffect(() => {
//         if(values.length === 0)
//             setValues(newHoliday);
//     }, [values,newHoliday])

//     const AddRow = () => {
//         setValues((prev) => [...prev,  newHoliday]);
//     }

//     // const updatedFieldsDone = { ...values };

//     // Object.keys(values).forEach((key) => {
//     //     if (values[key] !== data[key]) {
//     //         updatedFieldsDone[key] = values[key];
//     //     }
//     // });
//     // updatedFieldsDone.id = data.id || 0;

//     // setUpdatedRecordsDone(updatedFieldsDone);

//     // console.log("updatedRecords", updatedRecordsDone);

//     return (
//         <div className="row mb-3">
//             <div className="col-md-12">
//                 <div className="card border-0">
//                     <div className="card-body">
//                         <div className="row align-items-center">
//                             <div className="col-md-12">
//                                 <p className="fs-12 fw-semibold mb-0">
//                                     <img src={imgPath} alt={title} />&nbsp; {title}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="row align-items-center mt-10">
//                             <div className="col-md-12">
//                             <div className="ss-table table-responsive">
//                                 <table className="table">
//                                 <thead>
//                                     <tr>
//                                         <th>Start Date</th>
//                                         <th>End Date</th>
//                                         <th>Type</th>
//                                         <th>Opening Time</th>
//                                         <th>Closing Time</th>
//                                         <th><span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={() => AddRow(title)}><i className="bi bi-plus-lg"></i></span></th>
//                                     </tr>
//                                 </thead>
//                                 {values.length > 0 &&
//                                     values.map((item,index) => (
//                                         <TblBody key={item.id} data={item} title ={title} onDelete={handleDeleteHoliday} index={index}
//                                         />
//                                     ))
//                                 }
//                                 </table>
//                             </div>
//                             </div>
                            
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

const TblBody = ({ data = {}, onDelete, onUpdate, index, title }) => {
    const { values, setFieldValue } = useFormik({
        initialValues: {
            id: index ? index : data.id,
            holiday_desc: title,
            start_date: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date) : '',
            end_date: data.end_date && data.end_date !== "0000-00-00" ? new Date(data.end_date) : '',
            type: data.type || 1,
            start_time: data.start_time && data.start_time !== "00:00" ? new Date(`${data.start_date}T${data.start_time}:00`) : '',
            end_time: data.end_time && data.end_time !== "00:00" ? new Date(`${data.end_date}T${data.end_time}:00`) : '',
        },
        enableReinitialize: true,
    });

    const startDateChange = (date) => { setFieldValue("start_date", date); }
    const endDateChange = (date) => { setFieldValue("end_date", date); }
    const startTimeChange = (date) => { setFieldValue("start_time", date); }
    const endTimeChange = (date) => { setFieldValue("end_time", date); }
    const holidayTypesChange = (event) => { 
        const value = event.target.value; 
        setFieldValue("type", value); 
    };
    useEffect(() => {
        onUpdate(values);
    }, [values]);

    return (
        <tbody>
            <tr>
                <td>
                    <DatePicker value={values.start_date} onChange={startDateChange} name="start_date" />
                </td>
                <td>
                    <DatePicker value={values.end_date} onChange={endDateChange} name="end_date" />
                </td>
                <td>
                    <FormDropdown
                        options={holidayTypes}
                        default_value={values.type}
                        classnm="form-select"
                        onChange={holidayTypesChange}
                    />
                </td>
                <td>
                    <DatePicker value={values.start_time} onChange={startTimeChange} timeOnly />
                </td>
                <td>
                    <DatePicker value={values.end_time} onChange={endTimeChange} timeOnly />
                </td>
                <td>
                    <span
                        className="icon lnk delete"
                        data-bs-title="Delete"
                        onClick={() => onDelete(values.id)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </span>
                </td>
            </tr>
        </tbody>
    );
};

const BreakSection = ({ title, imgPath, data, onAddOrUpdate, onDelete }) => {
    const [values, setValues] = useState(data.length > 0 ? data : [{
        id: 0,
        holiday_desc: title,
        start_date: '',
        end_date: '',
        type: 1,
        start_time: '',
        end_time: ''
    }]); 

    useEffect(() => {
        setValues(data.length > 0 ? data : [{
            id: 0,
            holiday_desc: title,
            start_date: '',
            end_date: '',
            type: 1,
            start_time: '',
            end_time: ''
        }]);
    }, [data, title]);

    const handleDeleteHoliday = (ind) => {
        const NewList = values.filter((list, index) => {
            return (index !== ind && list)
        })
        setValues(NewList);
        onDelete(NewList);
    };

    const handleUpdateHoliday = (updatedHoliday) => {
        // console.log("updatedHoliday", updatedHoliday);
        const updatedList = values.map((item) =>
            item.id === updatedHoliday.id ? {...updatedHoliday}: item 
        );
        // console.log("updatedList",updatedList);
        setValues(updatedList);
    };

    const handleAddHoliday = () => {
        setValues((prev) => [...prev, {
            id: 0,
            holiday_desc: title,
            start_date: '',
            end_date: '',
            type: 1,
            start_time: '',
            end_time: ''
        }]);
    };

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
                                                <th><span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={handleAddHoliday}><i className="bi bi-plus-lg"></i></span></th>
                                            </tr>
                                        </thead>
                                        {values.length > 0 &&
                                            values.map((item, index) => (
                                                <TblBody 
                                                    key={item.id} 
                                                    data={item} 
                                                    title={title} 
                                                    onDelete={handleDeleteHoliday} 
                                                    onUpdate={handleUpdateHoliday}
                                                    index={index}
                                                />
                                            ))
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const TblBodyInput = ({ data ={}, onDelete,index}) => {
    const { values, setFieldValue, handleChange} = useFormik({
    initialValues: {
    id: index?index :0,
    event: data.holiday_desc || '',
    start_date: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date) : null,
    end_date: data.end_date && data.end_date !== "0000-00-00" ? new Date(data.end_date) : null,
    type: data.type || 1,
    start_time: data.start_time && data.start_time !== "00:00" && data.start_date 
        ? new Date(`${data.start_date}T${data.start_time}:00`) 
        : null,
    end_time: data.end_time && data.end_time !== "00:00" && data.start_date 
        ? new Date(`${data.start_date}T${data.end_time}:00`) 
        : null,
    },
    });

    const startDateChange = (date) => setFieldValue("start_date", date);
    const startTimeChange = (date) => setFieldValue("start_time", date);
    const endTimeChange = (date) => setFieldValue("end_time", date);

    return (
        <tbody>
            <tr>
                <td><input type='text' className='form-control' value={values.event} name='event' onChange={handleChange} /></td>
                <td>
                    <DatePicker value={values.start_date} onChange={startDateChange} name="start_date"/>
                </td>
                <td>
                    <FormDropdown
                        options={holidayTypes}
                        default_value={values.holidayTypes}
                        classnm="form-select"
                        onChange={(e) => setFieldValue("holidayTypes", e.target.value)}
                    />
                </td>
                <td>
                    <DatePicker value={values.start_time} onChange={startTimeChange} timeOnly />
                </td>
                <td>
                    <DatePicker value={values.end_time} onChange={endTimeChange} timeOnly />
                </td>
                <td>
                    <span
                        className="icon lnk delete"
                        data-bs-title="Delete"
                        onClick={() => onDelete(values.id)}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </span>
                </td>
            </tr>
        </tbody>
    );
};

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

    const [holidaysValues, setHolidaysValues] = useState([]);
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

    
    useEffect(() => {
        if (Array.isArray(data)) {
            data.forEach((holiday) => {
                if (holiday.holiday_desc === "Spring Break") {
                    setSpringBreak((prev) => [...prev, holiday]);
                }else if(holiday.holiday_desc === "Summer Break"){
                    setSummerBreak((prev) => [...prev, holiday]);
                }else if(holiday.holiday_desc === "Winter Break"){
                    setWinterBreak((prev) => [...prev, holiday]);
                }else if(holiday.holiday_desc==="Christmas || Christmas Break"){
                    setChristmasBreak((prev) => [...prev, holiday]);
                } else if(holiday.holiday_desc==="Thanks Giving Break"){
                    setThanksgivingBreak((prev) => [...prev, holiday]);
                }else{
                    setHoliday((prev)=>[...prev,holiday]);
                }
            });
        }
    }, [data]);

    const handleDeleteHoliday = (ind) => {
        setHolidaysValues(holidaysValues.filter((list, index) =>{
            return (index !==ind && list)
        } ))
    }; 
    
    
    for (let i = 0; i < 6; i++) {
        years.push({id: Year - i, label: Year - i, value: Year - i});
    }

    const yearChange = (e) => {
        setYear(e.target.value);
        setRefreshData(true);
    }

    const common = useMemo(() => [{
        id: 0,
        holiday_desc: '',
        event: '',
        start_date: '',
        type: 1,
        start_time: '',
        end_time: ''
    }], []);

    useEffect(() => {
        setHolidaysValues(holiday);
    }, [holiday]);

    useEffect(() => {
        if(holidaysValues.length === 0)
            setHolidaysValues(common);
    }, [holidaysValues,common])

    const handleAddHoliday = () => {
        setHolidaysValues((prev) => [...prev, common]);
    }

    console.log("data",data)

    
    const handleAddOrUpdate = (updatedData) => {
        setSpringBreak(updatedData.filter(item => item.holiday_desc === "Spring Break"));
        setSummerBreak(updatedData.filter(item => item.holiday_desc === "Summer Break"));
        setWinterBreak(updatedData.filter(item => item.holiday_desc === "Winter Break"));
        setChristmasBreak(updatedData.filter(item => item.holiday_desc === "Christmas Break"));
        setThanksgivingBreak(updatedData.filter(item => item.holiday_desc === "Thanks Giving Break"));
    };
  return (
    <div>
        <div className="row mb-3">
            <div className='row'>
                <div className="col-md-12 mb-3 text-md-end">
                    <button className="ss_btn">Save Setting</button>
                </div>
            </div>
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
                                    {holidaysValues.length > 0 &&
                                        holidaysValues.map((item,index) => (
                                            <TblBodyInput key={item.id} data={item} onDelete={handleDeleteHoliday} index={index}/>
                                        ))
                                    }
                                </table>
                            </div>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>

        

        <BreakSection title="Spring Break" imgPath="./images/break.png"  data={springBreak}  onAddOrUpdate={handleAddOrUpdate}  onAdd={setSpringBreak} onDelete={setSpringBreak} currentLocation={currentLocation} year={Year}/>
        <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png"  data={summerBreak}   onAddOrUpdate={handleAddOrUpdate}  onAdd={setSummerBreak} onDelete={setSummerBreak} currentLocation={currentLocation} year={Year}/>
        <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" data={thanksgivingBreak}  onAddOrUpdate={handleAddOrUpdate}   onAdd={setThanksgivingBreak} onDelete={setThanksgivingBreak} currentLocation={currentLocation} year={Year}/>
        <BreakSection title="Winter Break" imgPath="./images/snowman.png" data={winterBreak}   onAddOrUpdate={handleAddOrUpdate}  onAdd={setWinterBreak} onDelete={setWinterBreak} currentLocation={currentLocation} year={Year} />
        <BreakSection title="Christmas Break" imgPath="./images/snowman.png" data={christmasBreak}  onAddOrUpdate={handleAddOrUpdate}   onAdd={setChristmasBreak} onDelete={setChristmasBreak} currentLocation={currentLocation} year={Year}/>

    </div>
  )
}
