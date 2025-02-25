import React, { useEffect } from "react";
import { UploadPdf } from "../componen/UploadPdf";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMeAdmin } from "../fitur/AuthSlice";
import Footer from "../componen/Footer";
import "./Upload.css"
import { Layout } from "../layout/Layout";

export const UploadPdfPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.authAdmin);

  useEffect(() => {
    dispatch(getMeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <Layout>
    
      <div>
        <UploadPdf />
      </div>
    </Layout>
  );
};
