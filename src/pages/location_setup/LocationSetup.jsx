import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { items_per_page, messagePop} from '../../utils/Common';
import Datatable from '../../components/Datatable';
import { Link, useNavigate } from 'react-router-dom';
import SweetAlert from '../../components/SweetAlert';
import { FETCHLOCATIONMANAGERS, LISTLOCATIONMANAGERS, UPDATESTATUSCHANGE } from '../../utils/Endpoints';

export default function LocationSetup() {
    const [data, setData] = useState([]);
    const [refreshRecords, setRefreshRecords] = useState(true);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(null);
    const [editLoader, setEditLoader] = useState(false);
    const[status,setStatus] = useState(null);
   

    const navigate = useNavigate();
    const apiRequest = useRequest();

    // PAGE AND ITEMS SETTINGS //
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(items_per_page);

    // TABLE COLUMNS //
    const columns = [
        { field: "client_name", width: 150, headerClassName: "header-theme", headerName: "Client Name",},
        { field: "client_email", width: 250,headerClassName: "header-theme", headerName: "Email",},
        { field: "phone_number", width: 120,headerClassName: "header-theme", headerName: "Phone", },
        {field: "address", headerClassName: "header-theme",  width: 300, headerName: "Address", },
        { field: "location", headerClassName: "header-theme", width: 150,  headerName: "Location"},
        {
            field: "status", headerClassName: "header-theme", width: 100, 
            headerName: "Status",
            
            renderCell: (params) => {
                return (
                    <div onClick={() => handleStatusChange(params.row.id)} className="fw-semibold d-flex align-items-center lnk" >
                        <span className={`p-1 bg-${(params.row.status === 1) ? 'success' : 'secondary'} rounded-circle`}></span>
                        <span className={`ms-1 text-${(params.row.status === 1) ? 'success' : 'secondary'}`}>{(params.row.status === 1) ? 'Active' : 'Inactive'} </span>
                    </div>
                );
            },
        },
        { field: "action", headerClassName: "header-theme", headerName: "Action", 
            renderCell: (param) => {
                return (
                    <>
                    <div className="d-flex align-items-center v-align-center">
                        {(editLoader && editLoader === param.row.id) ? 
                            <div className='td-btn'>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div> 
                            </div>
                            :
                            <Link onClick={() => handleEditClick(param.row.id)} className="me-2 icon edit" data-bs-title="Edit">
                                <i className="bi bi-pencil-square"></i>
                            </Link>
                        }
                        <Link onClick={() => handleDelete(param.row.id)} className=" icon delete" data-bs-toggle="tooltip" data-bs-title="Delete">
                            <i className="bi bi-trash-fill"></i>
                        </Link>
                    </div>
            </>
                )
            }
        },

    ];

    // COMPONENT MOUNTING / UPDATING
    useEffect(()=>{
        const getRecords = async () => {
            const data = await apiRequest({url:LISTLOCATIONMANAGERS, method:"get", params: {page: currentPage, items_per_page: itemsPerPage, search: search,status:status,}});
            const rowsWithId = data?.data?.listing.map((row, index) => ({
                ...row,
                id: row.client_id || index,
              }));
            setData({ ...data, data: { ...data.data, listing: rowsWithId } });
            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setStatus(data?.data?.status)
            setLoading(false)    
        }
        
        if(refreshRecords){
            setLoading(true)
            setRefreshRecords(false)
            getRecords();
        }
    }, [refreshRecords, apiRequest, currentPage, itemsPerPage, search,status]);


    useEffect(()=>{
        setRefreshRecords(true);
    }, [currentPage])

    const handleEditClick = async (id) => {
        setEditLoader(id)
        const response = await apiRequest({
            url: `${FETCHLOCATIONMANAGERS}?id=${id}`,
            method:"get"});

        navigate(`/edit-location`, {
          state: {
            id: id,
            locationData: response?.data,
          },
        });
    };

    // STATUS CHANGE USER //
    const handleStatusChange = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to change the status ?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({
                url:UPDATESTATUSCHANGE,
                 method:"POST",
                data:{id:id}});
            setRefreshRecords(true);
            messagePop(data)
        }
    }

    // DELETE USER //
    const handleDelete = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to change the status ?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({
                url:UPDATESTATUSCHANGE,
                 method:"POST",
                data:{
                    id:id,
                    deleted:1
                }});
            setRefreshRecords(true);
            messagePop(data)
        }
    }

  return (
    <>
        <div className='text-end mb-3'>
            <Link to="/add-locations" className="ss_btn">Add Locations</Link>
        </div>

        <Datatable 
            rows={data?.data?.listing} 
            title="Location Setup" 
            columns={columns} 
            loading={loading} 
            getRowId={(row) => row.client_id} 
            manageListing={{
                currentPage,
                setCurrentPage,
                totalPages,
                itemsPerPage,
                setItemsPerPage,
                setRefreshRecords,
                setSearch,
                searhPlaceholder: "Title / Message"
            }}
        />
    </>
  )
}
