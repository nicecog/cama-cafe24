import { useAtom } from "jotai";
import { wellbeingAtom } from "../wellbeingAtom";
import { Input, Select } from "@/components/forms";
import useCodeApi from "@/app/main/api/useCodeApi";
import { ChangeEvent, useMemo } from "react";
import QuillEditer from "@/components/edit/QuillEditer";
import ImageUploader from "@/components/imageUploader/ImageUploader";
import { useTranslation } from "react-i18next";

export default function WellbeingForm() {
  const { t } = useTranslation();
  // 코드정보
  const { getCodeList } = useCodeApi("WELLBEING_CATEGORY_CD");
  const { data: codes } = getCodeList();
  const options = useMemo(
    () =>
      codes.map((r: any) => ({
        ...r,
        label: r.val,
        value: r.cd,
      })),
    [codes]
  );

  const [info, setInfo] = useAtom(wellbeingAtom);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setInfo((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onEditChange = (contents: string) => {
    setInfo((s) => ({ ...s, contents }));
  };
  const onImageChange = (thumbnail: string) => {
    setInfo((s) => ({ ...s, thumbnail }));
  };

  return (
    <>
      <div className="h-full flex gap-4 py-3  items-stretch">
        <div className="w-6/12 pb-10 h-full shrink-0 ">
          {/* Row */}
          <div className="flex flex-col space-y-1 ">
            <div className="font-semibold">{t("wellbeing.form.category")}</div>
            <div className="w-full ">
              <Select
                options={options}
                onChange={onChangeHandler}
                name="wellbeingCategoryCd"
                value={info.wellbeingCategoryCd}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.title")}</div>
            <div className="w-full ">
              <Input
                onChange={onChangeHandler}
                name="title"
                value={info.title}
                className="w-[99%]"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.priority")}</div>
            <div className="w-full ">
              <Select
                options={[
                  { label: "1", value: 1 },
                  { label: "2", value: 2 },
                  { label: "3", value: 3 },
                  { label: "4", value: 4 },
                  { label: "5", value: 5 },
                ]}
                onChange={onChangeHandler}
                name="priority"
                value={info.priority}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.companyName")}</div>
            <div className="w-full ">
              <Input
                onChange={onChangeHandler}
                name="companyName"
                value={info.companyName}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.companyDescription")}</div>
            <div className="w-full ">
              <textarea
                onChange={onChangeHandler}
                name="companyDescription"
                value={info.companyDescription}
                className="w-full resize-none border text-xs p-1 focus:outline-none"
                rows={4}
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col     mt-7">
            <div className="font-semibold">{t("wellbeing.form.address")}</div>
            <div className="w-full ">
              <Input
                onChange={onChangeHandler}
                name="address"
                value={info.address}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.phoneNumber")}</div>
            <div className="w-full ">
              <Input
                type="number"
                onChange={onChangeHandler}
                name="phoneNumber"
                value={info.phoneNumber}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.homepage")}</div>
            <div className="w-full ">
              <Input
                onChange={onChangeHandler}
                name="homepage"
                value={info.homepage}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.sns")}</div>
            <div className="w-full ">
              <Input
                onChange={onChangeHandler}
                name="sns"
                value={info.sns}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-7">
            <div className="font-semibold">{t("wellbeing.form.thumbnail")}</div>
            <div className="w-full ">
              <ImageUploader images={info.thumbnail} onChange={onImageChange} />
            </div>
          </div>
          {/* Row */}
        </div>
        <div className="w-6/12 h-full  pb-14  ">
          <QuillEditer
            value={info.contents}
            onChange={onEditChange}
            className="h-full"
          />
        </div>
      </div>
    </>
  );
}
