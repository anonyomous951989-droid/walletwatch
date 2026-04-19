import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  DatePicker,
  Alert,
} from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  FilterOutlined,
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import moment from "moment";
import Analytics from "../components/Analytics";
import { BASE_URL } from "../utils/baseURL";
import { getResponseError } from "../utils/getResponseError";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { RangePicker } = DatePicker;
const { Search } = Input;

/* ── Animated counter ── */
const AnimatedCounter = ({ value, prefix = "₹ " }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const target = Math.abs(value || 0);
    if (!target) { setCount(0); return; }
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{count.toLocaleString("en-IN")}</span>;
};

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [trasactionError, setTrasactionError] = useState(null);

  /* ── Computed statss ── */
  const stats = useMemo(() => {
    const totalIncome = allTransection
      .filter((t) => t.type === "Income")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = allTransection
      .filter((t) => t.type === "Expense")
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      total: allTransection.length,
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [allTransection]);

  //table data
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      width: 60,
      render: (text, record, index) => (
        <span className="tbl-sno">{index + 1}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => (
        <span className="tbl-date">
          <CalendarOutlined className="tbl-date-icon" />
          {moment(text).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      render: (text) => (
        <span className="tbl-amount">₹ {Number(text).toLocaleString("en-IN")}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) => (
        <span className={`tbl-type-badge ${text === "Income" ? "tbl-type-income" : "tbl-type-expense"}`}>
          {text === "Income" ? <RiseOutlined /> : <FallOutlined />}
          {text}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => <span className="tbl-category">{text}</span>,
    },
    {
      title: "Reference",
      dataIndex: "refrence",
      render: (text) => <span className="tbl-ref">{text || "—"}</span>,
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="tbl-actions">
          <button
            className="tbl-action-btn tbl-edit-btn"
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
            title="Edit"
          >
            <EditOutlined />
          </button>
          <button
            className="tbl-action-btn tbl-delete-btn"
            onClick={() => handleDelete(record)}
            title="Delete"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  //getall transactions
  const getAllTransactions = useCallback(async () => {
    try {
      setTrasactionError(null);
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/transactions/get-transection`,
        {
          frequency,
          selectedDate,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
              }`,
          },
        }
      );
      setAllTransection(res.data.transactions);
      setLoading(false);
      setTrasactionError(null);
    } catch (error) {
      setLoading(false);
      setTrasactionError(getResponseError(error));
      message.error("Fetch Issue With Transactions...!");
    }
  }, [frequency, selectedDate, type]);

  //useEffect Hook
  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

  //delete handler
  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this transaction?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteTransaction(record);
      },
      onCancel: () => { },
    });
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);
      const transactionId = record.transactionId;
      await axios.post(
        `${BASE_URL}/api/v1/transactions/delete-transection/${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
              }`,
          },
        }
      );

      setLoading(false);
      //For auto update on client if any update or edit be done
      getAllTransactions();
      message.success("Transaction Deleted successfully...!", {
        duration: 2,
        position: "top",
        marginTop: "20",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      setTrasactionError(getResponseError(error));
      message.error("Unable to delete");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editable) {
        const transactionId = editable.transactionId;
        await axios.post(
          `${BASE_URL}/api/v1/transactions/edit-transection/${transactionId}`,
          {
            ...values,
          },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
                }`,
            },
          }
        );
        setLoading(false);

        getAllTransactions();

        message.success("Transaction Updated Successfully", {
          position: "top",
          marginTop: "20",
        });
      } else {
        await axios.post(
          `${BASE_URL}/api/v1/transactions/add-transection`,
          {
            ...values,
          },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token
                }`,
            },
          }
        );
        setLoading(false);

        getAllTransactions();

        message.success("Transaction Added Successfully", {
          position: "top",
          marginTop: "20",
        });
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      console.error("Transaction API Error:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error?.message || "Please fill all fields or check inputs";
      setTrasactionError(errorMsg);
      message.error(errorMsg);
    }
  };

  // Search handler
  const onSearch = (value) => {
    if (!value) {
      getAllTransactions();
      return;
    }

    const filteredData = allTransection.filter((transaction) =>
      Object.values(transaction).some((field) =>
        field?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );

    setAllTransection(filteredData);
  };

  // Export to excel
  const exportToExcel = () => {
    setTrasactionError(null);
    if (allTransection.length === 0) {
      setTrasactionError("No data available to export.");
      return;
    }

    const exportData = allTransection.map((transaction, index) => ({
      "S.No": index + 1,
      "Date (yyyy-mm-dd)": moment(transaction.date).format("YYYY-MM-DD"),
      "Amount (Rs.)": transaction.amount,
      Type: transaction.type,
      Category: transaction.category,
      Reference: transaction.refrence,
      Description: transaction.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const currentDate = moment().format("DD-MM-YYYY");
    saveAs(data, `Transactions(${currentDate}).xlsx`);
  };

  return (
    <>
      <Layout>
        <div className="dashboard-root">
          {trasactionError && (
            <Alert
              message={trasactionError}
              type="error"
              showIcon
              closable
              className="dashboard-alert"
              style={{ marginBottom: 16, borderRadius: 12 }}
            />
          )}

          {/* ══════════════════════════════════════════
              SUMMARY CARDS
          ══════════════════════════════════════════ */}
          <div className="dashboard-summary">
            <div className="dash-card dash-card--balance">
              <div className="dash-card-decoration" />
              <div className="dash-card-icon-wrap">
                <WalletOutlined className="dash-card-icon" />
              </div>
              <div className="dash-card-content">
                <span className="dash-card-label">Total Balance</span>
                <span className="dash-card-value">
                  <AnimatedCounter value={stats.balance} />
                </span>
              </div>
            </div>

            <div className="dash-card dash-card--income">
              <div className="dash-card-decoration" />
              <div className="dash-card-icon-wrap">
                <RiseOutlined className="dash-card-icon" />
              </div>
              <div className="dash-card-content">
                <span className="dash-card-label">Total Income</span>
                <span className="dash-card-value">
                  <AnimatedCounter value={stats.income} />
                </span>
              </div>
            </div>

            <div className="dash-card dash-card--expense">
              <div className="dash-card-decoration" />
              <div className="dash-card-icon-wrap">
                <FallOutlined className="dash-card-icon" />
              </div>
              <div className="dash-card-content">
                <span className="dash-card-label">Total Expense</span>
                <span className="dash-card-value">
                  <AnimatedCounter value={stats.expense} />
                </span>
              </div>
            </div>

            <div className="dash-card dash-card--count">
              <div className="dash-card-decoration" />
              <div className="dash-card-icon-wrap">
                <SwapOutlined className="dash-card-icon" />
              </div>
              <div className="dash-card-content">
                <span className="dash-card-label">Transactions</span>
                <span className="dash-card-value">
                  <AnimatedCounter value={stats.total} prefix="" />
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              FILTERS BAR
          ══════════════════════════════════════════ */}
          <div className="dashboard-filters">
            <div className="df-group">
              <label className="df-label">
                <CalendarOutlined /> Frequency
              </label>
              <Select
                value={frequency}
                onChange={(values) => setFrequency(values)}
                className="df-select"
                popupClassName="df-dropdown"
              >
                <Select.Option value="7">Last 1 Week</Select.Option>
                <Select.Option value="30">Last 1 Month</Select.Option>
                <Select.Option value="365">Last 1 Year</Select.Option>
                <Select.Option value="custom">Custom Range</Select.Option>
              </Select>
              {frequency === "custom" && (
                <RangePicker
                  value={selectedDate}
                  onChange={(values) => setSelectedate(values)}
                  className="df-rangepicker"
                />
              )}
            </div>

            <div className="df-group">
              <label className="df-label">
                <FilterOutlined /> Type
              </label>
              <Select
                value={type}
                onChange={(values) => setType(values)}
                className="df-select"
              >
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="Income">INCOME</Select.Option>
                <Select.Option value="Expense">EXPENSE</Select.Option>
              </Select>
            </div>

            <div className="df-group">
              <label className="df-label">
                <SearchOutlined /> Search
              </label>
              <Search
                placeholder="Search transactions..."
                allowClear
                onSearch={onSearch}
                className="df-search"
              />
            </div>

            <div className="df-view-toggle">
              <button
                className={`df-toggle-btn ${viewData === "table" ? "df-toggle-active" : ""}`}
                onClick={() => setViewData("table")}
                title="Table View"
              >
                <UnorderedListOutlined />
                <span>Table</span>
              </button>
              <button
                className={`df-toggle-btn ${viewData === "analytics" ? "df-toggle-active" : ""}`}
                onClick={() => setViewData("analytics")}
                title="Analytics View"
              >
                <AreaChartOutlined />
                <span>Analytics</span>
              </button>
            </div>

            <div className="df-actions">
              <button
                className="df-btn df-btn-primary"
                onClick={() => {
                  setEditable(null);
                  setShowModal(true);
                }}
              >
                <PlusOutlined /> Add New
              </button>
              <button className="df-btn df-btn-export" onClick={exportToExcel}>
                <ExportOutlined /> Export
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              CONTENT AREA
          ══════════════════════════════════════════ */}
          <div className="dashboard-content">
            {viewData === "table" ? (
              <div className="dashboard-table-wrap">
                <Table
                  columns={columns}
                  dataSource={allTransection}
                  loading={loading}
                  pagination={{ pageSize: 8, showSizeChanger: false }}
                  className="dashboard-table"
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "tbl-row-even" : "tbl-row-odd"
                  }
                />
              </div>
            ) : (
              <Analytics allTransection={allTransection} />
            )}
          </div>

          {/* ══════════════════════════════════════════
              MODAL
          ══════════════════════════════════════════ */}
          <Modal
            title={editable ? "Edit Transaction" : "Add Transaction"}
            open={showModal}
            onCancel={() => setShowModal(false)}
            destroyOnClose={true}
            footer={false}
            className="dashboard-modal"
          >
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={editable ? {
                ...editable,
                date: editable.date ? moment(editable.date).format("YYYY-MM-DD") : undefined
              } : {}}
            >
              <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter amount' }]}>
                <Input type="number" placeholder="e.g. 1500" />
              </Form.Item>
              <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select type' }]}>
                <Select placeholder="Select type">
                  <Select.Option value="Income">Income</Select.Option>
                  <Select.Option value="Expense">Expense</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select category' }]}>
                <Select placeholder="Select category">
                  <Select.Option value="Income in Salary">
                    Income in Salary
                  </Select.Option>
                  <Select.Option value="Income in Part Time">
                    Income in Part Time
                  </Select.Option>
                  <Select.Option value="Income in Project">
                    Income in Project
                  </Select.Option>
                  <Select.Option value="Income in Freelancing">
                    Income in Freelancing
                  </Select.Option>
                  <Select.Option value="Expense in Tip">
                    Expense in Tip
                  </Select.Option>
                  <Select.Option value="Expense in Stationary">
                    Expense in Stationary
                  </Select.Option>
                  <Select.Option value="Expense in Food">
                    Expense in Food
                  </Select.Option>
                  <Select.Option value="Expense in Movie">
                    Expense in Movie
                  </Select.Option>
                  <Select.Option value="Expense in Bills">
                    Expense in Bills
                  </Select.Option>
                  <Select.Option value="Expense in Medical">
                    Expense in Medical
                  </Select.Option>
                  <Select.Option value="Expense in Fees">
                    Expense in Fees
                  </Select.Option>
                  <Select.Option value="Expense in TAX">
                    Expense in TAX
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Reference" name="refrence" rules={[{ required: true, message: 'Please enter a reference' }]}>
                <Input type="text" placeholder="e.g. UPI / Cash" />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter description' }]}>
                <Input type="text" placeholder="Brief description" />
              </Form.Item>
              <div className="modal-footer-btns">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Transaction"}
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
