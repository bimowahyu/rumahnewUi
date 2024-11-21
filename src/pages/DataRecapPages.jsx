import React, { useEffect } from "react";
import DataRecapComponent from "../componen/DataRecapComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMeAdmin } from "../fitur/AuthSlice";
import Footer from "../componen/Footer";

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
    <>
      {/* Komponen utama */}
      <DataRecapComponent />
      {/* Footer di bagian bawah */}
      <Footer />
    </>
  );
};
