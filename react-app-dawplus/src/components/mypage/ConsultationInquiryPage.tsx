import { format, parse } from "date-fns";
import { useAtomValue } from "jotai";
import {
  CalendarDays,
  ClipboardList,
  Loader2,
  MessageSquareText,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { WebviewConsultationInquiry } from "@/apis/types";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { MypageSubPageLayout } from "@/components/mypage/MypageSubPageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Popup from "@/components/ui/Popup";
import { useDialog } from "@/hooks/useDialog";
import {
  useCreateConsultationInquiry,
  useDeleteConsultationInquiry,
  useUpdateConsultationInquiry,
} from "@/hooks/mutations/webview";
import { useConsultationInquiries } from "@/hooks/queries/webview";
import { cn } from "@/lib/utils";

const MAX_INQUIRIES = 5;

type FormState = {
  title: string;
  content: string;
};

const emptyForm: FormState = { title: "", content: "" };

function formatInquiryDate(value?: string | null) {
  if (!value) return "-";
  try {
    const parsed = parse(value, "yyyy-MM-dd HH:mm:ss", new Date());
    return format(parsed, "yyyy.MM.dd");
  } catch {
    return value.slice(0, 10).replaceAll("-", ".");
  }
}

function TransmissionBadge({ transmitted }: { transmitted: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        transmitted
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
      )}
    >
      {transmitted ? "전송완료" : "미전송"}
    </span>
  );
}

