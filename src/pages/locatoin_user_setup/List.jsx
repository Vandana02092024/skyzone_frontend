import { useEffect, useState } from "react";
// import { useRequest } from "../../utils/Requests"
// import { LISTMANAGERS } from "../../utils/Endpoints";
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { useLocation } from 'react-router-dom';
import { Skeleton } from "@mui/material";
import Add from "./Add";

function List() {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Add Manager Popup

  const {data: locationdt, loading: locationloading} = GetLocations();

  // DROPDOWNS CHANGE //
  const dropDownChange = (e) => {
    setCurrentLocation(e.target.value);
  }

  // ONLOAD //
    useEffect(() => {

        if(!locationloading && locationdt){
            if(location.state !== null){
                setCurrentLocation(location.state?.id);
            }else{
                setCurrentLocation(locationdt.data[0].value);
            }
            
        }
    }, [locationdt, locationloading, location.state]);

    const toggleAdd = () => {
        setIsOpen(prev => !prev);
    }


  // const apiRequest = useRequest();

  // useEffect(() => {
  //   const getList = async () =>{
  //     const list = await apiRequest({
  //       url: LISTMANAGERS,
  //       method: "get",
  //       param: {client_id: 1}
  //     });
  //   } 
  // })
  
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
                <button className='ss_btn' onClick={toggleAdd} >Add Manager</button>
                {isOpen && <Add close={toggleAdd} currentLocation={currentLocation} />}
            </div>

            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-9">
                                    <p className="fs-15 fw-semibold mb-0">Manager Setup</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        }

        <div className="row align-items-center">
          <div className="col-md-4 mb-2">
            <div className="card border-0">
              <div className="card-body hide-overflow">

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <a className="product-status product-active" title="Click to deactivate" href="/latest-offerings">Active</a>
                  <div className="d-flex align-items-center">
                    <a className="me-2 icon edit" data-bs-title="Edit" href="/latest-offerings">
                      <i className="bi bi-pencil-square"></i>
                    </a>
                    <a className="icon delete" data-bs-title="Delete" href="/latest-offerings">
                      <i className="bi bi-trash-fill"></i>
                    </a>
                  </div>
                </div>

                <div className="product_detail">
                  <h1>Usman Rao</h1>
                  <p><i className="bi bi-envelope-fill"></i> usman@rivette.ai</p>
                  <p><i className="bi bi-phone-fill"></i> 123-765-987</p>
                  <p><i className="bi bi-award-fill"></i> <b>Manager</b></p>
                </div>

              </div>
            </div>
          </div>

          
        </div>
    </div>
  )
}

export default List