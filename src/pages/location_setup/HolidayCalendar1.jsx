import React, { useEffect, useRef, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL } from '../../utils/Endpoints';
import { holidayTypes, messagePop } from '../../utils/Common';
import { holidayCalendarValidation } from '../../utils/validationSchemas';
import SweetAlert from '../../components/SweetAlert';

const TblBody = ({ data = {}, onDelete, index, title, onChange }) => {
    const { values, setFieldValue ,errors, touched, handleBlur } = useFormik({
        initialValues: {
            id: data.id || 0,
            holiday_desc: data.holiday_desc || '',
            start_date: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date):'',
            end_date: data.end_date && data.end_date !== "0000-00-00"  ? new Date(data.end_date)  : '',
            type: data.type || 1,
            start_time: data.start_time || '',
            end_time:  data.end_time || '',
        },
        enableReinitialize: true,
        validationSchema: holidayCalendarValidation,
    });

    const setTime = (timeString) => {
        const defaultTime = new Date();  
        if (typeof timeString === "string" && timeString.includes(":")) {
            const [hours, minutes] = timeString.split(":").map(Number);
            defaultTime.setHours(hours, minutes, 0);
        } else if (timeString instanceof Date && !isNaN(timeString)) {
            defaultTime.setHours(timeString.getHours(), timeString.getMinutes(), 0);
        }
        return defaultTime;
    };
    const startTime = values.start_time ? setTime(values.start_time) : ''; 
    const endTime = values.end_time ? setTime(values.end_time) : ''; 
    const startDateChange = (date) => setFieldValue("start_date", date );
    const endDateChange = (date) => setFieldValue("end_date", date);
    const startTimeChange = (time)  => { setFieldValue("start_time", time); }
    const endTimeChange = (time) => { setFieldValue("end_time", time); }
    const descriptionChange = (e) => { setFieldValue("holiday_desc", e.target.value); };
    const holidayTypesChange = (e) => { setFieldValue("type", parseInt(e.target.value)); };
    useEffect(() => {
        onChange({ ...values });
    }, [values]);

    return (
        <tbody>
            <tr>
                {title === "Holidays" && (
                    <td>
                        <input type="text"  className="form-control" value={values.holiday_desc} onChange={descriptionChange} name="holiday_desc"  onBlur={handleBlur} />
                        {errors.holiday_desc && touched.holiday_desc && <p className='text-danger fs-12'>{errors.holiday_desc}</p>}
                    </td>
                )}
                <td>
                    <DatePicker value={values.start_date} onChange={startDateChange} name="start_date" className="form-control"  onBlur={handleBlur} />
                    {errors.start_date && touched.start_date && <p className='text-danger fs-12'>{errors.start_date}</p>}
                </td>
                {title !== "Holidays" && (
                    <td>
                        <DatePicker value={values.end_date} onChange={endDateChange} name="end_date" className="form-control"  onBlur={handleBlur}/>
                        {errors.end_date && touched.end_date && <p className='text-danger fs-12'>{errors.end_date}</p>}
                    </td>
                )}
                <td>
                    <FormDropdown options={holidayTypes} default_value={values.type} name="type" classnm="form-select"
                     onChange={holidayTypesChange}  onBlur={handleBlur} />
                    {errors.type && touched.type && <p className='text-danger fs-12'>{errors.type}</p>}
                </td>          
                <td>
                    <DatePicker value={startTime} onChange={startTimeChange}  name="start_time" timeOnly  onBlur={handleBlur}  />
                    {errors.start_time && touched.start_time && <p className='text-danger fs-12'>{errors.start_time}</p>}
                </td>
                <td>
                    <DatePicker value={endTime} onChange={endTimeChange}  name="end_time" timeOnly  onBlur={handleBlur}/>
                    {errors.end_time && touched.end_time && <p className='text-danger fs-12'>{errors.end_time}</p>}
                </td>
                <td>
                    <span
                        className="icon lnk delete"
                        data-bs-title="Delete"
                        onClick={() => {
                            if (values.id > 0) {
                                onDelete( index, values.id); 
                            } else {
                                onDelete(index);
                            }
                        }}
                    >
                        <i className="bi bi-trash-fill"></i>
                    </span>
                </td>
            </tr>
        </tbody>
    );
};

