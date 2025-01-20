import { useEffect, useState } from "react";
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { Skeleton } from "@mui/material";
import { items_per_page, status } from "../../utils/Common";
import Pagination from "../../components/Pagination";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function LocationSetup() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Add Manager Popup
    const [load, setLoad] = useState(false);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(items_per_page);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = useState([true]);
    const [currentStatus, setCurrentStatus] = useState(1);

    const apiRequest = useRequest();

    // SEARCH USERS //
    const [search, setSearch] = useState(null);

    const { data: locationdt, loading: locationloading } = GetLocations();

    // DROPDOWNS CHANGE //

    const dropDownChangeStatus = (e) => {
        setCurrentStatus(e.target.value);
        setRefresRecords(true);
    };

    // ONLOAD //
    useEffect(() => {

        if (!locationloading && locationdt) {
            if (location.state !== null) {
                setCurrentLocation(location.state?.id);
                setRefresRecords(true);
            } else {
                setCurrentLocation(locationdt.data[0].value);
            }
        }
    }, [locationdt, locationloading, location.state]);

    const toggleAdd = () => {
        setIsOpen(prev => !prev);
    }


    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefresRecords(true);
    }

    useEffect(() => {
        const getList = async (page = 1) => {
            setLoad(true);
            const offersRec = await apiRequest({
                // url: LISTMANAGERS,
                method: "get",
                params: {
                    status: currentStatus,
                    page: page,
                    items_per_page: pageSize,
                    search: search
                },
            });

            setData(offersRec || []);
            setTotalPages(offersRec?.data?.total_pages || 0);
            setLoad(false);
        };

        if (refreshRecords && currentLocation) {
            getList(currentPage);
            setRefresRecords(false);

        }
    }, [apiRequest, refreshRecords, currentStatus, currentPage, pageSize, search]);

    const refreshListing = (response) => {
        if (response) {
            setRefresRecords(true);
        }
        else {
            SweetAlert.error('Oops!', 'Something went wrong.')
            setRefresRecords(false);
        }
    }

    const handleAddClick = async () => {
        navigate(`/add-locations`);
    };

    return (
        <div>
            {locationloading
                ?
                <>
                    <div className="text-end mb-3">
                        <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end" />
                    </div>
                    <Skeleton variant="rectangular" width="100%" height={100} className="skeleton-custom" />
                </>
                : locationdt &&
                <>
                    {/* ADD POPUP */}
                    <div className="text-end mb-3">
                        <button className='ss_btn'  onClick={() => handleAddClick()} >Add Locations</button>
                        {/* {isOpen && <Add close={toggleAdd} currentLocation={currentLocation} refreshData={refreshListing} />} */}
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <p className="fs-15 fw-semibold mb-0">Locations Setup</p>
                                        </div>
                                        <div className="col-md-3">
                                            {/* <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown 
                                    onChange={dropDownChange} name="location" options={locationdt.data} 
                                    default_value={currentLocation} classnm="form-select fs-12" />} */}
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search
                                                Product</label>
                                            <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Product" onChange={handleSearch} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fs-12 fw-semibold">Status</label>
                                            {locationloading || !currentLocation ? (
                                                "Loading..."
                                            ) : (

                                                <FormDropdown
                                                    onChange={dropDownChangeStatus}
                                                    name="status"
                                                    options={status}
                                                    default_value={currentStatus || "active"}
                                                    classnm="form-select fs-12"
                                                />

                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

            <div className="row align-items-center">
                <div class="col-md-4 mb-2">
                    <div class="card border-0">
                        <div class="card-body hide-overflow">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <a class="product-status product-active" title="Click to deactivate" href="/location-manager-setup">Active</a>
                                <div class="d-flex align-items-center">
                                    <button class="me-2 icon edit" data-bs-title="Edit">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <a class="icon delete" data-bs-title="Delete" href="/latest-offerings">
                                        <i class="bi bi-trash-fill"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="product_detail">
                                <h1>Dev2 Chauhan</h1>
                                <p><i class="bi bi-envelope-fill"></i> dev@gmail.com</p>
                                <p><i class="bi bi-phone-fill"></i> 1234567890</p>
                                <p><i class="bi bi-award-fill"></i> <b>Support Manager</b></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row align-items-center">
                {totalPages > 0 ?
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        refreshRecords={setRefresRecords}
                    />
                    :
                    <Skeleton variant="rectangular" width="100%" height={20} className="skeleton-custom text-end" />
                }


            </div>
        </div>
    )
}

export default LocationSetup