import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { items_per_page} from '../../utils/Common';
import { GENERALQUERIES } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import Accordion from '../../components/Accordion';
import moment from 'moment';
import Pagination from '../../components/Pagination';
import FormDropdown from '../../components/FormDropdown';
import GetLocations from '../../hooks/Locations';
import DatePicker from "../../components/DatePicker.jsx";

export default function GeneralQueries(){
    const [RefresRecords, setRefresRecords] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const apiRequest = useRequest();
    const {data:locationdt, loading:locationloading} = GetLocations();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0] );
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

    // PAGE AND ITEMS SETTINGS //
    const [currentPage, setCurrentPage] = useState(1);

    // SEARCH USERS //
    const [search, setSearch] = useState(null);

    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefresRecords(true);
    }

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
    
    // COMPONENT MOUNTING 
    useEffect(()=>{
        const getCustomerQueries = async () => {
            setLoading(true)
            const client_id = (currentLocation) ? {client_id : currentLocation} : "";
            const data = await apiRequest({
                url:GENERALQUERIES, 
                method:"get", 
                params: {
                    page: currentPage, 
                    items_per_page: items_per_page, 
                    search: search, 
                    ...client_id
                }
            });

            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setData(data?.data?.data);
            setLoading(false)    
        }
        
        if(RefresRecords){
            setRefresRecords(false)
            getCustomerQueries();
        }
    }, [RefresRecords, apiRequest, currentPage, search, currentLocation])

    
    useEffect(()=>{
        setRefresRecords(true);
    }, [currentPage])
    return(
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
                                            ?  'Loading...'  : 
                                            locationdt && 
                                                <FormDropdown onChange={dropDownChange} name="location"   options={locationdt.data}  default_value={currentLocation}  classnm="form-select fs-12" default_option={true} />
                                        }
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search</label>
                                        <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Queries"  onChange={handleSearch} 
                                />
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
            <div className="card border-0 boxShadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                        {loading ? <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
                        :
                        <>
                            {data?.map(query => {
                                const email = query.user;
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
                                                            <i className="bi bi-question-circle-fill"></i>
                                                        </td>
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
                                                            {email} <br />
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
                            refreshRecords={setRefresRecords} />
                        :
                        <Skeleton variant="rectangular" width="100%" height={20} className="skeleton-custom text-end"/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}