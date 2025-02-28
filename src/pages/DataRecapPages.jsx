import React, { useEffect } from "react";
import DataRecapComponent from "../componen/DataRecapComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMeAdmin } from "../fitur/AuthSlice";
import Footer from "../componen/Footer";
import { Layout } from "../layout/Layout";
import "leaflet/dist/leaflet.css";


export const DataRecapPages = () => {
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
     
      <DataRecapComponent />
      
    </Layout>
  );
};
