import React, { useState } from "react";
import { useRequest } from "../../utils/Requests";
import { ADDOFFERRULE } from "../../utils/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SweetAlert from "../../components/SweetAlert";
import { useFormik } from "formik";
import { latestOfferingValidationSchema } from "../../utils/validationSchemas";

// edit

import TinyMCEEditor from "../../editor/editor.jsx";
import ChooseProducts from "./ChooseProducts";
import DatePicker from "../../components/DatePicker.jsx";
import FormDropdown from "../../components/FormDropdown.jsx";
import { campaign_types } from "../../utils/Common.js";

export default function AddRule() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiRequest = useRequest();

  const [loadProducts, setLoadProducts] = useState(true);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState("0");
  const { clientId, LocationName } = location.state || {};
  


  if(clientId === null)
    navigate("/latest-offerings")

  const openDialog = () => {
    setLoadProducts(true);
    setOpen(true);
  };

  const removeItems = (productId) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.Pid !== productId
    );

    setSelectedProducts(updatedProducts);
  };

  

  // FORM SUBMIT //
  const onSubmit = async (values) => {

    const formData = {
      title: values.title,
      description: values.description,
      camp_type: values.campaignType,
      image: values.image,
      camp_start_date: values.startDate,
      camp_end_date: values.endDate,
      discount_code: values.discountCode,
      discount_type: values.discount_type,
      discount_amount: values.discount_amount,
      discountPercent: values.discountPercent,
      reward_points: values.rewardPoint,
      offer_type: values.offerType,
      display_to: values.displayTo,
      client_id: clientId,
      selected_products: selectedProducts,
    };
    const response = await apiRequest( {url: ADDOFFERRULE, method: "POST", data: formData}, true);

    if (response) {
      SweetAlert.success("Success!", "Insert New Offer successfully.");
    }
  };

  const {values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting} = useFormik({
    initialValues: {
      title:"",
      description:"",
      campaignType:"1",
      rewardPoint:"",
      discountCode:"",
      discountAmount:"",
      discountPercent:"",
      startDate: "",
      endDate: "",
      image:"",
      offerType:"1",
      displayTo:"0",
    },
    validationSchema: latestOfferingValidationSchema,
    onSubmit
  })

  const handleCampaignTypeChange = (e) => {
    setFieldValue("campaignType", e.target.value);
  };


  const handleFileChange = (file) => {
    setFieldValue("image", file);
  };

  const startDateChange = (date) => setFieldValue("startDate", date);
  const endDateChange = (date) => setFieldValue("endDate", date);


  return (
    <>
      
        <>
          <div className="text-end mb-3">
            <Link to="/latest-offerings" type="button" className="ss_btn" state={{id: clientId, value: LocationName}}>
              <i className="bi bi-arrow-left"></i> Back
            </Link>
          </div>

          <div className="main">
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="card border-0">
                  <div className="card-body">
                    <p className="fs-15 fw-semibold mb-0">{LocationName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="add-offer-form">
                <div className="card">
                  <div className="card-body">
                    <form name="add_offer" id="add_offer">
                      <div className="container-fluid">

                        <div className="row">
                          <div className="col-md-12">
                            <div className="widget">
                              <div className="widget-content">

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold"> Title </label>
                                  <div className="col-md-10">
                                    <input type="text" name="title" className="form-control fs-13" placeholder="Title" value={values.title} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.title && touched.title && <p className='text-danger fs-12'>{errors.title}</p>}
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold"> Description </label>
                                  <div className="col-md-10">
                                    <TinyMCEEditor
                                      value={values.description}
                                      name="description"
                                      onEditorChange={(content) =>
                                        setFieldValue("description", content)
                                      }
                                    />
                                    {errors.description && touched.description && <p className='text-danger fs-12'>{errors.description}</p>}
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">Image</label>
                                  <div className="col-md-4">
                                    <input className="form-control fs-12" type="file" name="image" onBlur={handleBlur} onChange={(e) => handleFileChange(e.target.files[0]) }/>
                                    <span style={{ fontSize: "9px" }}>*(preferred image size 650×350)</span>
                                  </div>

                                  <div className="col-md-4">
                                    <img src={values.image !== '' ? URL.createObjectURL(values.image) : ""} alt="" className="w-90" />
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">Campaign Type</label>
                                  <div className="col-md-3">
                                    <FormDropdown classnm="form-select fs-13" onChange={handleCampaignTypeChange} name="notifyTimeAP" options={campaign_types} />
                                  </div>
                                </div>

                                {values.campaignType === "2" && (
                                  <div className="form-group row mb-2" id="discount_code_sec" >

                                    <label className="col-md-2 fs-12 fw-semibold">Discount Code </label>
                                    <div className="col-md-3">
                                      <input type="text" name="discountCode" className="fs-13 form-control" value={values.discountCode} onChange={handleChange} onBlur={handleBlur} />
                                      {errors.discountCode && touched.discountCode && <p className='text-danger fs-12'>{errors.discountCode}</p>}
                                    </div>

                                    <div className="col-md-6">
                                      <table width="100%">
                                        <tbody>
                                          <tr>
                                            <td className="fs-12 fw-semibold">Amount</td>
                                            <td>
                                              <input type="radio" name="discount_type" value="0" checked={discountType === "0"} onChange={() => setDiscountType("0")} />
                                              
                                            </td>
                                            <td>
                                              <input type="number" className="fs-13 form-control w-90" name="discountAmount" step="any" value={values.discountAmount} onChange={handleChange} onBlur={handleBlur}
                                              />
                                            </td>
                                            <td className="fs-12 fw-semibold">Percentage</td>
                                            <td>
                                              <input type="radio" name="discount_type" value="1" checked={discountType === "1"} onChange={() => setDiscountType("1") }/>
                                            </td>
                                            <td>
                                              <input type="number" className="fs-13 form-control w-90" name="discountPercent" step="any" value={values.discountPercent} onChange={handleChange} onBlur={handleBlur} />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      {errors.discountPercent && touched.discountPercent && <p className='text-danger fs-12'>{errors.discountPercent}</p>}
                                    </div>
                                  </div>
                                )}


                                {values.campaignType === "1" && (
                                  <div className="form-group row mb-2">
                                    <label className="col-md-2 fs-12 fw-semibold">Reward Points</label>
                                    <div className="col-md-3">
                                      <input type="number" className="form-control fs-13" name="rewardPoint" step="any" value={values.rewardPoint} onChange={handleChange} onBlur={handleBlur} placeholder="Reward Points"/>
                                      {errors.rewardPoint && touched.rewardPoint && <p className='text-danger fs-12'>{errors.rewardPoint}</p>}
                                    </div>
                                  </div>
                                )}

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">Offer Start Date</label>
                                  <div className="col-md-3">
                                  <DatePicker value={values.startDate} onChange={startDateChange} minDate={true} name="startDate" />
                                    {errors.startDate && touched.startDate && <p className='text-danger fs-12'>{errors.startDate}</p>}
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">Offer End Date</label>
                                  <div className="col-md-4">

                                    <DatePicker value={values.endDate} onChange={endDateChange} minDate={true} name="startDate" />
                                      {errors.endDate && touched.endDate && <p className='text-danger fs-12'>{errors.endDate}</p>}

                                  </div>
                                </div>


                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">Offer Type</label>
                                  <div className="col-md-10">

                                    <table width="100%">
                                      <tbody>
                                        <tr>
                                          <td width="1%" style={{ verticalAlign: "middle" }}>
                                            <input type="radio" name="offerType" value="1" checked={values.offerType === "1"} onChange={handleChange} />
                                          </td>
                                          <td width="20%">
                                            <label htmlFor="membership-yes" className="fs-12 fw-semibold">Membership</label>
                                          </td>

                                          <td width="1%" style={{ verticalAlign: "middle" }}>
                                            <input type="radio" name="offerType" value="2" checked={values.offerType === "2"} onChange={handleChange} />
                                          </td>
                                          <td width="30%">
                                            <label htmlFor="tickets-yes" className="fs-12 fw-semibold">Ticket Purchase</label>
                                          </td>

                                          <td width="1%" style={{ verticalAlign: "middle" }}>
                                            <input type="radio" name="offerType" id="packages-yes" value="3" checked={values.offerType === "3"} onChange={handleChange} />
                                          </td>
                                          <td>
                                            <label htmlFor="packages-yes" className="fs-12 fw-semibold">Packages</label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold"> Display Offer To </label>
                                  <div className="col-md-10">

                                    <table width="100%">
                                      <tbody>
                                        <tr>
                                          <td width="1%" style={{ verticalAlign: "middle" }} >
                                            <input type="radio" name="displayTo" value="1" checked={values.displayTo === "1"} onChange={handleChange} />
                                          </td>
                                          <td width="20%">
                                            <label htmlFor="Members only" className="fs-12 fw-semibold">Members only</label>
                                          </td>
                                          <td width="1%" style={{ verticalAlign: "middle" }} >
                                            <input type="radio" name="displayTo" value="0" checked={values.displayTo === "0"} onChange={handleChange} />
                                          </td>
                                          <td>
                                            <label htmlFor="all-customers" className="fs-12 fw-semibold" >
                                              All Customers
                                            </label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>

                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">Select Products</label>
                                  <div className="col-md-10">
                                    <button type="button" className="refreshbtn" onClick={openDialog}>Choose Products</button>

                                    <div>
                                      {selectedProducts.length > 0 && (
                                        <span>
                                          <div className="widget">
                                            <div className="widget-content skin-white p-2">
                                              <div className="table-scroll">
                                                <table className="fs-12 table table-bordered RjTable">
                                                  <tbody>
                                                    <tr>
                                                      <th></th>
                                                      <th><b>Items</b></th>
                                                      <th>Action</th>
                                                    </tr>
                                                    {selectedProducts.map(
                                                      (product) => (
                                                        <tr key={product.id}>
                                                          <td width="70px">
                                                            <input type="hidden" name="selected_items[]" value={product.id}/>
                                                            <img src={product.imageUrl} alt={product.name} width={40} />
                                                          </td>
                                                          <td>{product.name}</td>
                                                          <td width={100}>
                                                            <span style={{cursor: 'pointer'}} className="icon delete" title="Delete" onClick={() => removeItems(product.Pid)} >
                                                              <i className="bi bi-trash-fill deleteBtn"></i>
                                                            </span>
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <div className="col-md-12 text-right">
                                    <ChooseProducts open={open} setOpen={setOpen} loadProducts={loadProducts} setLoadProducts={setLoadProducts} offerType={values.offerType} clientID={clientId} setSelectedProducts={setSelectedProducts}/>

                                    <div className="text-center mb-3">
                                        <div className="position-relative">
                                            <input disabled={isSubmitting} type="button" onClick={handleSubmit} className="ss_btn" value="Submit" />

                                            {isSubmitting && 
                                              <div className="position-absolute top-50 start-50 translate-middle">
                                                  <div className="spinner-border" role="status">
                                                    <span className="sr-only"></span>
                                                  </div>
                                              </div>
                                            }
                                        </div>
                                        
                                    </div>


                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      
    </>
  );
}