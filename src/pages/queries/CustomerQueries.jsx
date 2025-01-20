import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { decrypt, items_per_page, messagePop } from '../../utils/Common';
import { CUSTOMERQUERIES } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import Accordion from '../../components/Accordion';
import moment from 'moment';
import Pagination from '../../components/Pagination';
import FormDropdown from '../../components/FormDropdown';
import GetLocations from '../../hooks/Locations';
import DatePicker from "../../components/DatePicker.jsx";
import TinyMCEEditor from "../../editor/editor.jsx";
import { sendReply } from '../../utils/validationSchemas.jsx';
import { useFormik } from 'formik';

export default function CustomerQueries() {
    // const [RefresRecords, setRefresRecords] = useState(true);
    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [totalPages, setTotalPages] = useState(0);
    const apiRequest = useRequest();
    const { data: locationdt, loading: locationloading } = GetLocations();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

    const [RefresRecords, setRefresRecords] = useState(true);
    const [data, setData] = useState([
        {
            id: 1,
            subject: "Sample Query 1",
            created_at: "2025-01-01T12:00:00Z",
            message: "This is a sample query message.",
            messages: [
                {
                    user: { first_name: "John" },
                    message: "<b>Reply:</b> This is a sample reply.",
                    created_at: "2025-01-02T12:00:00Z",
                },
                {
                    user: { first_name: "John" },
                    message: "<b>Reply:</b> This is a sample reply.",
                    created_at: "2025-01-02T12:00:00Z",
                },
                {
                    user: { first_name: "John" },
                    message: "<b>Reply:</b> This is a sample reply.",
                    created_at: "2025-01-02T12:00:00Z",
                },
                {
                    user: { first_name: "John" },
                    message: "<b>Reply:</b> This is a sample reply.",
                    created_at: "2025-01-02T12:00:00Z",
                },
            ],
        },
        {
            id: 2,
            subject: "Sample Query 2",
            created_at: "2025-01-03T12:00:00Z",
            message: "This is another sample query message.",
            messages: [],
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [replyEditors, setReplyEditors] = useState({});
    const [expandMessages, setExpandMessages] = useState(false);

    // const dropDownChange = (e) => {
    //   // Dummy function for testing
    // };

    // const handleSearch = (e) => {
    //   // Dummy function for testing
    // };

    useEffect(() => {
        setLoading(true);
        setRefresRecords(false);
        setLoading(false);
    }, [RefresRecords]);

    const handleReplyToggle = (id) => {
        setReplyEditors((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // const handleReplySubmit = async (id, reply) => {
    //     console.log("id",id);
    //     console.log("reply",reply)
    //     try {
    //         alert("Reply saved successfully.");
    //         setRefresRecords(true);
    //     } catch (error) {
    //         console.error("Failed to save reply", error);
    //         alert("Failed to save reply. Please try again.");
    //     }
    // };

    // PAGE AND ITEMS SETTINGS //
    const [currentPage, setCurrentPage] = useState(1);

    // SEARCH USERS //
    const [search, setSearch] = useState(null);

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefresRecords(true);
    }

    const onSubmit = async (values, { resetForm }) => {
        const formData = {
            reply: values.reply,
            id: values.id, 
        };
    
        console.log("formData.............", formData);
    
        const response = await apiRequest(
            { url: "", method: "POST", data: formData },
            true
        );
    
        if (response) {
            messagePop(response);
            resetForm();
        }
    };

    const { values, errors, touched, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
            reply: "",
            id: "", 
        },
        validationSchema: sendReply,
        onSubmit,
    });
    


    // // COMPONENT MOUNTING 
    // useEffect(()=>{
    //     const getCustomerQueries = async () => {
    //         setLoading(true)
    //         const client_id = (currentLocation) ? {client_id : currentLocation} : "";
    //         const data = await apiRequest({
    //             url:CUSTOMERQUERIES, 
    //             method:"get", 
    //             params: {
    //                 page: currentPage, 
    //                 items_per_page: items_per_page, 
    //                 search: search, 
    //                 ...client_id
    //             }
    //         });

    //         setCurrentPage(data?.data?.page);
    //         setTotalPages(data?.data?.total_pages);
    //         setData(data?.data?.data);
    //         setLoading(false)    
    //     }

    //     if(RefresRecords){
    //         setRefresRecords(false)
    //         getCustomerQueries();
    //     }
    // }, [RefresRecords, apiRequest, currentPage, search, currentLocation])

    // useEffect(()=>{
    //     setRefresRecords(true);
    // }, [currentPage])

    const handleApplyFilter = () => {
        setFromDate(fromDate);
        setToDate(toDate);
        setRefresRecords(true);
    };

    const handleClearFilter = () => {
        setFromDate(new Date().toISOString().split("T")[0]);
        setToDate(new Date().toISOString().split("T")[0]);
        setRefresRecords(true);
    };

    return (
        <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">
            {locationloading
                ?
                <>
                    <div className="text-end mb-3">
                        <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end" />
                    </div>
                </>
                : locationdt &&
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="card border-0">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <p className="fs-15 fw-semibold mb-0">Filter Queries</p>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fs-12 fw-semibold">Location</label>
                                        {((locationloading))
                                            ?
                                            'Loading...'
                                            :
                                            locationdt &&
                                            <FormDropdown
                                                onChange={dropDownChange}
                                                name="location"
                                                options={locationdt.data}
                                                default_value={currentLocation}
                                                classnm="form-select fs-12"
                                                default_option={true}
                                            />
                                        }
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search</label>
                                        <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Queries" onChange={handleSearch} />
                                    </div>
                                </div>
                                <div className="fs-12 payments-filters">
                                    <div className="me-3">
                                        <label htmlFor="fromDate" className="form-label">
                                            From Date
                                        </label>
                                        <div>
                                            <DatePicker
                                                value={fromDate}
                                                onChange={(date) => setFromDate(date)}
                                                minDate={false}
                                                name="startDate"
                                            />
                                        </div>
                                    </div>
                                    <div className="me-3">
                                        <label htmlFor="toDate" className="form-label">
                                            To Date
                                        </label>
                                        <div>
                                            <DatePicker
                                                value={toDate}
                                                onChange={(date) => setToDate(date)}
                                                minDate={false}
                                                name="startDate"
                                            />
                                        </div>
                                    </div>
                                    <div className="me-3 mt-3 pt-md-1">
                                        <button className="ss_btn" onClick={handleApplyFilter}>
                                            Apply Filter
                                        </button>
                                    </div>
                                    <div className="me-3 mt-3 pt-md-1">
                                        <button className="refreshbtn" onClick={handleClearFilter}>
                                            Clear Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* <div className="card border-0 boxShadow">
            <div className="card-body">
                
                <div className="row">

                    <div className="col-md-12 mb-3">

                    {loading ? <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
              
                    :

                    <>
                        {data?.map(query => {
                            const email = decrypt(query?.mobile_customer?.email)
                            const phone = decrypt(query?.mobile_customer?.phone)
                            
                            return(
                                <Accordion addClass="mt-10" id={query.id} title={`${query.subject}`} key={query.id} infoTitle={moment(query.created_at).format('D MMM, YYYY') } >
                                    <div className="ss-table table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th width="5px">&nbsp;</th>
                                                    <th width="80%">Query</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <i className="bi bi-question-circle-fill">
                                                        </i> </td>
                                                    <td className='wrap-text pd-15 fs-15'>
                                                        {query.message}
                                                    </td>
                                                    <td>Open</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3}>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <th>&nbsp;</th>
                                                    <th>Customer Details</th>
                                                    <th>&nbsp;</th>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td>
                                                        <b>Name: </b>{query?.mobile_customer?.fname} {query?.mobile_customer?.lname} <br />
                                                        <b>Email: </b>{email} <br />
                                                        <b>Phone: </b>{phone}
                                                    </td>
                                                    <td>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Accordion>
                            )
                        })}
                    </>

                    }

                    {totalPages > 0 ?
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            refreshRecords={setRefresRecords}
                        />
                    :
                        <Skeleton variant="rectangular" width="100%" height={20} className="skeleton-custom text-end"/>
                    }
                        
                    </div>
                </div>
            </div>
        </div> */}
            <div className="card border-0 boxShadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            {loading ? (
                                <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
                            ) : (
                                <>
                                    {data?.map((query) => (
                                        <Accordion
                                            addClass="mt-10" id={query.id} title={query.subject} key={query.id}  infoTitle={moment(query.created_at).format("D MMM, YYYY")}>
                                            <div className="ss-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th width="5px">&nbsp;</th>
                                                            <th width="80%">Query</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <i className="bi bi-question-circle-fill"></i>
                                                            </td>
                                                            <td className="wrap-text pd-15 fs-15">{query.message}</td>
                                                            <td>Open</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={3}>
                                                                {query.messages?.length > 0 && (
                                                                    <div className="message-toggle p-2" style={{ marginTop: "16px" }}>
                                                                        <div className="ss-line" onClick={() => setExpandMessages(!expandMessages)} >
                                                                            <div className="content">
                                                                                <span className="message-length">{query.messages.length}</span>
                                                                                <i className={`bi ${ expandMessages ? " bi-chevron-up" : " bi-chevron-down"} icon-up-down`}/>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {expandMessages && (
                                                                            <div className="previous-messages mt-2">
                                                                                {query.messages.map((msg, index) => (
                                                                                    <div key={index}>
                                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                                            <p className="mb-0">
                                                                                                <strong>{msg.user.first_name}</strong>:{" "}
                                                                                                <span dangerouslySetInnerHTML={{ __html: msg.message }} />
                                                                                            </p>
                                                                                            <span>{moment(msg.created_at).format("D MMM, YYYY, h:mm A")}</span>
                                                                                        </div>
                                                                                        <hr />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <i  data-toggle="tooltip" data-placement="top" title="Reply"
                                                                    className={`bi ${replyEditors[query.id] ? 'bi bi-x-circle-fill bg-color font-size' : 'bi-arrow-return-left font-size'} float-end`}
                                                                    onClick={() => handleReplyToggle(query.id)}
                                                                ></i>

                                                            </td>
                                                        </tr>
                                                        {/* {replyEditors[query.id] && (
                                                            <tr>
                                                                <td colSpan={3}>
                                                                    <TinyMCEEditor height={200} onEditorChange={(content) => setReplyEditors((prev) => ({...prev,})) } />
                                                                    <button type="submit"className="ss_btn text-right mt-2 mb-2 float-end"
                                                                        onClick={() => handleReplySubmit(query.id, replyEditors[query.id])} >
                                                                        Submit
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )} */}
                                                        {replyEditors[query.id] && (
                                                        <tr>
                                                            <td colSpan={3}>
                                                                <form >
                                                                    <TinyMCEEditor
                                                                        height={200}
                                                                        name="reply"
                                                                        value={values.reply}
                                                                        onEditorChange={(content) => setFieldValue("reply", content)}
                                                                    />
                                                                    {(errors.reply && touched.reply) && (
                                                                        <p className="fs-12 text-danger">{errors.reply}</p>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        className="ss_btn text-right mt-2 mb-2 float-end"
                                                                        onClick={() => {
                                                                            setFieldValue("id", query.id, true);
                                                                            handleSubmit(); 
                                                                        }}
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </form>
                                                                </td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Accordion>
                                    ))}
                                </>
                            )}
                            {totalPages > 0 && (
                                <Pagination totalPages={totalPages}currentPage={currentPage} setCurrentPage={setCurrentPage} refreshRecords={setRefresRecords} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}