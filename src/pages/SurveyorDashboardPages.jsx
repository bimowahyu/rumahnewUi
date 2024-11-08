import React, { useEffect } from "react";
import SurveyorDashboard from "../componen/SurveyorDashboard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMeAdmin } from "../fitur/AuthSlice";

export const SurveyorDashboardPages = () => {
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
   <SurveyorDashboard />
  )
}