export function ConsultationInquiryPage() {
  const { data: account } = useAtomValue(accountMeAtom);
  const acSeq = String(account?.seq ?? "");
  const { confirm, alert } = useDialog();

  const { data: inquiries = [], isLoading, refetch } = useConsultationInquiries(
    acSeq,
    !!account?.seq,
  );
  const createMutation = useCreateConsultationInquiry();
  const updateMutation = useUpdateConsultationInquiry();
  const deleteMutation = useDeleteConsultationInquiry();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [selected, setSelected] = useState<WebviewConsultationInquiry | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const pendingInquiries = useMemo(
    () => inquiries.filter((item) => !item.transmitted),
    [inquiries],
  );
  const transmittedInquiries = useMemo(
    () => inquiries.filter((item) => item.transmitted),
    [inquiries],
  );

  const canCreate = pendingInquiries.length < MAX_INQUIRIES;
  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const formValid = useMemo(
    () => form.title.trim().length > 0 && form.content.trim().length > 0,
    [form.content, form.title],
  );

  const editFormValid = useMemo(
    () => editForm.title.trim().length > 0 && editForm.content.trim().length > 0,
    [editForm.content, editForm.title],
  );

  const openDetail = useCallback((item: WebviewConsultationInquiry) => {
    setSelected(item);
    setEditForm({ title: item.title, content: item.content });
    setEditMode(false);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditMode(false);
    setSelected(null);
    setEditForm(emptyForm);
  }, []);

  const handleCreate = async () => {
    if (!account?.seq || !formValid) return;

    if (!canCreate) {
      await alert("미전송 문의사항은 최대 5개까지 등록할 수 있습니다.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        acSeq: account.seq,
        title: form.title.trim(),
        content: form.content.trim(),
      });
      setForm(emptyForm);
      // 저장 직후 목록을 강제 재조회 (WebView 캐시/키 불일치 대비)
      await refetch();
      await alert("문의사항이 저장되었습니다.");
    } catch {
      await alert("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleUpdate = async () => {
    if (!selected || !account?.seq || !editFormValid) return;

    try {
      await updateMutation.mutateAsync({
        seq: selected.seq,
        data: {
          acSeq: account.seq,
          title: editForm.title.trim(),
          content: editForm.content.trim(),
        },
      });
      closeModal();
      await alert("수정되었습니다.");
    } catch {
      await alert("수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleDelete = async () => {
    if (!selected || !account?.seq) return;

    await confirm(
      {
        title: "문의사항 삭제",
        body: "선택한 문의사항을 삭제할까요?",
        actionButton: "삭제",
        cancelButton: "취소",
      },
      async () => {
        try {
          await deleteMutation.mutateAsync({
            seq: selected.seq,
            acSeq: account.seq,
          });
          closeModal();
          await alert("삭제되었습니다.");
        } catch {
          await alert("삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
      },
    );
  };

  return (
    <MypageSubPageLayout title="진찰시 문의사항">
      <div className="bg-gradient-to-b from-[#FFF8F2] to-white px-4 py-5">
        {/* 안내 */}
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#F3DCC8] bg-white p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF1E6]">
            <MessageSquareText className="h-5 w-5 text-[#ED7101]" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#774F2D]">
              진료 전 궁금한 점을 미리 적어 두세요
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              미전송 문의사항은 최대 {MAX_INQUIRIES}개까지 저장할 수 있습니다.
              의사앱 자료전송 시 미전송 항목만 함께 전달됩니다.
            </p>
          </div>
        </div>

        {/* 입력 폼 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#444]">
              <ClipboardList className="h-5 w-5 text-[#ED7101]" />
              새 문의 작성
            </h2>
            <span className="text-sm text-gray-500">
              미전송 {pendingInquiries.length}/{MAX_INQUIRIES}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="inquiry-title"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                제목
              </label>
              <Input
                id="inquiry-title"
                placeholder="예) 다음 진찰 때 확인할 증상"
                maxLength={200}
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="h-11 rounded-xl border-gray-200 bg-gray-50 text-base"
                disabled={!canCreate || isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-content"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                내용
              </label>
              <textarea
                id="inquiry-content"
                placeholder="진찰 시 의사 선생님께 전달하고 싶은 내용을 입력해 주세요."
                rows={5}
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                disabled={!canCreate || isSubmitting}
                className="flex w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ED7101] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {!canCreate ? (
              <p className="text-sm text-amber-700">
                미전송 문의가 {MAX_INQUIRIES}개입니다. 기존 미전송 항목을
                삭제하거나 의사앱으로 전송한 뒤 새로 작성해 주세요.
              </p>
            ) : null}

            <Button
              type="button"
              className="h-12 w-full rounded-xl bg-[#ED7101] text-base font-semibold hover:bg-[#D96500]"
              disabled={!formValid || !canCreate || isSubmitting}
              onClick={handleCreate}
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              입력하기
            </Button>
          </div>
        </section>

        {/* 미전송 목록 */}
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-[#774F2D]">
            미전송 문의 목록
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              불러오는 중...
            </div>
          ) : pendingInquiries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
              <p className="text-base text-gray-500">
                아직 미전송 문의사항이 없습니다.
              </p>
              <p className="mt-1 text-sm text-gray-400">
                위 입력란에 제목과 내용을 작성해 주세요.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingInquiries.map((item) => (
                <li key={item.seq}>
                  <button
                    type="button"
                    onClick={() => openDetail(item)}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition active:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-1 text-base font-semibold text-[#333]">
                        {item.title}
                      </p>
                      <TransmissionBadge transmitted={false} />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      <span>입력일 {formatInquiryDate(item.createdAt)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {item.content}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 전송완료 목록 — 카운트 제외 */}
        {transmittedInquiries.length > 0 ? (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-[#774F2D]">
              전송완료 문의 목록
            </h2>
            <ul className="space-y-3">
              {transmittedInquiries.map((item) => (
                <li key={item.seq}>
                  <button
                    type="button"
                    onClick={() => openDetail(item)}
                    className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-left shadow-sm transition active:bg-emerald-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-1 text-base font-semibold text-[#333]">
                        {item.title}
                      </p>
                      <TransmissionBadge transmitted />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      <span>입력일 {formatInquiryDate(item.createdAt)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {item.content}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {/* 상세/수정 모달 */}
      <Popup
        open={modalOpen}
        setOpen={(open) => {
          if (!open) closeModal();
          else setModalOpen(true);
        }}
        title={editMode ? "문의 수정" : "문의 상세"}
        direction="bottom"
        className="rounded-t-3xl"
      >
        {selected ? (
          <div className="flex h-full flex-col px-4 pb-6 pt-2">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-inquiry-title"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    제목
                  </label>
                  <Input
                    id="edit-inquiry-title"
                    maxLength={200}
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="h-11 rounded-xl border-gray-200 bg-gray-50 text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-inquiry-content"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    내용
                  </label>
                  <textarea
                    id="edit-inquiry-content"
                    rows={8}
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="flex w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ED7101]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#333]">
                    {selected.title}
                  </h3>
                  <TransmissionBadge transmitted={selected.transmitted} />
                </div>
                <p className="text-sm text-gray-500">
                  입력일 {formatInquiryDate(selected.createdAt)}
                </p>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                    {selected.content}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              {editMode ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-xl"
                    onClick={() => {
                      setEditMode(false);
                      setEditForm({
                        title: selected.title,
                        content: selected.content,
                      });
                    }}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    className="h-12 flex-1 rounded-xl bg-[#ED7101] hover:bg-[#D96500]"
                    disabled={!editFormValid || isSubmitting}
                    onClick={handleUpdate}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    저장
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
                  </Button>
                  {!selected.transmitted ? (
                    <Button
                      type="button"
                      className="h-12 flex-1 rounded-xl bg-[#774F2D] hover:bg-[#654228]"
                      onClick={() => setEditMode(true)}
                      disabled={isSubmitting}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      수정
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        ) : null}
      </Popup>
    </MypageSubPageLayout>
  );
}