const BreakSection = ({ title, imgPath, data, onAdd, onDelete, onChange }) => {
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
                                                {title === "Holidays" && <th>Event</th>}
                                                <th>{title === "Holidays" ? "Date" : "Start Date"}</th>
                                                {title !== "Holidays" && <th>End Date</th>}
                                                <th>Type</th>
                                                <th>Opening Time</th>
                                                <th>Closing Time</th>
                                                <th>
                                                    <span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={onAdd}>
                                                        <i className="bi bi-plus-lg"></i>
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        {data.map((item, index) => (
                                            <TblBody
                                                key={index}
                                                data={item}
                                                index={index}
                                                title={title}
                                                onDelete={onDelete}
                                                // onDelete={() => onDelete(index, item.id)}
                                                onChange={(updatedItem) => onChange(index, updatedItem)}
                                            />
                                        ))}
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

export default function Calendar() {
    const apiRequest = useRequest();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [refreshData, setRefreshData] = useState(true);
    const { data: locationdt, loading: locationloading } = GetLocations();
    const currentYear = new Date().getFullYear();
    const [Year, setYear] = useState(currentYear);
    const [breakSections, setBreakSections] = useState({
        springBreak: [{ id: 0, holiday_desc: "Spring Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        summerBreak: [{ id: 0, holiday_desc: "Summer Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        winterBreak: [{ id: 0, holiday_desc: "Winter Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        thanksGivingBreak: [{ id: 0, holiday_desc: "Thanks Giving Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        christmasBreak: [{ id: 0, holiday_desc: "Christmas Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        holidays: [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "",end_time: "", }],
    });
    const [data, setData] = useState([]);
    const years = [];
    const initialBreakSectionsRef = useRef(breakSections);

    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshData(true);
    };

    useEffect(() => {
        if (!locationloading && locationdt) {
            setCurrentLocation(locationdt.data[0].value);
        }
    }, [locationdt, locationloading]);

    useEffect(() => {
        const getData = async () => {
            const data = { client_id: currentLocation, year: Year };
            const response = await apiRequest({ url: GETHOIDAYCAL, method: "post", data });
            if (Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
            }
        };
        if (refreshData) {
            setRefreshData(false);
            getData();
        }
    }, [refreshData, currentLocation, Year, apiRequest]);

    useEffect(() => {
        if (Array.isArray(data)) {
            const filteredSections = {
                springBreak: data.filter((holiday) => holiday.holiday_desc === "Spring Break"),
                summerBreak: data.filter((holiday) => holiday.holiday_desc === "Summer Break"),
                thanksGivingBreak: data.filter((holiday) => holiday.holiday_desc === "Thanks Giving Break"),
                winterBreak: data.filter((holiday) => holiday.holiday_desc === "Winter Break"),
                christmasBreak: data.filter((holiday) => holiday.holiday_desc === "Christmas Break" || holiday.holiday_desc === "Christmas"),
                holidays: data.filter((holiday) => 
                    !["Spring Break", "Summer Break", "Thanks Giving Break", "Winter Break", "Christmas Break", "Christmas"].includes(holiday.holiday_desc)
                ),
            }; 
            setBreakSections((prev) => ({
                springBreak: filteredSections.springBreak.length ? filteredSections.springBreak  : prev.springBreak,
                summerBreak: filteredSections.summerBreak.length ? filteredSections.summerBreak : prev.summerBreak,
                thanksGivingBreak: filteredSections.thanksGivingBreak.length ? filteredSections.thanksGivingBreak : prev.thanksGivingBreak,
                winterBreak: filteredSections.winterBreak.length ? filteredSections.winterBreak : prev.winterBreak,
                christmasBreak: filteredSections.christmasBreak.length ? filteredSections.christmasBreak : prev.christmasBreak,
                holidays: filteredSections.holidays.length ? filteredSections.holidays : prev.holidays,
            }));
        }
    }, [data]);
    

    for (let i = 0; i < 6; i++) {
        years.push({ id: Year - i, label: Year - i, value: Year - i });
    }

    const yearChange = (e) => {
        setYear(e.target.value);
        setRefreshData(true);
    };

    const updatedSections = {};
    Object.keys(breakSections).forEach((section) => {
        if (JSON.stringify(breakSections[section]) !== JSON.stringify(initialBreakSectionsRef.current[section])) {
            updatedSections[section] = breakSections[section];
        }
    });
    console.log("updatedSections----------------------", updatedSections)

    const handleSave = async () => {
        alert("Settings saved successfully!");
        // const data = {client_id: currentLocation, data: updatedSections, year: Year};
        // const response = await apiRequest({
        //     url: ,
        //     method: "POST",
        //     data
        // });
        // messagePop(response);
    };

    const handleAddEntry = (section, title) => {
        const newEntry = {
            id: 0,
            holiday_desc: section === "holidays" ? "" : title,
            start_date: "",
            ...(title !== "Holidays" && { end_date: "" }),
            type: 1,
            start_time: "",
            end_time: "",
        };
        setBreakSections((prev) => ({  ...prev, [section]: [...prev[section], newEntry] }));
    };

    const handleDeleteEntry = async (section, index, id) => {
        try {
            if (id > 0) {
                const title = "Are you sure?";
                const text = "Are you sure you want to delete this record?";
                const confirm = await SweetAlert.confirm(title, text);
    
                if (confirm) {
                    const deleteOffer = await apiRequest({
                        // url: OFFER_DELETE,
                        method: "delete",
                        params: { id: id },
                    });
    
                    messagePop(deleteOffer);
    
                    if (deleteOffer.status === "success") {
                        setRefreshData(false);
                        const updatedSection = breakSections[section].filter(item => item.id !== id);
                        setBreakSections({ ...breakSections, [section]: updatedSection });
                    } else {
                        SweetAlert.error("Failed to delete the record:" + deleteOffer.message);
                    }
                } else {
                    SweetAlert.error("Error!", "Deletion was canceled.");
                }
            } else {
                const updatedSection = breakSections[section].filter((_, idx) => idx !== index);
                setBreakSections({ ...breakSections,[section]: updatedSection});
            }
        } catch (error) {
            SweetAlert.error("Error in deleting the record:" + error);
        }
    };
    

    const handleUpdateEntry = (section, index, updatedItem) => {
        setBreakSections((prev) => ({ ...prev,
            [section]: prev[section].map((item, i) =>
                i === index ? { ...item, ...updatedItem } : item
            ),
        }));
    };

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-12 mb-3 text-md-end">
                    <button className="ss_btn" onClick={handleSave}>
                        Save Setting
                    </button>
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
            <div>
                <BreakSection title="Holidays" imgPath="./images/happy.png" data={breakSections.holidays}
                    onAdd={() => handleAddEntry("holidays","Holidays")}
                    onDelete={(index,id) => handleDeleteEntry("holidays", index ,id)}
                    onChange={(index, updatedItem) => handleUpdateEntry("holidays", index, updatedItem)}
                />
                <BreakSection title="Spring Break" imgPath="./images/break.png" data={breakSections.springBreak}
                    onAdd={() => handleAddEntry("springBreak","Spring Break")}
                    onDelete={(index,id) => handleDeleteEntry("springBreak", index,id)}
                    onChange={(index, updatedItem) => handleUpdateEntry("springBreak", index, updatedItem)}
                />
                <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png" data={breakSections.summerBreak}
                    onAdd={() => handleAddEntry("summerBreak","Summer Break")}
                    onDelete={(index,id) => handleDeleteEntry("summerBreak", index, id)}
                    onChange={(index, updatedItem) => handleUpdateEntry("summerBreak", index, updatedItem)}
                    />
                <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" data={breakSections.thanksGivingBreak}
                    onAdd={() => handleAddEntry("thanksGivingBreak","Thanks Giving Break")}
                    onDelete={(index,id) => handleDeleteEntry("thanksGivingBreak", index ,id)}
                    onChange={(index, updatedItem) => handleUpdateEntry("thanksGivingBreak", index, updatedItem)}
                    />
                <BreakSection title="Winter Break" imgPath="./images/snowman.png" data={breakSections.winterBreak}
                    onAdd={() => handleAddEntry("winterBreak","Winter Break")}
                    onDelete={(index,id) => handleDeleteEntry("winterBreak", index, id)}
                    onChange={(index, updatedItem) => handleUpdateEntry("winterBreak", index, updatedItem)}
                    />
                <BreakSection title="Christmas Break" imgPath="./images/snowman.png" data={breakSections.christmasBreak}
                    onAdd={() => handleAddEntry("christmasBreak","Christmas Break")}
                    onDelete={(index,id) => handleDeleteEntry("christmasBreak", index, id)}
                    onChange={(index, updatedItem) => handleUpdateEntry("christmasBreak", index, updatedItem)}
                    />
            </div>
        </div>
    );
}