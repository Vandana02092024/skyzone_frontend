// import { React, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import TinyMCEEditor from "../../editor/editor.jsx";
// import * as Yup from "yup";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useLocation } from "react-router-dom";
// import { useState } from "react";
// // import BootstrapSwitchButton from 'bootstrap-switch-button-react'

// const validationSchema = Yup.object().shape({
//   message: Yup.string().required("Description is required"),
// });

// const Queries = () => {
//   const userId = localStorage.getItem("userId");
//   const [messages, setMessages] = useState([]);
//   const [showEditor, setShowEditor] = useState(false);
//   const [expandMessages, setExpandMessages] = useState(false);
//   const [query, setQuery] = useState('');
//   const [toggleValue, setToggleValue] = useState(1);
//   const location = useLocation();
//   const { queryId } = location.state || {};

// useEffect(() => {
//   const fetchQueries = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3005/findOneByCustomerId/${queryId}`);
//       if (response.data.success) {
//         const fetchedQuery = response.data.data;
//          setQuery(fetchedQuery);setToggleValue(fetchedQuery.thread_status === "1" ? 1 : 0);}
//     } catch (error) { console.error('Error fetching queries:', error);}
//   };
//   fetchQueries();
// }, [queryId]);

//   const handleToggleChange = async (checked) => {
//     const newToggleValue = checked ? 1: 0; setToggleValue(newToggleValue); await handleSubmitToggleValue(newToggleValue);
//   };

//   useEffect(() => {
//     const fetchMessages = async (queryId) => {
//       try {
//         const response = await axios.get( `http://localhost:3005/findAllByCustomerQueryId/${queryId}` );
//         if (response.data.success) { setMessages(response.data.data); }
//       } catch (error) {console.error("Error fetching queries:", error); }
//     };

//     if (queryId) { fetchMessages(queryId);}
//   }, [queryId]);

//   const handleSubmit = async (values, { setSubmitting, resetForm  }) => {
//     try {
//       const response = await axios.post("http://localhost:3005/create", {userId: userId,customer_query_id: query.id, message: values.message,status: values.status,});
//       if (response.data.success) {
//         Swal.fire({
//           title: "Success!",text: "Message added successfully!", icon: "success", confirmButtonText: "OK",
//         }); resetForm(); }} catch (error) {
//       Swal.fire({title: "Error!", text: "Failed to add message: " + error.message, icon: "error", confirmButtonText: "OK",});
//     } finally {setSubmitting(false);}
//   };

//   const handleSubmitToggleValue = async (toggleValue) => {
//     try {
//       const response = await axios.put(`http://localhost:3005/createToggleValue/${queryId}`, {thread_status:toggleValue});
//       if (response.data.success) {
//         Swal.fire({ title: "Success!", text: "status updated successfully!", icon: "success",confirmButtonText: "OK",
//         });
//       }} catch (error) {
//       Swal.fire({title: "Error!", text: "Failed to update status: " + error.message, icon: "error", confirmButtonText: "OK",});
//     }
//   };


//   return (
//       <section className="main-content bg_color" id="main-content">
//         <div className="main">
//           <div className="row mb-3">
//             <div className="add-offer-form">
//               <div className="card">
//                 <div className="card-body">
//                   <Formik
//                     initialValues={{ message: "", status: "1" }} validationSchema={validationSchema} onSubmit={handleSubmit} >
//                     {({ isSubmitting, setFieldValue, values }) => (
//                       <Form>
//                         <div className="d-flex" style={{justifyContent:'space-between', position:'relative'}}>
//                             <p>
//                               <strong style={{textTransform: "uppercase",fontSize: "20px", }} > {Hello}</strong>
//                               {"  -  "}
//                               <strong style={{textTransform: "uppercase",fontSize: "20px",color:"#FE5000" }}>
//                               {vandana}{" "} {sharma} </strong>
//                              </p> ) :
//                             ( <p>No subject available</p>)
//                             {/* <BootstrapSwitchButton style = {{position:'relative'}} className="switch-btn"checked={toggleValue === 1} onChange={handleToggleChange}  
//                              onlabel="Open" offlabel="Close"onstyle="success" offstyle="danger"height={5}size="sm"/>  */}
//                         </div>
  
