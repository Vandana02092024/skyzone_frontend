import React, { useState, useEffect } from "react"; 
import TinyMCEEditor from "../../editor/editor.jsx";
import moment from "moment";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "../../components/Pagination";
import Accordion from "../../components/Accordion";
import FormDropdown from "../../components/FormDropdown";

export default function GeneralQueries() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [replyEditors, setReplyEditors] = useState({});
  const [expandMessages, setExpandMessages] = useState(false);

  const dropDownChange = (e) => {
    // Dummy function for testing
  };

  const handleSearch = (e) => {
    // Dummy function for testing
  };

  useEffect(() => {
    setLoading(true);
    setRefresRecords(false);
    setLoading(false);
  }, [RefresRecords]);

  const handleReplyToggle = (id) => {
    setReplyEditors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReplySubmit = async (id, reply) => {
    try {
      alert("Reply saved successfully.");
      setRefresRecords(true);
    } catch (error) {
      console.error("Failed to save reply", error);
      alert("Failed to save reply. Please try again.");
    }
  };

  return (
    <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">
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
                  <FormDropdown
                    onChange={dropDownChange}
                    name="location"
                    options={[]}
                    default_value={""}
                    classnm="form-select fs-12"
                    default_option={true}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search</label>
                  <input
                    type="text"
                    className="form-control fs-12"
                    id="searchProduct"
                    placeholder="Search Queries"
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                      addClass="mt-10"
                      id={query.id}
                      title={query.subject}
                      key={query.id}
                      infoTitle={moment(query.created_at).format("D MMM, YYYY")}
                    >
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
                                    <button
                                      className="btn btn-link"
                                      onClick={() => setExpandMessages(!expandMessages)}
                                    >
                                    <i className={`bi bi-${query.messages.length}-circle-fill bg-color f-size`}></i>
                                    <i className={`fa ${expandMessages ? "fa-chevron-up" : "fa-chevron-down"}`} />
                                     
                                    </button>
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
                                <i
                                    className={`bi ${replyEditors[query.id] ? 'bi bi-x-circle-fill bg-color font-size' : 'bi-arrow-return-left font-size' } float-end`}
                                    onClick={() => handleReplyToggle(query.id)}
                                ></i>

                              </td>
                            </tr>
                            {replyEditors[query.id] && (
                              <tr>
                                <td colSpan={3}>
                                  <TinyMCEEditor
                                    height = {200}
                                    onEditorChange={(content) =>
                                      setReplyEditors((prev) => ({
                                        ...prev,
                                        [query.id]: content,
                                      }))
                                    }
                                  />
                                  <button
                                  type="submit"
                                    className="ss_btn text-right mt-2 mb-2 float-end"
                                   
                                    onClick={() =>
                                      handleReplySubmit(query.id, replyEditors[query.id])
                                    }
                                  >
                                    Submit
                                  </button>
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
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  refreshRecords={setRefresRecords}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}