import { Input } from "@/components/forms";
import Modal from "@/components/modal/Modal";

import { ChangeEvent, useState } from "react";

type PassInfoType = {
  current: string;
  new: string;
  newCheck: string;
};

export default function PasswordModal(props: any) {
  const [passInfo, setPassInfo] = useState<PassInfoType>({
    current: "",
    new: "",
    newCheck: "",
  });

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setPassInfo((s) => ({ ...s, [name]: value }));
  };

  const onOk = () => {
    // axios.post("/dataeye-admin/portal/myPwd?oper=updateMyPwd", )
  };

  const onCloseHandler = () => {
    setPassInfo({
      current: "",
      new: "",
      newCheck: "",
    });
    props.onClose();
  };

  const onCancel = () => {
    setPassInfo({
      current: "",
      new: "",
      newCheck: "",
    });
  };

  return (
    <>
      <Modal
        title={`비밀번호조회`}
        visible={props.visible}
        onClose={onCloseHandler}
        onOk={onOk}
        onCancel={onCancel}
        okText="저장"
        cancelText="닫기"
        size="md"
      >
        <div>
          <table className="w-full border-y-slate-500 border-y">
            <tbody>
              <tr className="border-b border-slate-300">
                <th className="w-32 text-xs text-right p-2 pr-4 bg-slate-200  ">
                  기존 비밀번호
                </th>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        type="password"
                        value={passInfo.current}
                        onChange={onChange}
                        name="current"
                        className={`w-full outline-none bg-slate-300`}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="w-32 text-xs text-right p-2 pr-4 bg-slate-200  ">
                  변경할 비밀번호
                </th>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        type="password"
                        value={passInfo.new}
                        onChange={onChange}
                        name="new"
                        className={`w-full outline-none bg-slate-300`}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="w-32 text-xs text-right p-2 pr-4 bg-slate-200  ">
                  비밀번호 재확인
                </th>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Input
                        type="password"
                        value={passInfo.newCheck}
                        onChange={onChange}
                        name="newCheck"
                        className={`w-full outline-none bg-slate-300`}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
