import React from 'react';
import { Route } from 'react-router-dom';

import Home from 'pages/Home';
import Login from 'pages/Login';

import ServiceListPage from 'pages/_ServiceManagement/ServiceList';
import InitPage from 'pages/_ServiceManagement/InitPage';

import SystemHospitalListPage from 'pages/_SystemManagement/HospitalList';
import HospitalAddPage from 'pages/_SystemManagement/HospitalAdd';
import HospitalDetailPage from 'pages/_SystemManagement/HospitalDetail';
import SystemMajorListPage from 'pages/_SystemManagement/MajotList';
import SystemDiseaseListPage from 'pages/_SystemManagement/DiseaseList';
import SystemDoctorListPage from 'pages/_SystemManagement/DoctorList';
import DoctorAddPage from 'pages/_SystemManagement/DoctorAdd';
import DoctorDetailPage from 'pages/_SystemManagement/DoctorDetail';
import SystemHospitalDiseaseListPage from 'pages/_SystemManagement/HospitalDiseaseList';
import HospitalDiseaseAddPage from 'pages/_SystemManagement/HospitalDiseaseAdd';
import HospitalDiseaseDetailPage from 'pages/_SystemManagement/HospitalDiseaseDetail';
import SystemTreatmentStatusPage from 'pages/_SystemManagement/TreatmentStatus';

export const adminAppRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route element={<Home />}>
      <Route path="/" element={<InitPage />} />
      <Route path="/system-management/hospital/list" element={<SystemHospitalListPage />} />
      <Route path="/system-management/hospital/add" element={<HospitalAddPage />} />
      <Route path="/system-management/hospital/detail/:hospitalSeq" element={<HospitalDetailPage />} />
      <Route path="/system-management/major/list" element={<SystemMajorListPage />} />
      <Route path="/system-management/disease/list" element={<SystemDiseaseListPage />} />
      <Route path="/system-management/doctor/list" element={<SystemDoctorListPage />} />
      <Route path="/system-management/doctor/add" element={<DoctorAddPage />} />
      <Route path="/system-management/doctor/detail/:doctorSeq" element={<DoctorDetailPage />} />
      <Route path="/system-management/hospital-disease/list" element={<SystemHospitalDiseaseListPage />} />
      <Route path="/system-management/hospital-disease/add" element={<HospitalDiseaseAddPage />} />
      <Route path="/system-management/hospital-disease/detail/:seq" element={<HospitalDiseaseDetailPage />} />
      <Route path="/system-management/treatment/status" element={<SystemTreatmentStatusPage />} />
      <Route path="/etc-management/update/password" element={<ServiceListPage />} />
    </Route>
  </>
);
