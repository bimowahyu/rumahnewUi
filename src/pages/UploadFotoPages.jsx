import React, { useEffect } from "react";
import { UploadFoto } from "../componen/Uploadfoto";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMeAdmin } from "../fitur/AuthSlice";

export const UploadFotoPages = () => {
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
   <UploadFoto />
  )
}
