import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import apiDataJson from "@/data/apiData.json";

export const Route = createFileRoute("/dashboard-api/")({
  component: RouteComponent,
});

type ApiStatus = "✅ 사용" | "⏸️ 미사용" | "⚠️ Deprecated" | "";

interface ApiItem {
  id: string;
  name: string;
  description: string;
  rnApi: string;
  webviewApi: string;
  inputExample?: string;
  urlExample?: string;
  note?: string;
  addedDate?: string;
  status: ApiStatus;
}

interface ApiCategory {
  title: string;
  apis: ApiItem[];
}

function RouteComponent() {
  const [apiData, setApiData] = useState<ApiCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApiStatus | "all">("all");

  useEffect(() => {
    // status 변환 함수
    const convertStatus = (status: string): ApiStatus => {
      if (!status) return "";
      const statusLower = status.toLowerCase().trim();

      // 이미 이모지 포함된 형식이면 그대로 반환
      if (
        status.includes("✅") ||
        status.includes("⏸️") ||
        status.includes("⚠️")
      ) {
        return status as ApiStatus;
      }

      // 간단한 형식을 이모지 포함 형식으로 변환
      if (statusLower === "사용" || statusLower === "use") {
        return "✅ 사용";
      }
      if (statusLower === "미사용" || statusLower === "unused") {
        return "⏸️ 미사용";
      }
      if (statusLower === "deprecated" || statusLower === "폐기") {
        return "⚠️ Deprecated";
      }

      return "";
    };

    // JSON 데이터를 ApiCategory[] 타입으로 변환
    const loadedData: ApiCategory[] = (apiDataJson as any[]).map(
      (category) => ({
        ...category,
        apis: category.apis.map((api: any) => ({
          ...api,
          status: convertStatus(api.status || ""),
        })),
      }),
    );

    setApiData(loadedData);
  }, []);

  const getStatusColor = (status: ApiStatus) => {
    switch (status) {
      case "✅ 사용":
        return "bg-green-100 text-green-800 border-green-300";
      case "⏸️ 미사용":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "⚠️ Deprecated":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-white text-gray-400 border-gray-200";
    }
  };

  const filteredData = apiData
    .map((category) => ({
      ...category,
      apis: category.apis.filter((api) => {
        const matchesSearch =
          searchTerm === "" ||
          api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.rnApi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.webviewApi.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterStatus === "all" || api.status === filterStatus;

        return matchesSearch && matchesFilter;
      }),
    }))
    .filter((category) => category.apis.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                📚 API 관리 대시보드
              </h1>
              <p className="text-slate-600">
                React Native와 Webview API 매핑 정보를 관리합니다
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🔍 검색
              </label>
              <input
                type="text"
                placeholder="API 이름, 설명, 엔드포인트로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🏷️ 상태 필터
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as ApiStatus | "all")
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="all">전체</option>
                <option value="✅ 사용">✅ 사용</option>
                <option value="⏸️ 미사용">⏸️ 미사용</option>
                <option value="⚠️ Deprecated">⚠️ Deprecated</option>
                <option value="">미지정</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Categories */}
        <div className="space-y-6">
          {filteredData.map((category, _categoryIndex) => (
            <div
              key={category.title}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  {category.title}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {category.apis.length}개의 API
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {category.apis.map((api, _apiIndex) => {
                  // const originalCategoryIndex = apiData.findIndex(
                  // 	(c) => c.title === category.title,
                  // );
                  // const originalApiIndex = apiData[
                  // 	originalCategoryIndex
                  // ].apis.findIndex((a) => a.id === api.id);

                  return (
                    <div
                      key={api.id}
                      className="p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-slate-800">
                              {api.name}
                            </h3>
                            {api.status && (
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(api.status)}`}
                              >
                                {api.status}
                              </span>
                            )}
                            {api.addedDate && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                추가: {api.addedDate}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mb-3">
                            {api.description}
                          </p>
                        </div>
                      </div>

                      {/* API Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-slate-700">
                              RN API:
                            </span>
                            <code className="ml-2 px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs">
                              {api.rnApi}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">
                              Webview API:
                            </span>
                            <code className="ml-2 px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs">
                              {api.webviewApi}
                            </code>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {api.inputExample && (
                            <div>
                              <span className="font-medium text-slate-700">
                                Input 예시:
                              </span>
                              <code className="ml-2 px-2 py-1 bg-amber-50 text-amber-800 rounded text-xs block mt-1">
                                {api.inputExample}
                              </code>
                            </div>
                          )}
                          {api.urlExample && (
                            <div>
                              <span className="font-medium text-slate-700">
                                URL 예시:
                              </span>
                              <a
                                href={api.urlExample}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs block mt-1"
                              >
                                {api.urlExample}
                              </a>
                            </div>
                          )}
                          {api.note && (
                            <div>
                              <span className="font-medium text-slate-700">
                                비고:
                              </span>
                              <span className="ml-2 text-slate-600 text-xs">
                                {api.note}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-slate-400 text-lg">
              검색 결과가 없습니다. 다른 검색어를 시도해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