//                           <div className="d-flex">
//                             <div className="pad-10">
//                               <img src="./images/happy.png" alt="Profile Pic" style={{ maxWidth: "43px" }}className="profile-edit rounded-circle"/>
//                             </div>
//                             <div className="pad-10">
//                               <p className="d-flex" style={{ flexDirection: "column", }}>
//                                 <strong>{vandana}{" "} {sharma} </strong>{" "}
//                                 <span dangerouslySetInnerHTML={{__html: "hello how were you",}}/></p>
//                             </div>
//                           </div>
//                           {messages.length > 0 && (
//                           <div className="kQ bg adv">
//                             <div className="BK">
//                               <div className="G3 G2"style={{ marginTop: "16px" }} >
//                                 <hr className="header" />
//                                 <hr className="header" />
//                                 <button type="button"className="btn btn-link p-0 adx"onClick={() =>setExpandMessages(!expandMessages)}
//                                 style={{ border: "none",background: "none", }}>
//                                 <i className={`fa ${ expandMessages ? "fa-chevron-up": "fa-chevron-down" }`}style={{ display: "none" }} />
//                                 <span className="text">2 </span>
//                                 </button>
//                               </div>
//                             </div>
//                             {expandMessages && (
//                               <div className="previous-messages mt-2">
//                                 {messages.map((msg, index) => (
//                                   <div key={index}>
//                                     <div className="row">
//                                       <div className="d-flex align-items-center justify-content-end">
//                                         <p className="mar-right"style={{ fontSize: "13px", }}>
//                                         {new Date(msg.created_at ).toLocaleDateString("en-US", {month: "short",day: "numeric", year: "numeric", })}</p>
//                                         <p className="mar-right" style={{fontSize: "13px",}}>{new Date(msg.created_at ).toLocaleTimeString("en-US", {hour: "numeric",minute: "numeric", hour12: true, })} </p>
//                                       </div>
//                                       <div className="col-md-auto">
//                                         <img src="./images/happy.png" alt="Profile Pic" style={{ maxWidth: "43px" }}className="profile-edit rounded-circle" /> </div>
//                                       <div className="col">
//                                         <p className="d-flex"style={{flexDirection: "column",}} > <strong>{msg.user.first_name}</strong><span dangerouslySetInnerHTML={{  __html: msg.message, }}/> </p>
//                                       </div>
//                                       <div className="col col-lg-2">
//                                         {msg.status === "2" ? (
//                                           <div className="fw-semibold d-flex align-items-center justify-content-center">
//                                             <span className="p-1 bg-success rounded-circle"></span><span className="ms-1 text-success"> Resolved </span>
//                                           </div>
//                                         ) : (
//                                           <div className="fw-semibold d-flex align-items-center justify-content-center" >
//                                             <span className="p-1 bg-warning rounded-circle"></span> <span className="ms-1 text-warning">In Progress </span>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                     <hr />
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                         {
//                         query.thread_status === "0" ? (null ) : (
//                           !showEditor && (
//                             <div className="text-right">
//                               <button type="button" className="ss_btn" onClick={() => setShowEditor(true)} >
//                                 <i className="fa fa-reply"></i> Reply </button>
//                             </div>
//                           )
//                         )}
  
//                         {showEditor && (
//                           <>
//                             <div className="d-flex pad-10 justify-content-end" >
//                               <div className="cross-btn">
//                                 <button type="button" className="btn-close float-right" aria-label="Close" onClick={() => setShowEditor(false)} style={{ fontSize: "12px" }} ></button>
//                               </div>
//                             </div>
//                             <div className="form-group row mb-2">
//                               <div className="col-md-12">
//                                 <TinyMCEEditor value={values.message} onEditorChange={(content) =>
//                                     setFieldValue("message", content)
//                                   }
//                                   name="message"placeholder="Enter your message here" />
//                                 <ErrorMessage  name="message" component="div" className="text-danger"/>
//                               </div>
//                             </div>
  
//                             <div className="d-flex pad-10 justify-content-end">
//                               <div className="col-md-2 fs-12 fw-semibold mar-right">
//                                 <Field as="select"name="status"className="form-control col-md-2 fs-12 fw-semibold" >
//                                   <option value="1">In Progress</option>
//                                   <option value="2">Resolved</option>
//                                 </Field>
//                                 <ErrorMessage name="status" component="div" className="text-danger" />
//                               </div>
  
//                               <button
//                                 type="submit" className="ss_btn text-right" id="add_offer_btn" disabled={isSubmitting} >{isSubmitting ? "Adding..." : "Submit"}
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </Form>
//                     )}
//                   </Formik>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//   );

// };

// export default Queries;

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import TinyMCEEditor from "../../editor/editor.jsx";

const Queries = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      created_at: "2024-08-25T12:34:56Z",
      user: { first_name: "John" },
      message: "This is a static message for testing purposes.",
      status: "1",
    },
    {
      id: 2,
      created_at: "2024-08-25T13:00:00Z",
      user: { first_name: "Jane" },
      message: "Another static message to test the UI layout.",
      status: "2",
    },
  ]);
  const [showEditor, setShowEditor] = useState(false);
  const [expandMessages, setExpandMessages] = useState(true);
  const [query, setQuery] = useState({
    id: 123,
    thread_status: "1",
    subject: "Static Subject",
    description: "Static Description",
  });
  const [toggleValue, setToggleValue] = useState(1);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    Swal.fire({
      title: "Success!",
      text: "Message added successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
    resetForm();
    setSubmitting(false);
  };

  return (
    <section className="main-content bg_color" id="main-content">
      <div className="main">
        <div className="row mb-3">
          <div className="add-offer-form">
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{ message: "", status: "1" }}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                      <div
                        className="d-flex"
                        style={{
                          justifyContent: "space-between",
                          position: "relative",
                        }}
                      >
                        <p>
                          <strong
                            style={{
                              textTransform: "uppercase",
                              fontSize: "20px",
                            }}
                          >
                            Hello
                          </strong>
                          {" - "}
                          <strong
                            style={{
                              textTransform: "uppercase",
                              fontSize: "20px",
                              color: "#FE5000",
                            }}
                          >
                            Vandana Sharma
                          </strong>
                        </p>
                      </div>

                      <div className="d-flex">
                        <div className="pad-10">
                          <img
                            src="./images/happy.png"
                            alt="Profile Pic"
                            style={{ maxWidth: "43px" }}
                            className="profile-edit rounded-circle"
                          />
                        </div>
                        <div className="pad-10">
                          <p
                            className="d-flex"
                            style={{ flexDirection: "column" }}
                          >
                            <strong>Vandana Sharma</strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: "Static message content here",
                              }}
                            />
                          </p>
                        </div>
                      </div>

                      {messages.length > 0 && (
                        <div className="kQ bg adv">
                            <div className="BK">
                                <div className="G3 G2" style={{ marginTop: "16px" }}>
                                <hr className="header" />
                                <button type="button" className="btn btn-link p-0 adx" onClick={() => setExpandMessages(!expandMessages)
                                    }
                                    style={{
                                    border: "none",
                                    background: "none",
                                    }}
                                >
                                    <i
                                    className={`fa ${
                                        expandMessages
                                        ? "fa-chevron-up"
                                        : "fa-chevron-down"
                                    }`}
                                    />
                                    <span className="text">2</span>
                                </button>
                                </div>
                          </div>
                          {expandMessages && (
                            <div className="previous-messages mt-2">
                              {messages.map((msg, index) => (
                                <div key={index}>
                                  <div className="row">
                                    <div className="d-flex align-items-center justify-content-end">
                                      <p
                                        className="mar-right"
                                        style={{ fontSize: "13px" }}
                                      >
                                        {new Date(
                                          msg.created_at
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </p>
                                      <p
                                        className="mar-right"
                                        style={{ fontSize: "13px" }}
                                      >
                                        {new Date(
                                          msg.created_at
                                        ).toLocaleTimeString("en-US", {
                                          hour: "numeric",
                                          minute: "numeric",
                                          hour12: true,
                                        })}
                                      </p>
                                    </div>
                                    <div className="col-md-auto">
                                      <img
                                        src="./images/happy.png"
                                        alt="Profile Pic"
                                        style={{ maxWidth: "43px" }}
                                        className="profile-edit rounded-circle"
                                      />
                                    </div>
                                    <div className="col">
                                      <p
                                        className="d-flex"
                                        style={{
                                          flexDirection: "column",
                                        }}
                                      >
                                        <strong>{msg.user.first_name}</strong>
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: msg.message,
                                          }}
                                        />
                                      </p>
                                    </div>
                                    <div className="col col-lg-2">
                                      {msg.status === "2" ? (
                                        <div className="fw-semibold d-flex align-items-center justify-content-center">
                                          <span className="p-1 bg-success rounded-circle"></span>
                                          <span className="ms-1 text-success">
                                            Resolved
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="fw-semibold d-flex align-items-center justify-content-center">
                                          <span className="p-1 bg-warning rounded-circle"></span>
                                          <span className="ms-1 text-warning">
                                            In Progress
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <hr />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {query.thread_status === "1" && !showEditor && (
                        <div className="text-right">
                          <button
                            type="button"
                            className="ss_btn"
                            onClick={() => setShowEditor(true)}
                          >
                            <i className="fa fa-reply"></i> Reply
                          </button>
                        </div>
                      )}

                      {showEditor && (
                        <>
                          <div className="d-flex pad-10 justify-content-end">
                            <div className="cross-btn">
                              <button
                                type="button"
                                className="btn-close float-right"
                                aria-label="Close"
                                onClick={() => setShowEditor(false)}
                                style={{ fontSize: "12px" }}
                              ></button>
                            </div>
                          </div>
                          <div className="form-group row mb-2">
                            <div className="col-md-12">
                              <TinyMCEEditor
                                value={values.message}
                                onEditorChange={(content) =>
                                  setFieldValue("message", content)
                                }
                                name="message"
                                placeholder="Enter your message here"
                              />
                              <ErrorMessage
                                name="message"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          <div className="d-flex pad-10 justify-content-end">
                            <div className="col-md-2 fs-12 fw-semibold mar-right">
                              <Field
                                as="select"
                                name="status"
                                className="form-control col-md-2 fs-12 fw-semibold"
                              >
                                <option value="1">In Progress</option>
                                <option value="2">Resolved</option>
                              </Field>
                              <ErrorMessage
                                name="status"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <button
                              type="submit"
                              className="ss_btn text-right"
                              id="add_offer_btn"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Adding..." : "Submit"}
                            </button>
                          </div>
                        </>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Queries;

