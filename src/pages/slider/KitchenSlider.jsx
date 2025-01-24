import React, { useEffect, useState } from 'react'
import GetLocations from '../../hooks/Locations';
import FormDropdown from '../../components/FormDropdown';
import { useRequest } from '../../utils/Requests';
import { Skeleton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Add from './Add';
import SweetAlert from '../../components/SweetAlert';
import Edit from './Edit';
import { GET_KITCHEN_SLIDER_IMAGES } from '../../utils/Endpoints';

export default function KitchenSlider() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [currentLocationName, setCurrentLocationName] = useState("");
    const [allLocation, setAllLocations] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Add Manager Popup
    const [isOpenId, setIsOpenId] = useState(false); // Edit User Popup
    const [editData, setEditData] = useState(0);
    const [load, setLoad] = useState(false);


    const apiRequest = useRequest();
    const {data:locationdt, loading:locationloading} = GetLocations();

    const refreshListing = (response) => {
        if(response){
          setRefresRecords(true);
        }
        else{
          SweetAlert.error('Oops!', 'Something went wrong.')
          setRefresRecords(false);
        }
      }
    

    // PAGE AND ITEMS SETTINGS //
    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(items_per_page);

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocationName(allLocation[e.target.selectedIndex].label);
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    }

    // ONLOAD //
    useEffect(() => {
        if(!locationloading && locationdt){
            if(location.state !== null){
                setCurrentLocation(location.state?.id);
                setCurrentLocationName(location.state?.value);
                setRefresRecords(true);
            }else{
                setCurrentLocation(locationdt.data[0].value);
                setCurrentLocationName(locationdt.data[0].label);
            }
            setAllLocations(locationdt.data);
        }
    }, [locationdt, locationloading, location.state])

    // FETCH ONLOAD //
    useEffect(()=> {
        const getRecords = async () => {
            setLoading(true)
            const rec = await apiRequest({url:GET_KITCHEN_SLIDER_IMAGES,   method:"get"});
            setData(rec?.data);
            setLoading(false);
        }

        if(refreshRecords && currentLocation){
            getRecords();
            setRefresRecords(false);
        }
    }, [apiRequest, refreshRecords, currentLocation]);


    const toggleAdd = () => {
        setIsOpen(prev => !prev);
    }


    const toggleEdit = async (id) => {
        setLoad(id);
    
        if (id !== 'undefined') {
            const user = await apiRequest({
                url: GET_KITCHEN_SLIDER_IMAGES,
                method: "get",
                params: { id: id },
            });
            const singleRec = user?.data?.length > 0 
                ? {
                    id: user.data[0].id,
                    image: user.data[0].imageUrl,
                }
                : {};
            setEditData(singleRec); 
        }
    
        setIsOpenId(id);
        setLoad(false);
    };
 
  return (
    <>
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
            <div className="text-end mb-3"> 
            <button className='ss_btn' onClick={toggleAdd} >Add Image</button>
            {isOpen && <Add close={toggleAdd} currentLocation={currentLocation} refreshData={refreshListing} />} 

            {isOpenId && <Edit id={isOpenId} close={setIsOpenId} data={editData} refreshData={refreshListing} />}            
            </div>
            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p className="fs-15 fw-semibold mb-0">Items</p>
                                </div>
                                <div className="col-md-3">

                                </div>
                                <div className="col-md-3">
                                    {/* <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row align-items-center">
            {(data?.length > 0 && !load) ? (
                data?.map((slider) => (
                <div className="col-md-3 mb-2" key={slider.id}>
                    <div className="card border-0">
                        <div className="card-body hide-overflow">
                            {slider.imageUrl ? (
                                <img src={slider.imageUrl} alt={slider.title} className="product-img"/>
                            ) : (
                                <img src="./images/no-image.png" alt={slider.title} className="product-img height-100"/>
                            )}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                {/* <button class="product-status product-active">Active</button> */}
                                <div></div>
                                <div className="d-flex align-items-center">
                                    <Link onClick={() => toggleEdit(slider.id)} className="me-2 icon edit" data-bs-title="Edit">
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    <button className="icon delete" data-bs-title="Delete">
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))
            )
            : (
                <div className="row mb-3">
                    <div className="col-md-12">
                    {data?.length === 0  && !load ? <>No Data Found!</> :
                        <Skeleton variant="rectangular" width="100%" height={300} className="skeleton-custom" />
                    }
                    </div>
                </div>
            )}
            </div>
        </>
        }
    </>
  )
}
