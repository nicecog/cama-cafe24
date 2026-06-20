import { ChangeEvent, useMemo, useRef, useState } from "react";
import axios from "@/utils/axios";
import Pagination from "@/components/Pagination/Pagination";
import AgGrid from "@/components/grid/AgGrid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAlert from "@/hooks/useAlert";
import { useTranslation } from "react-i18next";
import { FcSms } from "react-icons/fc";
import type { GridApi } from "ag-grid-community";

type PatientRow = {
  seq: number;
  name: string;
  loginId?: string;
  birth?: string;
  gender?: string;
  diseaseName?: string;
  hasFcmToken?: boolean;
};

type FcmTestStatus = {
  active: boolean;
  sessionId?: string;
  backedUpScheduleCount?: number;
  preparedAt?: string;
};

type SendResult = {
  testModePrepared: boolean;
  backedUpScheduleCount: number;
  sentCount: number;
  failedCount: number;
  skippedNoTokenCount: number;
  items: Array<{
    accountSeq: number;
    name: string;
    success: boolean;
    detail: string;
  }>;
};

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function nowTimeString() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function NotificationMessageManagement() {
  const { t, i18n } = useTranslation();
  const { alert, confirm } = useAlert();
  const queryClient = useQueryClient();
  const gridApiRef = useRef<GridApi | null>(null);

  const [message, setMessage] = useState("");
  const [sendDate, setSendDate] = useState(todayString());
  const [sendTime, setSendTime] = useState(nowTimeString());
  const [searchInput, setSearchInput] = useState({
    searchText: "",
    searchType: "name",
    page: "1",
    displayRow: "20",
  });
  const [queryParams, setQueryParams] = useState(searchInput);

  const { data: testStatus } = useQuery({
    queryKey: ["notificationMsg", "fcmTestStatus"],
    queryFn: async () => {
      const { data } = await axios.get("/api/monitoring/notification/fcm-test-status");
      return (data?.response ?? { active: false }) as FcmTestStatus;
    },
    refetchInterval: 30000,
  });

  const { data, isFetching } = useQuery({
    queryKey: ["notificationMsg", "patients", { ...queryParams, lang: i18n.language }],
    queryFn: async () => {
      const response = await axios.get("/api/monitoring/patient", {
        params: { ...queryParams, lang: i18n.language },
      });
      const rows = (response?.data?.response ?? []).map((item: any) => {
        let diseaseName = "-";
        try {
          if (item.disease) {
            const parsed = JSON.parse(item.disease);
            diseaseName = parsed?.name ?? "-";
          }
        } catch {
          diseaseName = "-";
        }
        return {
          ...item,
          diseaseName,
          hasFcmToken:
            item.hasFcmToken === true || item.hasFcmToken === "true"
              ? true
              : item.hasFcmToken === false || item.hasFcmToken === "false"
                ? false
                : undefined,
        } as PatientRow;
      });
      return {
        rows,
        pagination: response.data.pagination,
      };
    },
  });

  const pageData = data ?? {
    rows: [],
    pagination: {
      currentPage: 1,
      displayRow: 20,
      startNum: 0,
      totalCount: 0,
    },
  };

  const restoreMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/monitoring/notification/restore-fcm-test");
      return data?.response as FcmTestStatus;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notificationMsg", "fcmTestStatus"] });
      alert(t("notificationMsg.restoreSuccess"));
    },
    onError: () => alert(t("notificationMsg.restoreFailed")),
  });

  const sendMutation = useMutation({
    mutationFn: async (accountSeqs: number[]) => {
      const { data } = await axios.post("/api/monitoring/notification/send", {
        accountSeqs,
        message,
        sendDate,
        sendTime,
      });
      return data?.response as SendResult;
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["notificationMsg", "fcmTestStatus"] });
      const summary = t("notificationMsg.sendResultSummary", {
        sent: result.sentCount,
        failed: result.failedCount,
        skipped: result.skippedNoTokenCount,
        backedUp: result.backedUpScheduleCount,
      });
      alert(summary);
      gridApiRef.current?.deselectAll();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        t("notificationMsg.sendFailed");
      alert(msg);
    },
  });

  const colDefs = useMemo(
    () => [
      { headerName: t("notificationMsg.columns.name"), field: "name" },
      { headerName: t("notificationMsg.columns.loginId"), field: "loginId" },
      { headerName: t("notificationMsg.columns.birth"), field: "birth" },
      { headerName: t("notificationMsg.columns.disease"), field: "diseaseName" },
      {
        headerName: t("notificationMsg.columns.fcmToken"),
        field: "hasFcmToken",
        valueFormatter: (p: any) =>
          p.value === true
            ? t("notificationMsg.fcmYes")
            : p.value === false
              ? t("notificationMsg.fcmNo")
              : "-",
      },
    ],
    [t]
  );

  const onSearch = () => setQueryParams({ ...searchInput, page: "1" });

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchInput((s) => ({ ...s, [name]: value }));
  };

  const onSend = () => {
    const selected = gridApiRef.current?.getSelectedRows() as PatientRow[] | undefined;
    if (!selected?.length) {
      alert(t("notificationMsg.noPatientSelected"));
      return;
    }
    if (!message.trim()) {
      alert(t("notificationMsg.messageRequired"));
      return;
    }

    const withoutToken = selected.filter((row) => row.hasFcmToken === false);
    const toSend = selected;

    if (!toSend.length) {
      alert(t("notificationMsg.noFcmTokenSelected"));
      return;
    }

    const warning =
      withoutToken.length > 0
        ? `\n${t("notificationMsg.skipNoTokenWarning", { count: withoutToken.length })}`
        : "";

    confirm(
      {
        title: t("notificationMsg.sendConfirmTitle"),
        html: `${t("notificationMsg.sendConfirmMessage", {
          count: toSend.length,
          date: sendDate,
          time: sendTime,
        })}${warning}`,
        icon: "question",
      },
      () => {
        sendMutation.mutate(toSend.map((row) => row.seq));
      }
    );
  };

  const busy =
    isFetching || sendMutation.isPending || restoreMutation.isPending;

  return (
    <>
      {busy && (
        <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-green-600 border-solid rounded-full animate-spin border-t-transparent" />
        </div>
      )}

      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-extrabold text-gray-800 border-b-2 border-main pb-2 flex items-center gap-2">
          <FcSms className="text-2xl" />
          {t("notificationMsg.title")}
        </h1>

        {testStatus?.active && (
          <div className="rounded-md border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <span>
              {t("notificationMsg.testModeActive", {
                count: testStatus.backedUpScheduleCount ?? 0,
                at: testStatus.preparedAt ?? "-",
              })}
            </span>
            <button
              type="button"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-sm rounded disabled:opacity-50"
              onClick={() => restoreMutation.mutate()}
              disabled={restoreMutation.isPending}
            >
              {t("notificationMsg.restoreButton")}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 border border-gray-200 rounded-lg p-4 bg-white shrink-0">
          <div className="lg:col-span-6 flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              {t("notificationMsg.messageLabel")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="border rounded px-3 py-2 text-sm outline-none focus:border-main resize-none"
              placeholder={t("notificationMsg.messagePlaceholder")}
            />
          </div>
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  {t("notificationMsg.dateLabel")}
                </label>
                <input
                  type="date"
                  value={sendDate}
                  onChange={(e) => setSendDate(e.target.value)}
                  className="border rounded px-3 py-2 text-sm outline-none focus:border-main"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  {t("notificationMsg.timeLabel")}
                </label>
                <input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="border rounded px-3 py-2 text-sm outline-none focus:border-main"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                type="button"
                className="bg-main text-white px-6 py-2 rounded text-sm font-semibold disabled:opacity-50"
                onClick={onSend}
                disabled={sendMutation.isPending}
              >
                {t("notificationMsg.sendButton")}
              </button>
            </div>
            <p className="text-xs text-gray-500">{t("notificationMsg.sendHint")}</p>
          </div>
        </div>

        <div className="flex border-b border-main pb-2 shrink-0 gap-1 items-center">
          <select
            name="searchType"
            value={searchInput.searchType}
            onChange={onChange}
            className="border text-sm px-2 py-1.5 outline-none rounded-sm bg-white"
          >
            <option value="name">{t("notificationMsg.searchTypeName")}</option>
            <option value="loginId">{t("notificationMsg.searchTypeLoginId")}</option>
          </select>
          <input
            value={searchInput.searchText}
            onChange={onChange}
            name="searchText"
            placeholder={t("notificationMsg.searchPlaceholder")}
            className="border text-sm px-3 py-1.5 outline-none rounded-sm"
          />
          <button
            type="button"
            className="bg-main text-white px-4 rounded-sm text-sm"
            onClick={onSearch}
          >
            {t("notificationMsg.searchButton")}
          </button>
        </div>

        <div className="grow min-h-[320px]">
          <AgGrid
            colDefs={colDefs}
            rowData={pageData.rows}
            pagination={false}
            rowSelection="multiple"
            onGridReady={(e) => {
              gridApiRef.current = e.api;
            }}
          />
        </div>

        <div className="shrink-0">
          <Pagination
            startNum={pageData.pagination.startNum}
            displayRow={pageData.pagination.displayRow}
            totalCount={pageData.pagination.totalCount}
            currentPage={pageData.pagination.currentPage}
            onClick={(page: string) =>
              setQueryParams((p) => ({ ...p, page }))
            }
          />
        </div>
      </div>
    </>
  );
}
