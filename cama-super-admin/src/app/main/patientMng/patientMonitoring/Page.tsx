import { ChangeEvent, useMemo, useState } from "react";
import axios from "@/utils/axios";
import Pagination from "@/components/Pagination/Pagination";
import AgGrid from "@/components/grid/AgGrid";
import { useNavigate } from "react-router-dom";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAlert from "@/hooks/useAlert";
import { useTranslation } from "react-i18next";
 

export default function PatientMonitoring() {
  const { alert, confirm } = useAlert();
  const { t , i18n} = useTranslation();
  const navi = useNavigate();

  const qs = useQueryClient();

  
   

  // USER_TYPE_CD	10	연구참여자
  // USER_TYPE_CD	20	연구미참여자
  const userType = useMutation({
    mutationKey: ["monitoring", "account", "updateAccountInfo"],

    // mutationFn을 사용하여 API 호출 수행
    mutationFn: async (params: any) => {
      const response = await axios.put(
        `/api/monitoring/account/updateAccountInfo`,
        params
      );
      return response.data.response;
    },
  });

  const onUserTypeClick = (data: any) => {
    confirm(
      {
        title: t("patientMonitoring.userTypeChangeTitle"),
        html: `[${
          data.name
        }]님을 <span style="color : tomato; text-decoration:underline; margin  : 0px 4px;">${
          data.userTypeCd === "20" ? t("patientMonitoring.researchParticipant") : t("patientMonitoring.nonParticipant")
        }</span>${t("patientMonitoring.userTypeChangeMessage")} `,
        icon: "question",
      },
      () => {
        userType.mutate(
          {
            seq: data.seq,
            userTypeCd: data.userTypeCd === "20" ? "10" : "20",
          },
          {
            onSuccess: (res) => {
              if (res) {
                alert(t("patientMonitoring.userTypeChanged"), () => {
               qs.invalidateQueries({
                queryKey: ["patientMonitoring"],
               })
                });
              }
            },
          }
        );
      }
    );
  };

  const colDefs = useMemo(
    () => [
      { headerName: t("patientMonitoring.columns.name"), field: "name" },
      { headerName: t("patientMonitoring.columns.birth"), field: "birth" },
      { headerName: t("patientMonitoring.columns.gender"), field: "gender" },
      { headerName: t("patientMonitoring.columns.disease"), field: "diseaseName" },
      { headerName: t("patientMonitoring.columns.treatment"), field: "treatment" },

      { headerName: t("patientMonitoring.columns.progress"), field: "progress" },
      { headerName: t("patientMonitoring.columns.lastUsed"), field: "createdAt" },
      { headerName: t("patientMonitoring.columns.userType"), field: "userTypeNm" },

      {
        headerName: t("patientMonitoring.columns.changeUserType"),
        cellRenderer: (params: any) => {
          return (
            <div>
              {params.data.userTypeCd === "20" ? (
                <button
                  className="bg-green-100 p-2 rounded-lg  text-gray-600 hover:bg-green-200 "
                  onClick={() => onUserTypeClick(params.data)}
                >
                  <FaUserCheck className="text-[17px]" />
                </button>
              ) : (
                <button
                  className="bg-red-100 p-2 rounded-lg  text-gray-600 hover:bg-red-200 "
                  onClick={() => onUserTypeClick(params.data)}
                >
                  <FaUserTimes className="text-[17px]" />
                </button>
              )}
            </div>
          );
        },
      },
      {
        headerName: t("patientMonitoring.columns.patientDetail"),
        cellRenderer: (params: any) => {
          return (
            <div>
              <button
                className="bg-gray-100 p-2 rounded-lg  text-gray-600 hover:bg-gray-300 "
                onClick={() => {
                  navi(
                    `/main/patientMng/coachingMonitoring?seq=${params.data.seq}&name=${params.data.name}`
                  );
                }}
              >
                <FcAbout className="text-[17px]" />
              </button>
            </div>
          );
        },
      },
    ],
    [t, i18n.language]
  );

 
  // 입력용 state (타이핑할 때 사용)
  const [searchInput, setSearchInput] = useState({
    searchText: "",
    searchType: "name",
    page: "1",
    displayRow: "20",
  });

  // 실제 쿼리용 state (검색 버튼 클릭 시 업데이트)
  const [queryParams, setQueryParams] = useState({
    searchText: "",
    searchType: "name",
    page: "1",
    displayRow: "20",
    
  });

  // React Query를 사용한 데이터 fetching
  const { data } = useQuery({
    queryKey: ["patientMonitoring", {...queryParams, lang: i18n.language}],
    queryFn: async () => {
      const response = await axios.get("/api/monitoring/patient", { params: {...queryParams, lang: i18n.language}});
      const _rows = response?.data?.response?.map((i: any) => {
        const _disease = JSON.parse(i.disease);

        return {
          ...i,
          diseaseName: _disease?.name,
          treatment: _disease?.diseaseTreatment[0]?.name,
        };
      });

      return {
        rows: _rows,
        pagination: response.data.pagination,
      };
    },
  });

  const pageData = data || {
    rows: [],
    pagination: {
      beginPage: 1,
      currentPage: 1,
      displayPage: 5,
      displayRow: 10,
      endNum: 10,
      endPage: 0,
      nextPage: 0,
      prevPage: 1,
      startNum: 0,
      totalCount: 0,
      totalPage: 0,
    },
  };

  const onSearch = (info: any) => {
    setQueryParams(info); // 검색 버튼 클릭 시에만 queryParams 업데이트
  };

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchInput((s) => ({ ...s, [name]: value }));
  };

  const onClickHandler = (page: any) => {
    onSearch({ ...queryParams, page });
  };

  const onReset = () => {
    const initialState = {
      searchText: "",
      searchType: "name",
      page: "1",
      displayRow: "20",
    };
    setSearchInput(initialState);
    setQueryParams(initialState);
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex flex-col h-full ">
          <div className="flex border-b border-main pb-2 shrink-0 gap-1 ">
            <input
              value={searchInput.searchText}
              onChange={onChange}
              name="searchText"
              placeholder={t("patientMonitoring.searchPlaceholder")}
              className="border text-sm px-3 py-1.5 outline-none rounded-sm"
            />
            <button
              type="button"
              className={`bg-main text-white px-4 rounded-sm text-sm font-scDream  `}
              onClick={() => onSearch(searchInput)}
            >
              {t("patientMonitoring.searchButton")}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 rounded-sm text-sm font-scDream hover:bg-gray-300"
              onClick={onReset}
            >
              {t("patientMonitoring.resetButton")}
            </button>
          </div>
          <div className="h-full mt-10 grow  ">
            <AgGrid
              colDefs={colDefs}
              rowData={pageData.rows}
              pagination={false}
            />
          </div>
        </div>
        <div className="shrink-0">
          <Pagination
            startNum={pageData.pagination.startNum}
            displayRow={pageData.pagination.displayRow}
            totalCount={pageData.pagination.totalCount}
            currentPage={pageData.pagination.currentPage}
            onClick={onClickHandler}
          />
        </div>
      </div>
    </>
  );
}
