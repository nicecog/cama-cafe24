import axios from "@/utils/axios";
import useAlert from "@/hooks/useAlert";
import ClientPagination from "@/components/Pagination/ClientPagination";
import Button from "@/components/button/DefaultButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FcAndroidOs } from "react-icons/fc";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";

type ApkRelease = {
  fileName: string;
  version: string;
  downloadUrl: string;
  uploadedAt: string;
  sizeBytes: number;
};

function formatFileSize(bytes: number) {
  if (!bytes) return "-";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function ApkManagement() {
  const { t } = useTranslation();
  const { alert } = useAlert();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [version, setVersion] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const displayRow = 10;

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["apk", "list"],
    queryFn: async () => {
      const { data: res } = await axios.post("/api/doctor/apk/list", {});
      return (res?.response ?? []) as ApkRelease[];
    },
  });

  const list = data ?? [];

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * displayRow;
    return list.slice(startIndex, startIndex + displayRow);
  }, [list, currentPage]);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error(t("apkManagement.noFileSelected"));
      }
      if (!version.trim()) {
        throw new Error(t("apkManagement.versionRequired"));
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("version", version.trim());

      const { data: res } = await axios.post("/api/doctor/apk/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.response as ApkRelease;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["apk", "list"] });
      setSelectedFile(null);
      setVersion("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert(t("apkManagement.uploadSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        t("apkManagement.uploadFailed");
      alert(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      await axios.post("/api/doctor/apk/delete", { fileName });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["apk", "list"] });
      alert(t("apkManagement.deleteSuccess"));
    },
    onError: () => {
      alert(t("apkManagement.deleteFailed"));
    },
  });

  const onDelete = async (fileName: string) => {
    const confirmed = window.confirm(t("apkManagement.deleteConfirm"));
    if (!confirmed) return;
    deleteMutation.mutate(fileName);
  };

  const latestRelease = list[0];

  return (
    <>
      {(isPending || isFetching || uploadMutation.isPending || deleteMutation.isPending) && (
        <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-green-600 border-solid rounded-full animate-spin border-t-transparent" />
        </div>
      )}

      <div className="flex flex-col h-full gap-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 border-b-2 border-main pb-2 mb-2 flex items-center gap-2">
            <FcAndroidOs className="text-2xl" />
            {t("apkManagement.title")}
          </h1>
          <p className="text-sm text-gray-600">{t("apkManagement.description")}</p>
        </div>

        {latestRelease && (
          <div className="rounded-lg border border-[#66b49f] bg-[#f3faf6] px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-[#1e3932] mb-1">Latest Release</p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-gray-800">v{latestRelease.version}</p>
                <p className="text-xs text-gray-600">{latestRelease.uploadedAt}</p>
              </div>
              <a
                href={latestRelease.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-main px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                {t("apkManagement.download")}
              </a>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <IoCloudUploadOutline />
            {t("apkManagement.uploadTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto_auto] gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("apkManagement.version")}
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder={t("apkManagement.versionPlaceholder")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-main focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("apkManagement.selectFile")}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold hover:file:bg-gray-200"
              />
            </div>
            <Button
              onClick={() => {
                if (!uploadMutation.isPending) {
                  uploadMutation.mutate();
                }
              }}
              className="h-[38px] px-5"
            >
              {uploadMutation.isPending ? t("apkManagement.uploading") : t("apkManagement.upload")}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h2 className="text-sm font-extrabold text-gray-800 border-b text-right pb-0.5 mb-2">
            {t("apkManagement.totalCount", { count: list.length })}
          </h2>
          <div className="overflow-auto">
            <table className="w-full border-collapse table-fixed border-t-2 border-main">
              <colgroup>
                <col style={{ width: "70px" }} />
                <col style={{ width: "110px" }} />
                <col />
                <col style={{ width: "150px" }} />
                <col style={{ width: "90px" }} />
                <col style={{ width: "110px" }} />
                <col style={{ width: "90px" }} />
              </colgroup>
              <thead className="sticky top-0 bg-gray-50 border-b-2 border-main">
                <tr>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.number")}
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.version")}
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.fileName")}
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.uploadedAt")}
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.size")}
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.download")}
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("apkManagement.columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={row.fileName}
                    className="border-b border-gray-200 transition-all hover:bg-gray-50"
                  >
                    <td className="px-3 py-3 text-center text-sm text-gray-700">
                      {(currentPage - 1) * displayRow + index + 1}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-semibold text-[#1e3932]">
                      v{row.version}
                    </td>
                    <td className="px-3 py-3 text-left text-sm text-gray-800 break-all">
                      {row.fileName}
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-gray-700">
                      {row.uploadedAt}
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-gray-700">
                      {formatFileSize(row.sizeBytes)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <a
                        href={row.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-main underline hover:opacity-80"
                      >
                        {t("apkManagement.download")}
                      </a>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDelete(row.fileName)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <IoTrashOutline />
                        {t("apkManagement.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                      {t("apkManagement.emptyList")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {list.length > displayRow && (
            <div className="mt-4">
              <ClientPagination
                currentPage={currentPage}
                totalCount={list.length}
                displayRow={displayRow}
                onClick={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
